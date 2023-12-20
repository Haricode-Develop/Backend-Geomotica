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

function insert_to_analisis {
    local id_usuario=$1
    local tipo_analisis=$2
    mysql --default-character-set=utf8mb4 -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME -e "SET autocommit=0; SET foreign_key_checks=0;"

    # Crear una consulta temporal para insertar en la tabla análisis
    echo "INSERT INTO analisis (id_usuario, tipo_analisis) VALUES ($id_usuario, '$tipo_analisis');" > "${PARENT_DIR}/insert_analisis.sql"

    if ! mysql --default-character-set=utf8mb4 -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME < "${PARENT_DIR}/insert_analisis.sql"; then
        echo "Error al insertar en la tabla analisis"
         rm "${PARENT_DIR}/insert_analisis.sql"
        exit 1
    fi
        echo "SELECT MAX(ID_ANALISIS) FROM analisis WHERE TIPO_ANALISIS = '$tipo_analisis';" >"${PARENT_DIR}/get_id_tipo.sql"

        ID_ANALISIS_TIPO=$(mysql --default-character-set=utf8mb4 -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME -N -s < "${PARENT_DIR}/get_id_tipo.sql")
	rm "${PARENT_DIR}/insert_analisis.sql" "${PARENT_DIR}/get_id_tipo.sql"
  echo $ID_ANALISIS_TIPO
  mysql --default-character-set=utf8mb4 -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME -e "SET autocommit=1; SET foreign_key_checks=1;"

}
function insert_cosecha_data {
    local csv_file=$1
    local id_analisis_tipo=$2
    local converted_csv="${csv_file%.csv}_converted.csv"
    local cleaned_csv="${csv_file%.csv}_cleaned.csv"
    echo "Comprobando la existencia del archivo CSV: $csv_file"
    if [[ ! -f $csv_file ]]; then
        echo "Error: Archivo CSV no encontrado ($csv_file)."
        exit 1
    fi

    echo "Convirtiendo el archivo CSV a UTF-8..."
    iconv -f ISO-8859-1 -t UTF-8 "$csv_file" > "$converted_csv"

    echo "Procesando y limpiando el archivo CSV con AWK..."
    awk -F',' -v id_tipo=$id_analisis_tipo '
        BEGIN {
            print "ID_ANALISIS_TIPO:", id_tipo > "/dev/stderr";
            FPAT = "([^,]*)|(\"[^\"]+\")";
            split("LONGITUD,LATITUD,CULTIVO,PARCELA,NOMBRE_FINCA,CODIGO_FINCA,AREA_BRUTA,AREA_NETA,DIFERENCIA_DE_AREA,CODIGO_DE_MAQUINA,RESPONSABLE,ACTIVIDAD,EQUIPO,OPERADOR,FECHA_INICIO,FECHA_FINAL,HORA_INICIO,HORA_FINAL,TIEMPO_TOTAL,EFICIENCIA,VELOCIDAD_Km_H,PRESION_DE_CORTADOR_BASE,TCH,TAH,AUTO_TRACKET,PILOTO_AUTOMATICO,CALIDAD_DE_SENAL,CONSUMOS_DE_COMBUSTIBLE", column_names, ",");
        }
        function format_value(value, field_number) {
                  # Identificar si el campo debe ser un número (sin comillas)
                  if (field_number ~ /^(1|2|4|6|7|8|9|10|13|20|21|22|23|24|25|26|27|28)$/) {
                      if (value == "") {
                          return "NULL";  # Campos numéricos vacíos como NULL
                      } else {
                          # Remover comillas dobles si las hay
                          gsub(/^"|"$/, "", value);
                          return value;  # Devolver el valor numérico
                      }
                  } else if (field_number ~ /^(15|16)$/) { # Para fechas
                      if (value == "") {
                          return "NULL";
                      } else {
                          # Convertir fechas de formato MM/DD/YYYY a YYYY-MM-DD
                          split(value, date_parts, "/");
                      return sprintf("%04d-%02d-%02d", date_parts[3], date_parts[1], date_parts[2]);
                      }
                  } else if (field_number ~ /^(17|18|19)$/) { # Para horas
                      if (value == "") {
                          return "NULL";
                      } else {
                          # Asegurarse que el valor de la hora está en el formato correcto
                          gsub(/^"|"$/, "", value);
                          return sprintf("%s", value);
                      }
                  } else {  # Para campos de texto
                      if (value == "") {
                          return "NULL";
                      } else {
                          # Escapar comillas simples y envolver el valor en comillas simples
                         gsub(/\x27/, "\x27\x27", value);
                          gsub(/^"|"$/, "", value);
                          return sprintf("\x27%s\x27", value);
                      }
                  }

              }

       NR > 1 {
        printf "%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n",
        format_value($1, 1), format_value($2, 2), format_value($3, 3), format_value($4, 4), format_value($5, 5), format_value($6, 6), format_value($7, 7), format_value($8, 8), format_value($9, 9), format_value($10, 10), format_value($11, 11), format_value($12, 12), format_value($13, 13), format_value($14, 14), format_value($15, 15), format_value($16, 16), format_value($17, 17), format_value($18, 18), format_value($19, 19), format_value($20, 20), format_value($21, 21), format_value($22, 22), format_value($23, 23), format_value($24, 24), id_tipo, format_value($25, 25), format_value($26, 26), format_value($27, 27), format_value($28, 28);
               }
    ' "$converted_csv" > "$cleaned_csv"

    echo "Subiendo el archivo CSV limpio a Google Cloud Storage..."
      if ! gsutil cp "$cleaned_csv" "${BUCKET_PATH}"; then
          echo "Error al subir el archivo CSV a Google Cloud Storage."
          exit 1
      fi

 echo "Importando el archivo CSV desde Cloud Storage a Cloud SQL..."
    if ! gcloud sql import csv "$GCLOUD_SQL_INSTANCE" \
        "${BUCKET_PATH}$(basename "$cleaned_csv")" \
        --database="$GCLOUD_SQL_DATABASE" --table="cosecha_mecanica" \
        --quiet \
        --verbosity=debug; then
        echo "Error al importar datos a Cloud SQL."
        exit 1
    fi

    echo "Limpiando archivos temporales..."
    rm -f "$converted_csv" "$cleaned_csv"
    echo "Inserción de datos completada."
}


echo "SE INSERTA EL ANALISIS EN LA BASE DE DATOS DESDE INSERTDATOS.SH ======="

# Llamar a insert_to_analisis y guardar el resultado en una variable
ID_ANALISIS_TIPO_RESULT=$(insert_to_analisis $ID_USUARIO $TIPO_ANALISIS)
if [[ -z $ID_ANALISIS_TIPO_RESULT ]]; then
    echo "Error: No se pudo obtener ID_ANALISIS_TIPO"
    exit 1
fi
echo "ID de análisis obtenido: $ID_ANALISIS_TIPO_RESULT"

echo "SE GUARDA EL ID DEL ANALISIS QUE SE ACABA DE INSERTAR EN TXT TEMPORAL ======="

echo $ID_ANALISIS_TIPO_RESULT > "${PARENT_DIR}/tempIdAnalisis.txt"

# Verificar que ID_ANALISIS_TIPO_RESULT tiene valor, si no, terminar el script con un error
if [[ -z $ID_ANALISIS_TIPO_RESULT ]]; then
    echo "Error: No se pudo obtener ID_ANALISIS_TIPO"
    exit 1
fi
echo "SE PARSEA EL TEXTO DEL CSV ======="


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