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
from osgeo import ogr
from shapely.validation import explain_validity
from shapely.geometry import shape, LineString, mapping
from pyproj import CRS


# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Set up Google Cloud credentials
credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
if not credentials_path:
    raise EnvironmentError("GOOGLE_APPLICATION CREDENTIALS environment variable not set.")
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
def detect_intersections(lines):
    """Detect intersections in a set of LineStrings and return points of intersections."""

    intersections = []
    for i, line1 in enumerate(lines):
        for line2 in lines[i+1:]:
            if line1.intersects(line2):
                intersection = line1.intersection(line2)
                if isinstance(intersection, Point):
                    intersections.append(intersection)
                elif isinstance(intersection, MultiLineString):
                    intersections.extend([point for point in intersection])
                elif isinstance(intersection, LineString):
                    intersections.append(intersection)
    return intersections

def split_line_at_intersections(line, intersections):
    """Split a LineString at specified points of intersections."""
    for point in intersections:
        if point.intersects(line):
            line = split(line, point)
    return list(line)

def split_lines(geojson_data):
    """Split lines into individual segments and separate them without connections."""
    features = geojson_data['features']
    all_lines = []

    # Extract all LineStrings and MultiLineStrings
    for feature in features:
        geom = shape(feature['geometry'])
        if isinstance(geom, LineString):
            all_lines.append(geom)
        elif isinstance(geom, MultiLineString):
            for line in geom:
                all_lines.append(line)

    # Detect intersections
    intersections = detect_intersections(all_lines)

    # Split lines at intersections
    split_segments = []
    for line in all_lines:
        split_segments.extend(split_line_at_intersections(line, intersections))

    # Use a graph to separate individual lines
    G = nx.Graph()
    for segment in split_segments:
        coords = segment.coords
        for i in range(len(coords) - 1):
            G.add_edge(coords[i], coords[i+1], geometry=LineString([coords[i], coords[i+1]]))

    individual_lines = []
    for component in nx.connected_components(G):
        lines = [G[u][v]['geometry'] for u, v in nx.edges(G, component)]
        merged_line = linemerge(lines)
        individual_lines.append(merged_line)

    # Create new GeoJSON features from individual lines
    new_features = []
    for line in individual_lines:
        new_features.append({
            'type': 'Feature',
            'properties': {},  # Add properties if needed
            'geometry': mapping(line)
        })

    new_geojson = {
        'type': 'FeatureCollection',
        'features': new_features
    }

    return new_geojson

def process_kml(kml_files, id_analisis, bucket_name, storage_client):
    """Process multiple KML files, ensuring that geometries are handled correctly and combining them into a single GeoJSON."""
    all_features = []
    current_linestring = None
    for kml_path in kml_files:
        logging.info(f"Processing KML file: {kml_path}")
        ds = ogr.Open(kml_path)
        if ds is None:
            logging.error(f"Failed to open KML file: {kml_path}")
            continue
        kml_layer = ds.GetLayer()
        for feature in kml_layer:
            geom = feature.GetGeometryRef()
            if geom is None:
                logging.warning(f"No geometry found for feature in file: {kml_path}")
                continue

            try:
                geom_json = json.loads(geom.ExportToJson())
                shapely_geom = shape(geom_json)
            except Exception as e:
                logging.error(f"Failed to convert geometry to shapely object: {e}")
                continue

            if not shapely_geom.is_valid:
                logging.error(f"Invalid geometry skipped: {explain_validity(shapely_geom)}")
                continue

            normalized_properties = normalize_properties(feature.items())
            normalized_properties['type'] = 'KML'

            if isinstance(shapely_geom, LineString):
                if current_linestring is None:
                    current_linestring = shapely_geom
                else:
                    if current_linestring.coords[-1] == shapely_geom.coords[0]:
                        current_linestring = LineString(list(current_linestring.coords) + list(shapely_geom.coords[1:]))
                    else:
                        all_features.append({
                            'properties': normalized_properties,
                            'type': 'Feature',
                            'geometry': json.loads(json.dumps(mapping(current_linestring)))
                        })
                        current_linestring = shapely_geom

            elif isinstance(shapely_geom, MultiLineString):
                for line in shapely_geom:
                    if current_linestring is None:
                        current_linestring = line
                    else:
                        if current_linestring.coords[-1] == line.coords[0]:
                            current_linestring = LineString(list(current_linestring.coords) + list(line.coords[1:]))
                        else:
                            all_features.append({
                                'properties': normalized_properties,
                                'type': 'Feature',
                                'geometry': json.loads(json.dumps(mapping(current_linestring)))
                            })
                            current_linestring = line

            elif isinstance(shapely_geom, (Polygon, MultiPolygon)):
                logging.info(f"Polygon geometry found and will be skipped for file: {kml_path}")
            else:
                logging.warning(f"Unsupported geometry type: {geom.GetGeometryName()} in file: {kml_path}")

    if current_linestring is not None:
        all_features.append({
            'properties': normalized_properties,
            'type': 'Feature',
            'geometry': json.loads(json.dumps(mapping(current_linestring)))
        })

    if not all_features:
        raise ValueError("No valid geometries to process.")

    # Determine CRS based on the first non-empty file processed
    spatial_ref = kml_layer.GetSpatialRef()
    if spatial_ref:
        srs = osr.SpatialReference(str(spatial_ref))
        srs.AutoIdentifyEPSG()
        crs = CRS.from_epsg(srs.GetAttrValue("AUTHORITY", 1))
    else:
        crs = "EPSG:4326"

    # Create a GeoDataFrame from all features
    gdf = gpd.GeoDataFrame.from_features(all_features, crs=crs)
    geojson_data = gdf.to_json()

    destination_blob_name = f"geojson_files/{id_analisis}.geojson"
    return upload_to_bucket(bucket_name, json.loads(geojson_data), destination_blob_name, storage_client)


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

id_analisis = sys.argv[1]
polygon_folder = sys.argv[2]
bucket_name = 'geomotica_mapeo'
api_url = "http://localhost:3001/socket/updateGeoJSONLayer"

signed_url = load_and_upload_polygon(polygon_folder, id_analisis, bucket_name, storage_client)
print(f"GeoJSON file uploaded. Access it here: {signed_url}")

response_text = send_signed_url_to_api(api_url, signed_url)
print(f"API response: {response_text}")
