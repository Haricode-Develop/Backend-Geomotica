import sys
import folium
import pandas as pd
from sqlalchemy import create_engine
from folium.plugins import MiniMap
from google.cloud import storage
import os
import json
import geopandas as gpd
from shapely.geometry import Point
import requests
import logging

# Configuración del logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def upload_to_bucket(bucket_name, file_content, destination_blob_name):
    """Sube un archivo al bucket de Google Cloud Storage."""
    try:
        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(destination_blob_name)

        blob.upload_from_string(file_content, content_type='application/json')
        logging.info(f"Archivo subido exitosamente a {destination_blob_name} en {bucket_name}")
        return blob.public_url
    except Exception as e:
        logging.error(f"Error al subir archivo al bucket: {e}")
        raise

def load_polygon(polygon_file):
    """Carga un polígono desde un archivo GeoJSON."""
    try:
        gdf = gpd.read_file(polygon_file)
        logging.info(f"Polígono cargado desde {polygon_file}")
        return gdf.iloc[0].geometry
    except Exception as e:
        logging.error(f"Error al cargar el polígono: {e}")
        raise

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
polygon_file = sys.argv[3]

# Cargar el polígono
polygon = load_polygon(polygon_file)

# Consulta SQL para obtener datos
try:
    query = f"""SELECT LONGITUD, LATITUD, PILOTO_AUTOMATICO, VELOCIDAD_Km_H
                FROM {tabla} WHERE ID_ANALISIS = {id_analisis};"""
    df = pd.read_sql(query, engine)
    logging.info("Datos obtenidos de la base de datos")
except Exception as e:
    logging.error(f"Error al obtener datos de la base de datos: {e}")
    raise

# Filtrar los datos según el polígono
df_filtered = df[df.apply(lambda row: point_in_polygon((row['LONGITUD'], row['LATITUD']), polygon), axis=1)]
logging.info("Datos filtrados según el polígono")

# Determinar qué conjunto de datos usar
if df_filtered.empty:
    logging.warning("No se encontraron datos dentro del polígono. Se utilizarán los datos originales.")
    df_to_use = df
else:
    df_to_use = df_filtered

# Crear mapa y configurar tiles
tiles_option = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
attribution = "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"

if not df_to_use.empty:
    m = folium.Map(location=[df_to_use['LATITUD'].iloc[0], df_to_use['LONGITUD'].iloc[0]], zoom_start=15, tiles=tiles_option, attr=attribution)
    MiniMap().add_to(m)
    folium.LayerControl().add_to(m)
    logging.info("Mapa base creado")
else:
    logging.error("df_to_use está vacío, no se puede crear el mapa.")
    raise ValueError("No hay datos para mostrar en el mapa.")

# Generar GeoJSON de los puntos seleccionados
geojson_data = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [row['LONGITUD'], row['LATITUD']]
            },
            "properties": {
                "piloto_automatico": row['PILOTO_AUTOMATICO'],
                "velocidad": row['VELOCIDAD_Km_H']
            }
        } for _, row in df_to_use.iterrows()
    ]
}
logging.info("GeoJSON generado")

# Subir el GeoJSON al bucket de Google Cloud Storage
nombre_bucket = "geomotica_mapeo"
nombre_archivo_bucket = f"capas/capa_{id_analisis}.json"
url_capa = upload_to_bucket(nombre_bucket, json.dumps(geojson_data), nombre_archivo_bucket)

# Enviar URL de la capa al servidor
api_url = "http://localhost:3001/socket/updateGeoJSONLayer"
data = {'geojsonData': geojson_data}  # Enviar el contenido GeoJSON directamente
try:
    requests.post(api_url, json=data)
    logging.info("URL de la capa enviada al servidor")
except Exception as e:
    logging.error(f"Error al enviar la URL de la capa al servidor: {e}")
    raise

# Guardar y subir el mapa base como HTML
nombre_archivo_temp = f"/tmp/mapa_base_{id_analisis}.html"
m.save(nombre_archivo_temp)
url_mapa_base = upload_to_bucket(nombre_bucket, nombre_archivo_temp, f"mapas/mapa_base_{id_analisis}.html")
os.remove(nombre_archivo_temp)
logging.info("Mapa base guardado y subido")

# Enviar URL del mapa base al servidor
data = {'htmlContent': url_mapa_base}
try:
    requests.post(api_url, json=data)
    logging.info("URL del mapa base enviada al servidor")
except Exception as e:
    logging.error(f"Error al enviar la URL del mapa base al servidor: {e}")
    raise

logging.info("Proceso de mapeo finalizado")
