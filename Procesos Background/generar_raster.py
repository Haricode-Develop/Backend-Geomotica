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

# Configuración inicial
GOOGLE_APPLICATION_CREDENTIALS = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
BUCKET_NAME = 'geomotica_mapeo'
ID_ANALISIS = sys.argv[1]
TABLA = sys.argv[2]

# Cargar credenciales para Google Cloud Storage
credentials = service_account.Credentials.from_service_account_file(GOOGLE_APPLICATION_CREDENTIALS)
storage_client = storage.Client(credentials=credentials)

# Función para cargar datos desde la base de datos
def cargar_datos(tabla, id_analisis):
    logging.info("Iniciando la carga de datos desde la base de datos")
    try:
        engine = create_engine("mysql+mysqlconnector://instancia:123456@34.172.98.144/geomotica")
        query = f"""
        SELECT LONGITUD, LATITUD, AUTO_TRACKET, PILOTO_AUTOMATICO, MODO_CORTE_BASE, VELOCIDAD_Km_H, CALIDAD_DE_SENAL, CONSUMOS_DE_COMBUSTIBLE, RPM, PRESION_DE_CORTADOR_BASE, TIEMPO_TOTAL
        FROM {tabla}
        WHERE ID_ANALISIS = {id_analisis}
        """
        datos = pd.read_sql(query, engine)
        logging.info("Datos cargados correctamente desde la base de datos")
        return datos
    except Exception as e:
        logging.error(f"Error al cargar datos desde la base de datos: {e}")
        sys.exit(1)

# Procesar datos
def procesar_datos(datos):
    logging.info("Iniciando el procesamiento de los datos")
    try:
        gdf = gpd.GeoDataFrame(datos, geometry=gpd.points_from_xy(datos.LONGITUD, datos.LATITUD))
        gdf.crs = "EPSG:4326"
        label_encoder = LabelEncoder()
        for columna in ['AUTO_TRACKET', 'PILOTO_AUTOMATICO', 'MODO_CORTE_BASE']:
            gdf[columna] = label_encoder.fit_transform(gdf[columna])
        logging.info("Datos procesados exitosamente")
        return gdf
    except Exception as e:
        logging.error(f"Error al procesar los datos: {e}")
        sys.exit(1)

# Ajuste dinámico del tamaño de píxel
def ajustar_tamano_pixel(gdf):
    logging.info("Ajustando el tamaño del píxel basado en los límites del conjunto de datos")
    try:
        bounds = gdf.total_bounds
        ancho = bounds[2] - bounds[0]
        alto = bounds[3] - bounds[1]
        resolucion_deseada = 0.0001  # Ajustar según sea necesario
        cols = int(ancho / resolucion_deseada)
        rows = int(alto / resolucion_deseada)
        logging.info(f"Tamaño de píxel ajustado a: {resolucion_deseada}, columnas: {cols}, filas: {rows}")
        return cols, rows, resolucion_deseada
    except Exception as e:
        logging.error(f"Error al ajustar el tamaño del píxel: {e}")
        sys.exit(1)

# Generar y guardar archivos TIFF
def generar_tiff(gdf, columna, id_analisis, cols, rows, pixel_size):
    logging.info(f"Generando archivo TIFF para la columna: {columna}")
    try:
        min_x, min_y, max_x, max_y = gdf.total_bounds
        transform = from_origin(min_x, max_y, pixel_size, pixel_size)
        raster = np.zeros((rows, cols), dtype=rasterio.float32)
        for _, row in gdf.iterrows():
            col, row = ~transform * (row['LONGITUD'], row['LATITUD'])
            col, row = int(col), int(row)
            if 0 <= col < cols and 0 <= row < rows:
                raster[row, col] = row[columna]
        nombre_archivo = f"{columna}_{id_analisis}.tif"
        with rasterio.open(nombre_archivo, 'w', driver='GTiff', height=raster.shape[0], width=raster.shape[1], count=1, dtype=raster.dtype, crs='+proj=latlong', transform=transform) as dst:
            dst.write(raster, 1)
        bucket = storage_client.bucket(BUCKET_NAME)
        blob = bucket.blob(nombre_archivo)
        blob.upload_from_filename(nombre_archivo)
        logging.info(f"Archivo TIFF {nombre_archivo} generado y subido a {BUCKET_NAME} con éxito")
    except Exception as e:
        logging.error(f"Error al generar o subir el archivo TIFF {columna}_{id_analisis}: {e}")
        sys.exit(1)

# Main
def main():
    logging.info("Inicio del proceso de generación de archivos TIFF")
    datos = cargar_datos(TABLA, ID_ANALISIS)
    gdf = procesar_datos(datos)
    cols, rows, pixel_size = ajustar_tamano_pixel(gdf)
    for columna in ['AUTO_TRACKET', 'PILOTO_AUTOMATICO', 'MODO_CORTE_BASE', 'VELOCIDAD_Km_H', 'CALIDAD_DE_SENAL', 'CONSUMOS_DE_COMBUSTIBLE', 'RPM', 'PRESION_DE_CORTADOR_BASE']:
        generar_tiff(gdf, columna, ID_ANALISIS, cols, rows, pixel_size)
    logging.info("Proceso completado exitosamente")

if __name__ == "__main__":
    main()
