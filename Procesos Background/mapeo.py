import sys
import folium
import requests
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point, Polygon
from sqlalchemy import create_engine
from folium.plugins import MiniMap

from google.cloud import storage
import os

def upload_to_bucket(bucket_name, source_file_name, destination_blob_name):
    """Sube un archivo al bucket de Google Cloud Storage."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    return blob.public_url

# Conectarse a la base de datos usando SQLAlchemy
engine = create_engine("mysql+mysqlconnector://root:wtRykrEX9As8wN@localhost/geomotica")
id_analisis = sys.argv[1]
tabla = sys.argv[2]
polygon_path = sys.argv[3]  # Ruta al archivo del polígono

# Consulta SQL para obtener datos
query = f"""SELECT LONGITUD, LATITUD, CULTIVO, NOMBRE_FINCA, ACTIVIDAD,
            FECHA_INICIO, HORA_INICIO, HORA_FINAL
            FROM {tabla} WHERE ID_ANALISIS = {id_analisis};"""

df = pd.read_sql(query, engine)

# Cargar archivo de polígono
polygon = gpd.read_file(polygon_path)

# Convertir puntos a geometrías y crear GeoDataFrame
df['geometry'] = df.apply(lambda row: Point(row['LONGITUD'], row['LATITUD']), axis=1)
gdf = gpd.GeoDataFrame(df, geometry='geometry')

# Filtrar puntos que están dentro del polígono
inside_polygon = gdf[gdf.geometry.within(polygon.geometry[0])]

# Crear mapa centrado en la primera coordenada con opción de satélite
tiles_option = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
attribution = "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"

m = folium.Map(location=[inside_polygon['LATITUD'].iloc[0], inside_polygon['LONGITUD'].iloc[0]], zoom_start=15, tiles=tiles_option, attr=attribution)

# Añadir trazado de puntos dentro del polígono
locations = inside_polygon[['LATITUD', 'LONGITUD']].values
folium.PolyLine(locations, color="blue", weight=2.5).add_to(m)

# Añadir popup a cada punto con información relevante
for _, row in inside_polygon.iterrows():
    popup_content = f"""
    <strong>Cultivo:</strong> {row['CULTIVO']}<br>
    <strong>Finca:</strong> {row['NOMBRE_FINCA']}<br>
    <strong>Actividad:</strong> {row['ACTIVIDAD']}<br>
    <strong>Fecha:</strong> {row['FECHA_INICIO']}<br>
    <strong>Horario:</strong> {row['HORA_INICIO']} - {row['HORA_FINAL']}
    """
    folium.CircleMarker((row['LATITUD'], row['LONGITUD']), radius=5, color="blue").add_child(folium.Popup(popup_content)).add_to(m)

# Añadir controles de capas y minimapa
folium.LayerControl().add_to(m)
minimap = MiniMap()
m.add_child(minimap)

# Guardar el mapa como archivo HTML temporal
nombre_archivo_temp = f"/tmp/mapa_{id_analisis}.html"
m.save(nombre_archivo_temp)

# Subir el archivo al bucket de Google Cloud Storage y enviar al servidor
nombre_bucket = "geomotica_mapeo"
nombre_archivo_bucket = f"mapas/mapa_{id_analisis}.html"
url_archivo = upload_to_bucket(nombre_bucket, nombre_archivo_temp, nombre_archivo_bucket)
api_url = "http://localhost:3001/socket/reciveMap"
data = {'htmlContent': url_archivo}
response = requests.post(api_url, json=data)
print(f"Mapa subido con éxito a {url_archivo}")

# Eliminar el archivo temporal
os.remove(nombre_archivo_temp)
print(f"Archivo temporal eliminado: {nombre_archivo_temp}")
