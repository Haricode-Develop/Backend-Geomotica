#!/bin/bash

set -e # Hace que el script termine si cualquier comando devuelve un error

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PARENT_DIR="$( dirname "$SCRIPT_DIR" )"

# Cargando las credenciales de la base de datos del archivo .conf
DATABASE_CONF="${PARENT_DIR}/database.conf"

echo "Verificando la existencia del archivo de configuración de la base de datos..."
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
TIPO_ANALISIS="APS"
ARCHIVO_CSV=$2
GCLOUD_SQL_INSTANCE="geomotica-base-dedicada"  # Asegúrate de que este es el nombre de tu instancia de Cloud SQL
GCLOUD_SQL_DATABASE="geomotica"               # Nombre de tu base de datos
GCLOUD_SQL_USER="danman"                      # Usuario de Cloud SQL
BUCKET_PATH="gs://geomotica_mapeo/csv/aps"
API_URL="$4"



echo "El ID de usuario es: $ID_USUARIO"

function insert_aps {
    local csv_file=$1
    local num_registros_antes=$(wc -l < "$csv_file")
      echo "Número de registros a insertar: $num_registros_antes"

    echo "Subiendo el archivo CSV limpio a Google Cloud Storage..."
    if ! gsutil_output=$(gsutil cp "$csv_file" "${BUCKET_PATH}" 2>&1); then
        echo "Error al subir el archivo CSV a Google Cloud Storage."
        echo "Detalles del error: $gsutil_output"
        exit 1
    fi

    echo "Importando el archivo CSV desde Cloud Storage a Cloud SQL..."
    if ! gcloud sql import csv "$GCLOUD_SQL_INSTANCE" \
        "${BUCKET_PATH}$(basename "$csv_file")" \
        --database="$GCLOUD_SQL_DATABASE" --table="aps" \
        --quiet \
        --verbosity=debug; then
        echo "Error al importar datos a Cloud SQL."
        exit 1
    fi
    DATA='{"progress": 30, "message": "Inserción de datos completada."}'

    curl -X POST -H "Content-Type: application/json" -d "$DATA" $API_URL

    echo "Inserción de datos completada."
}

echo "Recibiendo parámetro de ID_ANALISIS_TIPO..."
ID_ANALISIS_TIPO_RESULT="$3"
if [[ -z $ID_ANALISIS_TIPO_RESULT ]]; then
    echo "Error: No se pudo obtener ID_ANALISIS_TIPO"
    exit 1
fi
echo "ID de análisis obtenido: $ID_ANALISIS_TIPO_RESULT"

echo "Guardando el ID del análisis en un archivo temporal..."
echo $ID_ANALISIS_TIPO_RESULT > "${PARENT_DIR}/tempIdAnalisis.txt"

CSV_FILE="$ARCHIVO_CSV"
echo "Mostrando contenido inicial del CSV (primeras 10 líneas) antes de la conversión dos2unix:"
head -n 10 $CSV_FILE

echo "Convirtiendo el CSV a formato Unix y mostrando las primeras 10 líneas después de la conversión:"
dos2unix $CSV_FILE
head -n 10 $CSV_FILE

echo "Iniciando la inserción de datos en la tabla..."
insert_aps $CSV_FILE $ID_ANALISIS_TIPO_RESULT

if [ $? -ne 0 ]; then
    echo "Error en la inserción de datos. Abortando el script."
    exit 1
fi

echo "Inserción de datos exitosa. Finalizando el script."
exit 0
