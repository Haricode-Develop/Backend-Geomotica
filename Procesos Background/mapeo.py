import sys
import gc
import pandas as pd
from sqlalchemy import create_engine, text
import geopandas as gpd
from shapely.geometry import Point, Polygon
import requests
import logging
import json
import os
import glob
import alphashape
from google.cloud import storage
from datetime import datetime, timedelta
from google.oauth2 import service_account

# Configuración del logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Cargar credenciales explícitamente
credentials = service_account.Credentials.from_service_account_file(
    os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
)
print(f"Credenciales desde: {os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')}")

# Pasar las credenciales al cliente de Storage
storage_client = storage.Client(credentials=credentials)

def upload_to_bucket(bucket_name, geojson_data, destination_blob_name):
    """Actualiza un archivo en el bucket de Google Cloud Storage y devuelve una URL firmada."""
    try:
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(destination_blob_name)

        # Verifica si el archivo ya existe y carga su contenido
        if blob.exists():
            existing_data = json.loads(blob.download_as_string(client=storage_client))
            # Asegúrate de que existing_data es un diccionario con una lista en 'features'
            if 'features' in existing_data and isinstance(existing_data['features'], list):
                # Combina el GeoJSON existente con los nuevos datos
                existing_data["features"].extend(geojson_data["features"])
            file_content = json.dumps(existing_data)
        else:
            file_content = json.dumps(geojson_data)

        blob.upload_from_string(file_content, content_type='application/json')

        # Generar URL firmada para el blob
        url_firmada = blob.generate_signed_url(expiration=timedelta(hours=8), method='GET')

        logging.info(f"Archivo actualizado exitosamente a {destination_blob_name} en {bucket_name}")
        return url_firmada
    except Exception as e:
        logging.error(f"Error al actualizar el archivo en el bucket: {e}")
        raise



def load_polygon(polygon_folder):
    """Carga el polígono con más datos desde un conjunto de archivos Shapefile."""
    try:
        # Encuentra todos los archivos .shp en el directorio
        polygon_files = glob.glob(os.path.join(polygon_folder, '*.shp'))
        if not polygon_files:
            raise ValueError(f"No se encontraron archivos .shp en {polygon_folder}")

        # Carga todos los geodataframes y selecciona el más grande
        largest_gdf = None
        max_size = 0
        for shp_file in polygon_files:
            gdf = gpd.read_file(shp_file)
            if len(gdf) > max_size:
                largest_gdf = gdf
                max_size = len(gdf)
                selected_file = shp_file

        if largest_gdf is None:
            raise ValueError(f"No se pudieron cargar los archivos .shp en {polygon_folder}")

        logging.info(f"El polígono más grande cargado desde {selected_file} con {max_size} registros.")
        return largest_gdf.unary_union, largest_gdf.to_json()
    except Exception as e:
        logging.error(f"Error al cargar el polígono más grande: {e}")
        return None, None

def calculate_dynamic_polygon(df, alpha=0.1):
    """Calcula la envolvente concava (concave hull) de los puntos en un DataFrame y devuelve el polígono resultante."""
    points = [(x, y) for x, y in zip(df.LONGITUD, df.LATITUD)]
    alpha_shape = alphashape.alphashape(points, alpha)
    return alpha_shape

def point_in_polygon(point, polygon):
    """Verifica si un punto está dentro de un polígono."""
    return polygon.contains(Point(point))

logging.info("Inicio del proceso de mapeo")

# Conectarse a la base de datos usando SQLAlchemy
try:
    engine = create_engine("mysql+mysqlconnector://instancia:123456@34.172.98.144/geomotica")
    logging.info("Conexión a la base de datos establecida")
except Exception as e:
    logging.error(f"Error al conectar con la base de datos: {e}")
    raise

id_analisis = sys.argv[1]
tabla = sys.argv[2]
polygon_folder = sys.argv[3]
offset = int(sys.argv[4])


logging.info("ESTOS SON LOS PARAMETROS DE PYTHON*****************************")
logging.info(f"ESTE ES EL ID ANALISIS: {id_analisis}")
logging.info(f"ESTA ES LA TABLA: {tabla}" )
logging.info(f"ESTE ES EL POLIGONO: {polygon_folder}" )
logging.info(f"ESTE ES EL OFFSET: {offset}" )



# Cargar el polígono
polygon, polygon_geojson = load_polygon(polygon_folder)
valid_polygon = polygon is not None
if valid_polygon:
    logging.info("Polígono válido y cargado correctamente.")
else:
    logging.warning("Polígono no válido o no se pudo cargar. Se continuarán otros procesos sin filtro de polígono.")


limit = 10000

# Consulta SQL para obtener datos
try:
    sql_query = text("""SELECT LONGITUD, LATITUD, PILOTO_AUTOMATICO, VELOCIDAD_Km_H, CALIDAD_DE_SENAL, CONSUMOS_DE_COMBUSTIBLE, AUTO_TRACKET, RPM, PRESION_DE_CORTADOR_BASE, TIEMPO_TOTAL, MODO_CORTE_BASE
                FROM {}
                WHERE ID_ANALISIS = :id_analisis
                LIMIT :limit OFFSET :offset;""".format(tabla))

    df = pd.read_sql(sql_query, engine, params={"id_analisis": id_analisis, "limit": limit, "offset": offset})
    logging.info(f"Datos obtenidos de la base de datos con OFFSET {offset}.")
except Exception as e:
    logging.error(f"Error al obtener datos de la base de datos: {e}")
    raise



df['TIEMPO_TOTAL'] = df['TIEMPO_TOTAL'].apply(str)

# Crear GeoDataFrame con todos los datos
gdf = gpd.GeoDataFrame(df, geometry=[Point(xy) for xy in zip(df.LONGITUD, df.LATITUD)])



dynamic_polygon = calculate_dynamic_polygon(df, alpha=1.0)  # Aquí puedes ajustar el valor de alpha según sea necesario
dynamic_polygon_geojson = gpd.GeoSeries([dynamic_polygon]).to_json()

all_points = [Point(xy) for xy in zip(df.LONGITUD, df.LATITUD)]

# Filtrar puntos dentro y fuera del polígono si es válido, de lo contrario usar datos originales
inside_gdf = gdf[gdf.geometry.within(polygon)] if valid_polygon else gpd.GeoDataFrame()
outside_gdf = gdf[~gdf.geometry.within(polygon)] if valid_polygon else gpd.GeoDataFrame()

def generate_geojson_features(gdf):
    features = []
    for index, row in gdf.iterrows():
        feature = {
            "type": "Feature",
            "geometry": json.loads(gpd.GeoSeries([row['geometry']]).to_json())['features'][0]['geometry'],
            "properties": row.drop(['geometry']).to_dict()
        }
        features.append(feature)
    return features


# Generar características GeoJSON para puntos dentro y fuera del polígono
inside_features = generate_geojson_features(inside_gdf)
outside_features = generate_geojson_features(outside_gdf)

# Agregar el polígono al GeoJSON si es válido
polygon_features = [json.loads(polygon_geojson)["features"][0]] if valid_polygon else []

# Crear GeoJSON final
geojson_data = {
    "type": "FeatureCollection",
    "features": inside_features + polygon_features + [json.loads(dynamic_polygon_geojson)["features"][0]]
}

logging.info(f"GeoJSON generado con {len(inside_features)} puntos dentro y {len(outside_features)} puntos fuera del polígono.")

# Subir el GeoJSON al bucket de Google Cloud Storage
nombre_bucket = "geomotica_mapeo"
nombre_archivo_bucket = f"capas/capa_{id_analisis}.json"
try:
    url_capa = upload_to_bucket(nombre_bucket, geojson_data, nombre_archivo_bucket)
    logging.info(f"GeoJSON subido al bucket: {url_capa}")
except Exception as e:
    logging.error(f"Error al subir GeoJSON al bucket: {e}")

# Enviar URL de la capa al servidor
api_url = "http://localhost:3001/socket/updateGeoJSONLayer"
data = {'geojsonData': url_capa}
try:
    requests.post(api_url, json=data)
    logging.info("URL de la capa enviada al servidor")
except Exception as e:
    logging.error(f"Error al enviar la URL de la capa al servidor: {e}")

# Actualizar el progreso del mapeo
api_url_loader = "http://localhost:3001/socket/loadingAnalysis"
data_loader = {"progress": 100, "message": "Se finaliza mapeo de datos, se procede a enviar los datos para su visualización"}
payload = json.dumps(data_loader)
headers = {'Content-Type': 'application/json'}
try:
    response = requests.post(api_url_loader, data=payload, headers=headers)
    logging.info("Proceso de mapeo finalizado")
except Exception as e:
    logging.error(f"Error al actualizar el progreso del mapeo: {e}")

finally:
    if 'engine' in locals():
        engine.dispose()
    gc.collect()
    logging.info("Recursos liberados y proceso de mapeo finalizado.")

logging.info("Proceso de mapeo finalizado")