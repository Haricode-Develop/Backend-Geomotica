#!/bin/bash

set -e # Hace que el script termine si cualquier comando devuelve un error


SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PARENT_DIR="$( dirname "$SCRIPT_DIR" )"
API_URL="https://geomotica.ingeoproyectos.com/socket/emitirEvento"

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
TIPO_ANALISIS="APS"
ARCHIVO_CSV=$2

function insert_to_analisis {
    local id_usuario=$1
    local tipo_analisis=$2

    # Crear una consulta temporal para insertar en la tabla análisis
    echo "INSERT INTO analisis (id_usuario, tipo_analisis) VALUES ($id_usuario, '$tipo_analisis');" > "${PARENT_DIR}/insert_analisis.sql"

    if ! mysql -u $DB_USER -p$DB_PASS $DB_NAME < "${PARENT_DIR}/insert_analisis.sql"; then
        echo "Error al insertar en la tabla analisis"
        rm "${PARENT_DIR}/insert_analisis.sql"
        exit 1
    fi
        echo "SELECT MAX(ID_ANALISIS) FROM analisis WHERE TIPO_ANALISIS = '$tipo_analisis';" > "${PARENT_DIR}/get_id_tipo.sql"

        ID_ANALISIS_TIPO=$(mysql -u $DB_USER -p$DB_PASS $DB_NAME -N -s < "${PARENT_DIR}/get_id_tipo.sql")
	rm "${PARENT_DIR}/insert_analisis.sql" "${PARENT_DIR}/get_id_tipo.sql"
        echo $ID_ANALISIS_TIPO
}

function insert_aps_data {
    local csv_file=$1
    local id_analisis_tipo=$2
    local temp_sql="${PARENT_DIR}/temp.sql"
    local awk_output_log="${PARENT_DIR}/awk_output.log"
    local mysql_output_log="${PARENT_DIR}/mysql_output.log"
    local mysql_error_log="${PARENT_DIR}/mysql_error.log"

     echo "Comprobando la existencia del archivo CSV: $csv_file"
      if [[ ! -f $csv_file ]]; then
          echo "Error: Archivo CSV no encontrado ($csv_file)."
          exit 1
      fi
       echo "Generando la consulta SQL para inserción de datos APS..."
    echo "INSERT INTO aps (LONGITUD, LATITUD, CULTIVO, PARCELA, NOMBRE_FINCA, CODIGO_FINCA, AREA_BRUTA, AREA_NETA, DIFERENCIA_DE_AREA, CODIGO_DE_MAQUINA, RESPONSABLE, ACTIVIDAD, EQUIPO, OPERADOR, FECHA_INICIO, FECHA_FINAL, HORA_INICIO, HORA_FINAL, TIEMPO_TOTAL, EFICIENCIA, VELOCIDAD_Km_H, TCH, TAH, ID_ANALISIS) VALUES" > "$temp_sql"
    echo "Procesando el archivo CSV con AWK..."
   awk -F',' -v id_tipo="$id_analisis_tipo" '
       BEGIN {
           print "ID_ANALISIS_TIPO:", id_tipo > "/dev/stderr";
            FPAT = "([^,]*)|(\"[^\"]+\")";
           # Definir los nombres de las columnas
           split("LONGITUD,LATITUD,CULTIVO,PARCELA,NOMBRE_FINCA,CODIGO_FINCA,AREA_BRUTA,AREA_NETA,DIFERENCIA_DE_AREA,CODIGO_DE_MAQUINA,RESPONSABLE,ACTIVIDAD,EQUIPO,OPERADOR,FECHA_INICIO,FECHA_FINAL,HORA_INICIO,HORA_FINAL,TIEMPO_TOTAL,EFICIENCIA,VELOCIDAD_Km_H,TCH,TAH", column_names, ",");
       }
      function format_value(value, field_number) {
          # Si el valor está vacío y es la columna TCH (22), devuelve 0 como número, de lo contrario NULL como cadena
          if (value == "" && field_number == 22) {
              return "80";  # Devuelve 0 como número, sin comillas
          } else if (value == "") {
              return "NULL";  # Para otros campos vacíos, devuelve la cadena NULL
          } else {
              gsub("\x27", "\x27\x27", value);  # Escapar comillas simples
              return sprintf("\x27%s\x27", value);  # Devuelve el valor con comillas simples
          }
      }

       function format_date(date) {
           split(date, parts, "/");
           return sprintf("\x27%s-%s-%s\x27", parts[3], parts[2], parts[1]);
       }


       NR > 1 {

           split($15, date, "/");
           fecha_inicio = format_date($15);
           fecha_final = format_date($16);

           printf "(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s),\n",
           format_value($1), format_value($2), format_value($3), format_value($4), format_value($5), format_value($6), format_value($7), format_value($8), format_value($9), format_value($10), format_value($11), format_value($12), format_value($13), format_value($14), fecha_inicio, fecha_final, format_value($17), format_value($18), format_value($19), format_value($20), format_value($21), format_value($22), format_value($23), id_tipo;
       }
    ' "$csv_file" | tee "$awk_output_log" | sed '$ s/,$/;/' >> "$temp_sql"

    echo "Consulta SQL generada y almacenada en $awk_output_log."
    echo "Primeras dos líneas de la consulta SQL generada:"
        head -n 2 "$temp_sql"
    echo "Intentando insertar los datos en la base de datos..."

 if mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$temp_sql" >"$mysql_output_log" 2>"$mysql_error_log"; then
         echo "Inserción de datos APS exitosa."
         cat "$mysql_output_log"
     else
         echo "Error al insertar datos APS. Consulte $mysql_error_log para obtener detalles."
         cat "$mysql_error_log"
         exit 1
     fi

    echo "Limpiando archivos temporales..."

      rm -f mysql_error.log
      rm temp.sql
          echo "Inserción de datos APS completada y archivos temporales eliminados."

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
dos2unix $CSV_FILE
echo "Contenido inicial del CSV después de dos2unix (primeras 4 líneas):"
head -n 4 $CSV_FILE
echo "SE INSERTAN LOS DATOS A LA TABLA RESPECTIVA DEL ANÁLISIS======="

# Pasar el ID_ANALISIS_TIPO_RESULT como segundo argumento a insert_aps_data
insert_aps_data $CSV_FILE $ID_ANALISIS_TIPO_RESULT
echo "SE RALIZA LA PETICIÓN PARA MOSTRAR EL ANÁLISIS ======="
# Ejecutar curl y capturar la respuesta y el código de salida
#RESPONSE=$(curl -X POST $API_URL --write-out "%{http_code}" --silent --output /dev/null)

# Verificar el código de salida de curl
#if [ "$RESPONSE" -ne 200 ]; then
 #   echo "Error: La petición curl falló con el código de respuesta $RESPONSE"

#fi

#echo "Petición curl exitosa. Código de respuesta: $RESPONSE"
exit 1
