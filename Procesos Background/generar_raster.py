import sys
import pandas as pd
import geopandas as gpd
from sqlalchemy import create_engine
from shapely.geometry import Point
import rasterio
import logging
from rasterio.transform import from_origin
from sklearn.preprocessing import LabelEncoder
from google.cloud import storage
from google.oauth2 import service_account
import numpy as np
import os

# Configuración de logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
ruta_credenciales = '/geomotica/procesos/analog-figure-382403-0c07b0baecfa.json'
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = ruta_credenciales

# Configuración inicial
GOOGLE_APPLICATION_CREDENTIALS = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
BUCKET_NAME = 'geomotica_mapeo'
ID_ANALISIS = sys.argv[1]
TABLA = sys.argv[2]
print(f"Credenciales desde: {os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')}")

credentials = service_account.Credentials.from_service_account_file(
    os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
)

# Pasar las credenciales al cliente de Storage
storage_client = storage.Client(credentials=credentials)

# Función para cargar datos desde la base de datos
def cargar_datos(tabla, id_analisis):
    logging.info("Iniciando la carga de datos desde la base de datos")
    try:
        engine = create_engine("mysql+mysqlconnector://instancia:123456@34.172.98.144/geomotica")
        query = f"""
        SELECT LONGITUD, LATITUD, AUTO_TRACKET, PILOTO_AUTOMATICO, MODO_CORTE_BASE, VELOCIDAD_Km_H, CALIDAD_DE_SENAL, CONSUMOS_DE_COMBUSTIBLE, RPM, PRESION_DE_CORTADOR_BASE, TIEMPO_TOTAL
        FROM {tabla.lower()}
        WHERE ID_ANALISIS = {id_analisis}
        """
        datos = pd.read_sql(query, engine)
        logging.info("Datos cargados correctamente desde la base de datos")
        return datos
    except Exception as e:
        logging.error(f"Error al cargar datos desde la base de datos: {e}")
        sys.exit(1)
def cargar_shapefile(id_analisis):
    logging.info(f"Cargando Shapefile para el análisis {id_analisis}")
    try:
        # Buscar archivos Shapefile en el bucket
        bucket = storage_client.get_bucket(BUCKET_NAME)
        blobs = list(bucket.list_blobs(prefix=f"shapeFiles/{id_analisis}/shape_id_{id_analisis}"))
        shapefile_parts = {}
        for blob in blobs:
            filename = blob.name.split('/')[-1]
            if filename.endswith(('.shp','.shx','.dbf','.prj')):
                blob.download_to_filename(filename)
                shapefile_parts[filename.split('.')[-1]] = filename
        # Cargar el Shapefile
        gdf = gpd.read_file(shapefile_parts['shp'])
        logging.info("Shapefile cargado con éxito")
        return gdf
    except Exception as e:
        logging.error(f"Error al cargar el Shapefile: {e}")
        sys.exit(1)

def cortar_raster_con_shapefile(raster, gdf_shapefile):
    logging.info("Iniciando el corte del raster con el Shapefile")
    try:
        if gdf_shapefile.crs != raster.crs:
            gdf_shapefile = gdf_shapefile.to_crs(raster.crs)

        # Cortar el raster
        out_image, out_transform = mask(raster, gdf_shapefile.geometry, crop=True)
        out_meta = raster.meta.copy()
        out_meta.update({"driver": "GTiff",
                         "height": out_image.shape[1],
                         "width": out_image.shape[2],
                         "transform": out_transform})
        return out_image, out_meta
    except Exception as e:
        logging.error(f"Error al cortar el raster: {e}")
        sys.exit(1)

# Procesar datos
def procesar_datos(datos):
    logging.info("Iniciando el procesamiento de los datos")
    try:
        gdf = gpd.GeoDataFrame(datos, geometry=gpd.points_from_xy(datos.LONGITUD, datos.LATITUD))
        gdf.crs = "EPSG:4326"

        def mapeo_valor(columna, valor):
            mapeo = {
                'auto_tracket': {'disengaged': 0, 'engaged': 1,'automatic': 1, 'manual': 0},
                'piloto_automatico': {'disengaged': 0, 'engaged': 1, 'automatic': 1, 'manual': 0},
                'modo_corte_base': {'disengaged': 0, 'engaged': 1, 'automatic': 1, 'manual': 0}
            }
            valor_normalizado = valor.lower()
            try:
                return mapeo[columna][valor_normalizado]
            except KeyError:
                logging.warning(f"Valor '{valor}' no reconocido para {columna}. Usando valor por defecto 0.")
                return 0

        # Aplica el mapeo a las columnas relevantes
        gdf['AUTO_TRACKET'] = gdf['AUTO_TRACKET'].apply(lambda x: mapeo_valor('auto_tracket', x))
        gdf['PILOTO_AUTOMATICO'] = gdf['PILOTO_AUTOMATICO'].apply(lambda x: mapeo_valor('piloto_automatico', x))
        gdf['MODO_CORTE_BASE'] = gdf['MODO_CORTE_BASE'].apply(lambda x: mapeo_valor('modo_corte_base', x))

        logging.info("Datos procesados exitosamente")
        return gdf
    except Exception as e:
        logging.error(f"Error general al procesar los datos: {e}")
        sys.exit(1)




# Ajuste dinámico del tamaño de píxel
def ajustar_tamano_pixel(gdf):
    logging.info("Ajustando el tamaño del píxel basado en los límites del conjunto de datos")
    try:
        bounds = gdf.total_bounds
        ancho = bounds[2] - bounds[0]
        alto = bounds[3] - bounds[1]
        resolucion_deseada = 0.00001  # Ajustar según sea necesario
        cols = int(ancho / resolucion_deseada)
        rows = int(alto / resolucion_deseada)
        logging.info(f"Tamaño de píxel ajustado a: {resolucion_deseada}, columnas: {cols}, filas: {rows}")
        return cols, rows, resolucion_deseada
    except Exception as e:
        logging.error(f"Error al ajustar el tamaño del píxel: {e}")
        sys.exit(1)

# Generar y guardar archivos TIFF
def generar_tiff(gdf, gdf_shapefile, columna, id_analisis, cols, rows, pixel_size):
    logging.info(f"Generando archivo TIFF para la columna: {columna}")
    try:
        min_x, min_y, max_x, max_y = gdf.total_bounds
        transform = from_origin(min_x, max_y, pixel_size, pixel_size)
        raster = np.zeros((rows, cols), dtype=rasterio.float32)
        for _, row in gdf.iterrows():
            col, row_num = ~transform * (row['LONGITUD'], row['LATITUD'])
            col, row_num = int(col), int(row_num)
            if 0 <= col < cols and 0 <= row_num < rows:
                raster[row_num, col] = row[columna]

        nombre_archivo = f"{columna}_{id_analisis}.tif"
        with rasterio.open(nombre_archivo, 'w', driver='GTiff', height=raster.shape[0], width=raster.shape[1], count=1, dtype=raster.dtype, crs='+proj=latlong', transform=transform) as dst:
            dst.write(raster, 1)

        # Reabre el archivo TIFF y corta con el Shapefile
        with rasterio.open(nombre_archivo) as src:
            out_image, out_meta = cortar_raster_con_shapefile(src, gdf_shapefile)

        # Guarda el raster cortado
        with rasterio.open(nombre_archivo, 'w', **out_meta) as dest:
            dest.write(out_image)

        # Sube el archivo TIFF cortado al bucket de Google Cloud Storage
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(f"raster/{nombre_archivo}")
        blob.upload_from_filename(nombre_archivo)

        # Define y añade los metadatos al archivo subido
        metadata = {
            "min_x": str(min_x),
            "max_x": str(max_x),
            "min_y": str(min_y),
            "max_y": str(max_y)
        }

        blob.metadata = metadata
        blob.patch()

        logging.info(f"Archivo TIFF {nombre_archivo} generado, subido a {BUCKET_NAME} y metadatos añadidos con éxito.")

        # Elimina el archivo TIFF del sistema de archivos local
        os.remove(nombre_archivo)
        logging.info(f"Archivo TIFF {nombre_archivo} eliminado del servidor local.")

    except Exception as e:
        logging.error(f"Error al generar o subir el archivo TIFF {columna}_{id_analisis}, añadir metadatos o eliminar el archivo local: {e}")
        sys.exit(1)

# Main
def main():
    logging.info("Inicio del proceso de generación de archivos TIFF")
    datos = cargar_datos(TABLA, ID_ANALISIS)
    gdf = procesar_datos(datos)
    cols, rows, pixel_size = ajustar_tamano_pixel(gdf)
    shapefile_gdf = cargar_shapefile(ID_ANALISIS)

    for columna in ['AUTO_TRACKET', 'PILOTO_AUTOMATICO', 'MODO_CORTE_BASE', 'VELOCIDAD_Km_H', 'CALIDAD_DE_SENAL', 'CONSUMOS_DE_COMBUSTIBLE', 'RPM', 'PRESION_DE_CORTADOR_BASE']:
        generar_tiff(gdf, shapefile_gdf, columna, ID_ANALISIS, cols, rows, pixel_size)
    logging.info("Proceso completado exitosamente")

if __name__ == "__main__":
    main()