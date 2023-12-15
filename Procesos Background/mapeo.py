import sys
import os
import requests
import folium
import pandas as pd
import geopandas as gpd
from shapely.geometry import Point
from sqlalchemy import create_engine
from folium.plugins import MiniMap
from google.cloud import storage

def upload_to_bucket(bucket_name, source_file_name, destination_blob_name):
    """Sube un archivo al bucket de Google Cloud Storage."""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_filename(source_file_name)

    return blob.public_url

def find_shp_file(directory):
    """Encuentra el primer archivo .shp en el directorio dado."""
    for file in os.listdir(directory):
        if file.endswith(".shp"):
            return os.path.join(directory, file)
    return None

# Conectarse a la base de datos usando SQLAlchemy
engine = create_engine("mysql+mysqlconnector://root:wtRykrEX9As8wN@localhost/geomotica")
id_analisis = sys.argv[1]
tabla = sys.argv[2]

# Ruta de la carpeta pasada como argumento (puede ser None)
folder_path = sys.argv[3] if len(sys.argv) > 3 else None

# Intenta encontrar el archivo .shp si se proporcionó una carpeta
shp_file_path = find_shp_file(folder_path) if folder_path else None

# Crear GeoDataFrame a partir de los datos de la base de datos
query = f"""SELECT LONGITUD, LATITUD, CULTIVO, NOMBRE_FINCA, ACTIVIDAD,
            FECHA_INICIO, HORA_INICIO, HORA_FINAL
            FROM {tabla} WHERE ID_ANALISIS = {id_analisis};"""
df = pd.read_sql(query, engine)
df['geometry'] = df.apply(lambda row: Point(row['LONGITUD'], row['LATITUD']), axis=1)
gdf = gpd.GeoDataFrame(df, geometry='geometry')

# Filtrar puntos dentro del polígono si se proporciona uno, sino usar todos los puntos
if shp_file_path:
    polygon = gpd.read_file(shp_file_path)
    points_to_use = gdf[gdf.geometry.within(polygon.geometry[0])]
else:
    points_to_use = gdf

# Crear mapa con una ubicación predeterminada si no hay puntos
tiles_option = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
attribution = "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
default_location = [0, 0]  # Puedes cambiar esto por una ubicación central o significativa

if not points_to_use.empty:
    first_location = points_to_use.iloc[0]
    map_location = [first_location['LATITUD'], first_location['LONGITUD']]
    zoom_start = 15
else:
    print("No se encontraron puntos para mostrar en el mapa. Usando ubicación predeterminada.")
    map_location = default_location
    zoom_start = 2

m = folium.Map(location=map_location, zoom_start=zoom_start, tiles=tiles_option, attr=attribution)

# Añadir trazado de puntos y popups
for _, row in points_to_use.iterrows():
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

# Guardar y subir el mapa
nombre_archivo_temp = f"/tmp/mapa_{id_analisis}.html"
m.save(nombre_archivo_temp)
nombre_bucket = "geomotica_mapeo"
nombre_archivo_bucket = f"mapas/mapa_{id_analisis}.html"
url_archivo = upload_to_bucket(nombre_bucket, nombre_archivo_temp, nombre_archivo_bucket)

api_url = "http://localhost:3001/socket/reciveMap"
data = {'htmlContent': url_archivo}
response = requests.post(api_url, json=data)
requests.post("http://localhost:3001/socket/loadingAnalysis", data={"progress": 75})

print(f"Mapa subido con éxito a {url_archivo}")
os.remove(nombre_archivo_temp)
print(f"Archivo temporal eliminado: {nombre_archivo_temp}")
