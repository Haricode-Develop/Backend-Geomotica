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

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def upload_to_bucket(bucket_name, geojson_data, destination_blob_name, storage_client):
    """Upload a file to Google Cloud Storage and return a signed URL."""
    try:
        bucket = storage_client.bucket(bucket_name)
        blob = bucket.blob(destination_blob_name)

        file_content = json.dumps(geojson_data)
        blob.upload_from_string(file_content, content_type='application/json')

        signed_url = blob.generate_signed_url(expiration=timedelta(hours=8), method='GET')

        logging.info(f"File successfully uploaded to {destination_blob_name} in {bucket_name}")
        return signed_url
    except Exception as e:
        logging.error(f"Error uploading file to bucket: {e}")
        raise

def find_case_insensitive_column_name(df, column_name):
    """Find the actual column name in the dataframe, which matches the provided column_name case-insensitively."""
    for col in df.columns:
        if col.lower() == column_name.lower():
            return col
    raise ValueError(f"Column name '{column_name}' not found in the dataframe.")

def load_and_upload_polygon(polygon_folder, id_analisis, bucket_name, storage_client):
    """Load the Shapefile, convert to GeoJSON including specified fields, and upload to GCS."""
    try:
        polygon_files = glob.glob(os.path.join(polygon_folder, '*.shp'))
        if not polygon_files:
            raise ValueError("No Shapefiles found in the provided directory.")

        largest_shapefile = max(polygon_files, key=os.path.getsize)
        gdf = gpd.read_file(largest_shapefile)

        fields = ['altura', 'velocidad', 'dosisreal']
        actual_field_names = {field: find_case_insensitive_column_name(gdf, field) for field in fields}

        gdf = gdf[[actual_field_names[field] for field in fields] + ['geometry']]

        geojson_data = gdf.to_json()

        destination_blob_name = f"geojson_files/{id_analisis}.geojson"
        signed_url = upload_to_bucket(bucket_name, json.loads(geojson_data), destination_blob_name, storage_client)

        return signed_url
    except Exception as e:
        logging.error(f"Error processing the Shapefile: {e}")
        raise

def send_signed_url_to_api(api_url, signed_url):
    """Send the signed URL to the API endpoint."""
    data = {'geojsonData': signed_url}
    try:
        response = requests.post(api_url, json=data)
        logging.info("Signed URL sent to the server successfully.")
        return response.text
    except Exception as e:
        logging.error(f"Error sending the signed URL to the API endpoint: {e}")
        raise

credentials_path = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
if credentials_path:
    credentials = service_account.Credentials.from_service_account_file(credentials_path)
    storage_client = storage.Client(credentials=credentials)
else:
    raise EnvironmentError("GOOGLE_APPLICATION CREDENTIALS environment variable not set.")

id_analisis = sys.argv[1]
polygon_folder = sys.argv[2]
bucket_name = 'geomotica_mapeo'
api_url = "http://localhost:3001/socket/updateGeoJSONLayer"

signed_url = load_and_upload_polygon(polygon_folder, id_analisis, bucket_name, storage_client)
print(f"GeoJSON file uploaded. Access it here: {signed_url}")

response_text = send_signed_url_to_api(api_url, signed_url)
print(f"API response: {response_text}")
