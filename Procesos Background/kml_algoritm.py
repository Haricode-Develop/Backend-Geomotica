import geopandas as gpd
from shapely.geometry import Polygon, LineString, MultiLineString, GeometryCollection, Point, MultiPoint
from shapely.ops import unary_union
import matplotlib.pyplot as plt
import zipfile
import os
from tempfile import TemporaryDirectory
from fastkml import kml
from shapely.geometry import mapping
import pandas as pd
import numpy as np
from scipy.ndimage import binary_fill_holes
from skimage.measure import find_contours
import alphashape



def convertir_kml_a_geojson(kml_path):
    with open(kml_path, 'rb') as f:
        doc = f.read()
        k = kml.KML()
        k.from_string(doc)
        features = list(k.features())
        placemarks = list(features[0].features())
        geojson_features = []
        for placemark in placemarks:
            geom = placemark.geometry
            geojson_geom = mapping(geom)
            properties = {}
            if placemark.extended_data is not None:
                for data in placemark.extended_data.elements:
                    properties[data.name] = data.value
            properties['type'] = 'KML'
            geojson_features.append({
                "type": "Feature",
                "geometry": geojson_geom,
                "properties": properties
            })
        return {
            "type": "FeatureCollection",
            "features": geojson_features
        }

def cargar_kml_desde_kml(kml_paths):
    kml_gdfs = []
    for kml_path in kml_paths:
        geojson_data = convertir_kml_a_geojson(kml_path)
        gdf = gpd.GeoDataFrame.from_features(geojson_data['features'])
        kml_gdfs.append(gdf)
    combined_gdf = gpd.GeoDataFrame(pd.concat(kml_gdfs, ignore_index=True))
    return combined_gdf

def points_to_binary_image(points, resolution=1000):
    min_x = min(points[:, 0])
    max_x = max(points[:, 0])
    min_y = min(points[:, 1])
    max_y = max(points[:, 1])

    scale_x = (max_x - min_x) / resolution
    scale_y = (max_y - min_y) / resolution

    binary_image = np.zeros((resolution, resolution), dtype=bool)

    for x, y in points:
        ix = int((x - min_x) / scale_x)
        iy = int((y - min_y) / scale_y)
        ix = min(max(ix, 0), resolution - 1)
        iy = min(max(iy, 0), resolution - 1)
        binary_image[iy, ix] = 1

    return binary_image, scale_x, scale_y, min_x, min_y


def binary_image_to_contours(binary_image, scale_x, scale_y, min_x, min_y):
    filled_image = binary_fill_holes(binary_image)
    contours = find_contours(filled_image, 0.5)
    longest_contour = max(contours, key=len) if contours else []

    contours = np.array([
        [x * scale_x + min_x, y * scale_y + min_y] for y, x in longest_contour
    ])

    return Polygon(contours)


def crear_poligono_dinamico(gdf, resolution=1000, alpha=80):
    points = np.array([coord[:2] for geom in gdf.geometry for coord in geom.coords])
    binary_image, scale_x, scale_y, min_x, min_y = points_to_binary_image(points, resolution)
    contour_poly = binary_image_to_contours(binary_image, scale_x, scale_y, min_x, min_y)

    # Apply Alpha Shape to refine the polygon
    if len(points) > 3:
        alpha_shape_poly = alphashape.alphashape(points, alpha)
        return alpha_shape_poly

    return contour_poly


def cortar_intersecciones(gdf, poligono):
    geometries = gdf.geometry.unary_union
    if poligono.is_empty:
        return geometries
    cortadas = geometries.intersection(poligono.buffer(0))
    return cortadas


def separar_lineas(geometry):
    lineas_individuales = []
    if isinstance(geometry, LineString):
        lineas_individuales.append(geometry)
    elif isinstance(geometry, MultiLineString):
        for geom in geometry.geoms:
            lineas_individuales.append(geom)
    elif isinstance(geometry, GeometryCollection):
        for geom in geometry.geoms:
            lineas_individuales.extend(separar_lineas(geom))
    return lineas_individuales


def cargar_kml_desde_zip(ruta_zip):
    kml_gdfs = []
    with TemporaryDirectory() as temp_dir:
        with zipfile.ZipFile(ruta_zip, 'r') as zip_ref:
            zip_ref.extractall(temp_dir)
            for root, _, files in os.walk(temp_dir):
                for file in files:
                    if file.endswith('.kml'):
                        kml_path = os.path.join(root, file)
                        geojson_data = convertir_kml_a_geojson(kml_path)
                        gdf = gpd.GeoDataFrame.from_features(geojson_data['features'])
                        kml_gdfs.append(gdf)
    combined_gdf = gpd.GeoDataFrame(pd.concat(kml_gdfs, ignore_index=True))
    return combined_gdf



def eliminar_lineas_no_verticales_por_interseccion(lineas, pendiente_umbral=0.1):
    # Combinar todas las líneas en una sola geometría
    combined_line = unary_union(lineas)
    # Encontrar puntos de intersección entre las líneas
    intersection_points = combined_line.intersection(combined_line)

    # Filtrar puntos de intersección
    if isinstance(intersection_points, MultiPoint):
        puntos_interseccion = set((punto.x, punto.y) for punto in intersection_points.geoms)
    elif isinstance(intersection_points, Point):
        puntos_interseccion = {(intersection_points.x, intersection_points.y)}
    else:
        puntos_interseccion = set()

    # Filtrar las líneas verticales
    def es_vertical(linea):
        coords = np.array(linea.coords)
        return np.all(np.abs(np.diff(coords[:, 0])) < pendiente_umbral)

    lineas_verticales = [linea for linea in lineas if es_vertical(linea)]

    # Eliminar coordenadas que coincidan con puntos de intersección
    lineas_finales = []
    for linea in lineas_verticales:
        coords = [coord for coord in linea.coords if coord not in puntos_interseccion]
        if len(coords) > 1:
            lineas_finales.append(LineString(coords))

    return lineas_finales

def completar_lineas_verticales(lineas, poligono, distancia_metros=10):
    x_coords = sorted(set(coord[0] for linea in lineas for coord in linea.coords))
    if len(x_coords) < 2:
        return lineas  # No se puede calcular la distancia si no hay suficientes puntos

    avg_distance = distancia_metros * 0.00001  # Conversión a la unidad de las coordenadas

    completadas = []
    for linea in lineas:
        coords = list(linea.coords)
        if len(coords) > 1:
            x = coords[0][0]
            y_min = min(y for _, y in coords)
            y_max = max(y for _, y in coords)
            completadas.append(LineString([(x, y_min), (x, y_max)]))

    min_poly, max_poly = poligono.bounds[1], poligono.bounds[3]
    nuevas_lineas = []
    for x in np.arange(min(x_coords), max(x_coords) + avg_distance, avg_distance):
        nueva_linea = LineString([(x, min_poly), (x, max_poly)])
        intersecciones = nueva_linea.intersection(poligono)
        if isinstance(intersecciones, LineString):
            nuevas_lineas.append(intersecciones)
        elif isinstance(intersecciones, MultiLineString):
            nuevas_lineas.extend(intersecciones.geoms)
        elif isinstance(intersecciones, GeometryCollection):
            for geom in intersecciones.geoms:
                if isinstance(geom, LineString):
                    nuevas_lineas.append(geom)

    return nuevas_lineas


def main(ruta_zip, resolution=1000, umbral_longitud=0.5, alpha=4500, buffer_distance=-0.0001, pendiente_umbral=0.001, distancia_metros=10):
    gdf = cargar_kml_desde_zip(ruta_zip)
    poligono = crear_poligono_dinamico(gdf, resolution, alpha)
    poligono_reducido = poligono.buffer(buffer_distance)  # Reduce el tamaño del polígono de manera sutil
    cortadas = cortar_intersecciones(gdf, poligono_reducido)
    lineas_individuales = []

    if isinstance(cortadas, GeometryCollection):
        cortadas = [geom for geom in cortadas.geoms]
    elif isinstance(cortadas, (LineString, MultiLineString)):
        cortadas = [cortadas]
    else:
        cortadas = []

    for geom in cortadas:
        lineas_individuales.extend(separar_lineas(geom))

    for i, linea in enumerate(lineas_individuales):
        if isinstance(linea, (LineString, MultiLineString)):
            coords = list(linea.coords)
            if len(coords[0]) == 3:
                lineas_individuales[i] = LineString([(x, y) for x, y, z in coords])

    lineas_utiles = eliminar_lineas_no_verticales_por_interseccion(lineas_individuales, pendiente_umbral)
    lineas_completadas = completar_lineas_verticales(lineas_utiles, poligono_reducido, distancia_metros)

    gdf_lineas = gpd.GeoDataFrame(geometry=lineas_completadas)
    gdf_poligono = gpd.GeoDataFrame(geometry=[poligono_reducido])

    #output_path = r'C:\Users\jmanc\OneDrive\Desktop\lineas_separadas.geojson'
    #gdf_lineas.to_file(output_path, driver='GeoJSON')

    #fig, ax = plt.subplots()
    #gdf_lineas.plot(ax=ax, color='blue', label='Líneas')
    #gdf_poligono.boundary.plot(ax=ax, color='red', linestyle='--', label='Polígono')
    #plt.legend()
    #plt.show()

    return output_path



#ruta_zip = input("Introduce la ruta del archivo ZIP con los archivos KML: ")
#output_path = main(ruta_zip)
#print(f"Proceso completado. Las líneas separadas se han guardado en '{output_path}'.")
