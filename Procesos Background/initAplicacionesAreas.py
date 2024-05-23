from osgeo import osr
from unidecode import unidecode
import geopandas as gpd
import json
from google.cloud import storage
from google.oauth2 import service_account
import os
import glob
import logging
from datetime import timedelta
import sys
import requests
from shapely.geometry import shape, mapping
from pyproj import CRS
import kml_algoritm
import pandas as pd
from shapely.geometry import Polygon, LineString, MultiLineString, GeometryCollection, Point, MultiPoint
from shapely.ops import unary_union
import matplotlib.pyplot as plt
import zipfile
from tempfile import TemporaryDirectory
from fastkml import kml
import numpy as np
from scipy.ndimage import binary_fill_holes
from skimage.measure import find_contours
import alphashape


# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Set up Google Cloud credentials
credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
if not credentials_path:
    raise EnvironmentError("GOOGLE_APPLICATION_CREDENTIALS environment variable not set.")
credentials = service_account.Credentials.from_service_account_file(credentials_path)
storage_client = storage.Client(credentials=credentials)

def normalize_properties(properties):
    """Normalize properties to ensure they are ASCII safe."""
    return {unidecode(key): unidecode(str(value)) for key, value in properties.items()}

def upload_to_bucket(bucket_name, geojson_data, destination_blob_name, storage_client):
    """Upload a file to Google Cloud Storage and return a signed URL."""
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)
    file_content = json.dumps(geojson_data)
    blob.upload_from_string(file_content, content_type='application/json')
    signed_url = blob.generate_signed_url(expiration=timedelta(hours=8), method='GET')
    logging.info(f"File successfully uploaded to {destination_blob_name} in {bucket_name}")
    return signed_url

def find_case_insensitive_column_name(df, column_name):
    """Find the actual column name in the dataframe, which matches the provided column_name case-insensitively."""
    for col in df.columns:
        if col.lower() == column_name.lower():
            return col
    raise ValueError(f"Column name '{column_name}' not found in the dataframe.")

def process_kml(kml_paths, id_analisis, bucket_name, storage_client, resolution=1000, alpha=4500, buffer_distance=-0.0001, pendiente_umbral=0.001, distancia_metros=10):
    """Process multiple KML files, ensuring that geometries are handled correctly and combining them into a single GeoJSON."""
    gdf = kml_algoritm.cargar_kml_desde_kml(kml_paths)
    poligono = kml_algoritm.crear_poligono_dinamico(gdf, resolution, alpha)
    poligono_reducido = poligono.buffer(buffer_distance)  # Reduce el tamaño del polígono de manera sutil
    cortadas = kml_algoritm.cortar_intersecciones(gdf, poligono_reducido)
    lineas_individuales = []

    if isinstance(cortadas, GeometryCollection):
        cortadas = [geom for geom in cortadas.geoms]
    elif isinstance(cortadas, (LineString, MultiLineString)):
        cortadas = [cortadas]
    else:
        cortadas = []

    for geom in cortadas:
        lineas_individuales.extend(kml_algoritm.separar_lineas(geom))

    for i, linea in enumerate(lineas_individuales):
        if isinstance(linea, (LineString, MultiLineString)):
            coords = list(linea.coords)
            if len(coords[0]) == 3:
                lineas_individuales[i] = LineString([(x, y) for x, y, z in coords])

    lineas_utiles = kml_algoritm.eliminar_lineas_no_verticales_por_interseccion(lineas_individuales, pendiente_umbral)
    lineas_completadas = kml_algoritm.completar_lineas_verticales(lineas_utiles, poligono_reducido, distancia_metros)

    gdf_lineas = gpd.GeoDataFrame(geometry=lineas_completadas)
    gdf_poligono = gpd.GeoDataFrame(geometry=[poligono_reducido])

    # Agregar la propiedad 'type' con el valor 'KML' a todas las features
    gdf_lineas['type'] = 'KML'

    geojson_data = json.loads(gdf_lineas.to_json())

    destination_blob_name = f"geojson_files/{id_analisis}.geojson"
    logging.info("Uploading combined GeoJSON data to bucket.")
    return upload_to_bucket(bucket_name, geojson_data, destination_blob_name, storage_client)


def load_and_upload_polygon(polygon_folder, id_analisis, bucket_name, storage_client):
    """Load the Shapefile or KML, convert to GeoJSON including specified fields, and upload to GCS."""
    polygon_files = glob.glob(os.path.join(polygon_folder, '*.shp'))
    kml_files = glob.glob(os.path.join(polygon_folder, '*.kml'))

    if polygon_files:
        largest_shapefile = max(polygon_files, key=os.path.getsize)
        gdf = gpd.read_file(largest_shapefile)

        fields = ['altura', 'velocidad', 'dosisreal']
        actual_field_names = {field: find_case_insensitive_column_name(gdf, field) for field in fields}
        gdf = gdf[[actual_field_names[field] for field in fields] + ['geometry']]
        for _, row in gdf.iterrows():
            row['type'] = 'SHP'

        geojson_data = gdf.to_json()

        destination_blob_name = f"geojson_files/{id_analisis}.geojson"
        signed_url = upload_to_bucket(bucket_name, json.loads(geojson_data), destination_blob_name, storage_client)
        return signed_url
    elif kml_files:
        return process_kml(kml_files, id_analisis, bucket_name, storage_client)
    else:
        raise ValueError("No compatible files found in the provided directory.")

def send_signed_url_to_api(api_url, signed_url):
    """Send the signed URL to the API endpoint."""
    data = {'geojsonData': signed_url}
    response = requests.post(api_url, json=data)
    logging.info("Signed URL sent to the server successfully.")
    return response.text

if __name__ == "__main__":
    id_analisis = sys.argv[1]
    polygon_folder = sys.argv[2]
    bucket_name = 'geomotica_mapeo'
    api_url = "http://localhost:3001/socket/updateGeoJSONLayer"

    signed_url = load_and_upload_polygon(polygon_folder, id_analisis, bucket_name, storage_client)
    print(f"GeoJSON file uploaded. Access it here: {signed_url}")

    response_text = send_signed_url_to_api(api_url, signed_url)
    print(f"API response: {response_text}")