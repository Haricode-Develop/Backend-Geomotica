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

def upload_to_bucket(bucket_name, file_content, destination_blob_name):
    """Sube un archivo al bucket de Google Cloud Storage."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_string(file_content, content_type='application/json')
    return blob.public_url

def load_polygon(polygon_file):
    """Carga un polígono desde un archivo GeoJSON."""
    gdf = gpd.read_file(polygon_file)
    return gdf.iloc[0].geometry

def point_in_polygon(point, polygon):
    """Verifica si un punto está dentro de un polígono."""
    return polygon.contains(Point(point))

# Conectarse a la base de datos usando SQLAlchemy
engine = create_engine("mysql+mysqlconnector://root:wtRykrEX9As8wN@localhost/geomotica")
id_analisis = sys.argv[1]
tabla = sys.argv[2]
polygon_file = sys.argv[3]  # Ruta al archivo del polígono

# Cargar el polígono
polygon = load_polygon(polygon_file)

# Consulta SQL para obtener datos
query = f"""SELECT LONGITUD, LATITUD
            FROM {tabla} WHERE ID_ANALISIS = {id_analisis};"""

df = pd.read_sql(query, engine)

# Filtrar los datos según el polígono
df = df[df.apply(lambda row: point_in_polygon((row['LONGITUD'], row['LATITUD']), polygon), axis=1)]

# Crear mapa centrado en la primera coordenada con opción de satélite
tiles_option = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
attribution = "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"

m = folium.Map(location=[df['LATITUD'].iloc[0], df['LONGITUD'].iloc[0]], zoom_start=15, tiles=tiles_option, attr=attribution)

# Añadir minimapa y controles de capas
MiniMap().add_to(m)
folium.LayerControl().add_to(m)

# Generar GeoJSON de los puntos
geojson_data = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [row['LONGITUD'], row['LATITUD']]
            }
        } for _, row in df.iterrows()
    ]
}

# Subir el GeoJSON al bucket de Google Cloud Storage
nombre_bucket = "geomotica_mapeo"
nombre_archivo_bucket = f"capas/capa_{id_analisis}.json"
url_capa = upload_to_bucket(nombre_bucket, json.dumps(geojson_data), nombre_archivo_bucket)

# Enviar URL de la capa al servidor para que la actualice en el cliente
api_url = "http://localhost:3001/socket/updateGeoJSONLayer"  # Reemplaza con tu URL del servidor
data = {'layerUrl': url_capa}
requests.post(api_url, json=data)

# Guardar y subir el mapa base como HTML
nombre_archivo_temp = f"/tmp/mapa_base_{id_analisis}.html"
m.save(nombre_archivo_temp)
url_mapa_base = upload_to_bucket(nombre_bucket, nombre_archivo_temp, f"mapas/mapa_base_{id_analisis}.html")
os.remove(nombre_archivo_temp)

# Enviar URL del mapa base al servidor
data = {'htmlContent': url_mapa_base}
requests.post(api_url, json=data)
