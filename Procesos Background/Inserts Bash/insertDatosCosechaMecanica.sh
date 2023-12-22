#!/bin/bash

set -e # Hace que el script termine si cualquier comando devuelve un error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PARENT_DIR="$( dirname "$SCRIPT_DIR" )"

# Cargando las credenciales de la base de datos del archivo .conf
DATABASE_CONF="${PARENT_DIR}/database.conf"

if [[ ! -f "$DATABASE_CONF" ]]; then
    echo "Error: No se encontró el archivo database.conf"
    exit 1
fi

source "$DATABASE_CONF"

if [[ -z $1 ]]; then
    echo "Error: No se proporcionó ID_USUARIO"
    exit 1
fi

ID_USUARIO=$1
TIPO_ANALISIS="COSECHA_MECANICA"
ARCHIVO_CSV=$2
GCLOUD_SQL_INSTANCE="geomotica-base-dedicada"  # Asegúrate de que este es el nombre de tu instancia de Cloud SQL
GCLOUD_SQL_DATABASE="geomotica"               # Nombre de tu base de datos
GCLOUD_SQL_USER="danman"                      # Usuario de Cloud SQL
BUCKET_PATH="gs://geomotica_mapeo/csv/"

echo "El ID de usuario es: $ID_USUARIO"


function insert_cosecha_data {
    local csv_file=$1

    echo "Subiendo el archivo CSV limpio a Google Cloud Storage..."
      if ! gsutil cp "$csv_file" "${BUCKET_PATH}"; then
          echo "Error al subir el archivo CSV a Google Cloud Storage."
          exit 1
      fi

 echo "Importando el archivo CSV desde Cloud Storage a Cloud SQL..."
    if ! gcloud sql import csv "$GCLOUD_SQL_INSTANCE" \
        "${BUCKET_PATH}$(basename "$csv_file")" \
        --database="$GCLOUD_SQL_DATABASE" --table="cosecha_mecanica" \
        --quiet \
        --verbosity=debug; then
        echo "Error al importar datos a Cloud SQL."
        exit 1
    fi

    echo "Inserción de datos completada."
}


echo "ESTE ES EL PARAMETRO 3 EN DONDE LE PASO EL ID MAX DESDE EL NODE.JS ======"
# Llamar a insert_to_analisis y guardar el resultado en una variable
ID_ANALISIS_TIPO_RESULT="$3"

echo "ID de análisis obtenido: $ID_ANALISIS_TIPO_RESULT"

echo "SE GUARDA EL ID DEL ANALISIS QUE SE ACABA DE INSERTAR EN TXT TEMPORAL ======="

echo $ID_ANALISIS_TIPO_RESULT > "${PARENT_DIR}/tempIdAnalisis.txt"

# Verificar que ID_ANALISIS_TIPO_RESULT tiene valor, si no, terminar el script con un error
if [[ -z $ID_ANALISIS_TIPO_RESULT ]]; then
  echo "ID de análisis obtenido: $ID_ANALISIS_TIPO_RESULT"

    echo "Error: No se pudo obtener ID_ANALISIS_TIPO"
    exit 1
fi

CSV_FILE="$ARCHIVO_CSV"
echo "Contenido inicial del CSV después de dos2unix (primeras 4 líneas):"
dos2unix $CSV_FILE
head -n 4 $CSV_FILE
echo "SE INSERTAN LOS DATOS A LA TABLA RESPECTIVA DEL ANÁLISIS======="

# Pasar el ID_ANALISIS_TIPO_RESULT como segundo argumento a insert_aps_data
insert_cosecha_data $CSV_FILE $ID_ANALISIS_TIPO_RESULT

if [ $? -ne 0 ]; then
    echo "Error en la inserción de datos. Abortando el script."
    exit 1
fi

echo "Inserción de datos exitosa. Continuando con el script..."
exit 1