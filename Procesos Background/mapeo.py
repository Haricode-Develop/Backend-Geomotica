import sys
import folium
import pandas as pd
from sqlalchemy import create_engine
from folium.plugins import MiniMap
from google.cloud import storage
import os
import geopandas as gpd
import requests

# Define los parámetros iniciales para la paginación
print("************** PARAMETROS QUE SE PASAN AL MAPEO **************")
print(sys.argv)
offset = int(sys.argv[4]) if len(sys.argv) > 4 else 0
limit = 10000  # Define la cantidad de filas por lote
polygon_folder = sys.argv[3]  # La carpeta donde se descomprimió el archivo ZIP

def upload_to_bucket(bucket_name, source_file_name, destination_blob_name):
    """Sube un archivo al bucket de Google Cloud Storage."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    return blob.public_url

# Conexión a la base de datos usando SQLAlchemy
engine = create_engine("mysql+mysqlconnector://instancia:123456@34.172.98.144/geomotica")
id_analisis = sys.argv[1]
tabla = sys.argv[2]

# Nombre del bucket y del archivo en el bucket
nombre_bucket = "geomotica_mapeo"
nombre_archivo_bucket = f"mapas/mapa_{id_analisis}.html"

# Inicializa el mapa solo si es el primer lote
if offset == 0:
    m = folium.Map(location=[0, 0], zoom_start=2)  # Ubicación y zoom por defecto

# Encuentra el archivo .shp en el directorio dado
shp_file = next((f for f in os.listdir(polygon_folder) if f.endswith('.shp')), None)
if shp_file is None:
    raise FileNotFoundError("No se encontró un archivo .shp en la carpeta del polígono.")

# Cargar el polígono con Geopandas
gdf_polygon = gpd.read_file(os.path.join(polygon_folder, shp_file))
polygon = gdf_polygon.unary_union  # Combina los polígonos si hay más de uno

while True:
    # Consulta SQL para obtener datos por lotes
    query = f"""
    SELECT LONGITUD, LATITUD, CULTIVO, NOMBRE_FINCA, ACTIVIDAD,
            FECHA_INICIO, HORA_INICIO, HORA_FINAL
            FROM {tabla} WHERE ID_ANALISIS = {id_analisis}
            LIMIT {limit} OFFSET {offset};
    """
    df = pd.read_sql(query, engine)

    # Si no hay más datos, rompe el bucle
    if df.empty:
        break

    # Convierte el DataFrame de Pandas a un GeoDataFrame
    gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.LONGITUD, df.LATITUD))

    # Filtra solo los puntos que están dentro del polígono
    gdf = gdf[gdf.geometry.within(polygon)]

    # Si después del filtro no hay datos, continúa con el siguiente lote
    if gdf.empty:
        offset += limit
        continue

    # Genera la capa de datos y la convierte a GeoJSON
    layer_data = gdf.to_json()

    # Envía la capa al servidor Node.js mediante una solicitud HTTP POST
    response = requests.post("http://localhost:3001/updateMapLayer", json={'layerData': layer_data})
    if response.status_code == 200:
        print(f"Capa enviada correctamente al servidor Node.js, offset: {offset}")
    else:
        print(f"Error al enviar la capa: {response.status_code}")

    # Incrementa el offset para el siguiente lote
    offset += limit

# Añade controles de capas y minimapa solo después de procesar todos los lotes
folium.LayerControl().add_to(m)
MiniMap().add_to(m)

# Guarda el mapa como archivo HTML temporal
nombre_archivo_temp = f"/tmp/mapa_{id_analisis}.html"
m.save(nombre_archivo_temp)

# Sube el archivo completo al bucket de Google Cloud Storage
url_archivo = upload_to_bucket(nombre_bucket, nombre_archivo_temp, nombre_archivo_bucket)
print(f"Mapa subido con éxito a {url_archivo}")

# Elimina el archivo temporal
os.remove(nombre_archivo_temp)
print(f"Archivo temporal eliminado: {nombre_archivo_temp}")
