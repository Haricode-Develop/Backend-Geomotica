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
echo "El ID de usuario es: $ID_USUARIO"

function insert_to_analisis {
    local id_usuario=$1
    local tipo_analisis=$2

    # Crear una consulta temporal para insertar en la tabla análisis
    echo "INSERT INTO analisis (id_usuario, tipo_analisis) VALUES ($id_usuario, '$tipo_analisis');" > "${PARENT_DIR}/insert_analisis.sql"

    if ! mysql -u $DB_USER -p$DB_PASS $DB_NAME < "${PARENT_DIR}/insert_analisis.sql"; then
        echo "Error al insertar en la tabla analisis"
        rm insert_analisis.sql
        exit 1
    fi
        echo "SELECT MAX(ID_ANALISIS) FROM analisis WHERE TIPO_ANALISIS = '$tipo_analisis';" >"${PARENT_DIR}/get_id_tipo.sql"

        ID_ANALISIS_TIPO=$(mysql -u $DB_USER -p$DB_PASS $DB_NAME -N -s < "${PARENT_DIR}/get_id_tipo.sql")
	rm "${PARENT_DIR}/insert_analisis.sql" "${PARENT_DIR}/get_id_tipo.sql"
        echo $ID_ANALISIS_TIPO
}

function insert_cosecha_data {
    local csv_file=$1
    local id_analisis_tipo=$2

      if [[ ! -f $csv_file ]]; then
        echo "Error: No se encontró el archivo $csv_file"
        exit 1
      fi

    echo "INSERT INTO cosecha_mecanica (LONGITUD, LATITUD, CULTIVO, PARCELA, NOMBRE_FINCA, CODIGO_FINCA, AREA_BRUTA, AREA_NETA, DIFERENCIA_DE_AREA, CODIGO_DE_MAQUINA, RESPONSABLE, ACTIVIDAD, EQUIPO, OPERADOR, FECHA_INICIO, FECHA_FINAL, HORA_INICIO, HORA_FINAL, TIEMPO_TOTAL, EFICIENCIA, VELOCIDAD_Km_H, PRESION_DE_CORTADOR_BASE, TCH, TAH, ID_ANALISIS) VALUES" > temp.sql
      awk -F',' -v id_tipo=$id_analisis_tipo '
        BEGIN { print "ID_ANALISIS_TIPO:", id_tipo > "/dev/stderr"; }
          function format_value(value) {
            gsub("\x27", "\x27\x27", value);
            return (value != "") ? sprintf("\x27%s\x27", value) : "NULL";
        }


        NR > 1 {
            split($15, date, "/");
            fecha_inicio = (length($15) != 0) ? sprintf("\x27%s-%s-%s\x27", date[3], date[2], date[1]) : "NULL";
            split($16, date, "/");
            fecha_final = (length($16) != 0) ? sprintf("\x27%s-%s-%s\x27", date[3], date[2], date[1]) : "NULL";

            printf "(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s),\n",
            format_value($1), format_value($2), format_value($3), format_value($4), format_value($5), format_value($6), format_value($7), format_value($8), format_value($9), format_value($10), format_value($11), format_value($12), format_value($13), format_value($14), fecha_inicio, fecha_final, format_value($17), format_value($18), format_value($19), format_value($20), format_value($21), format_value($22), format_value($23), format_value($24), id_tipo;
        }
    ' $csv_file | sed '$ s/,$/;/' >> temp.sql

    if ! mysql -u $DB_USER -p$DB_PASS $DB_NAME < temp.sql; then
        echo "Error al insertar en la tabla Cosecha Mecanica"
        rm temp.sql
        exit 1
    fi

    rm temp.sql
}

# Llamar a insert_to_analisis y guardar el resultado en una variable
ID_ANALISIS_TIPO_RESULT=$(insert_to_analisis $ID_USUARIO $TIPO_ANALISIS)
echo $ID_ANALISIS_TIPO_RESULT > "${PARENT_DIR}/tempIdAnalisis.txt"
echo "El valor de ID_ANALISIS_TIPO_RESULT es: $ID_ANALISIS_TIPO_RESULT"

# Verificar que ID_ANALISIS_TIPO_RESULT tiene valor, si no, terminar el script con un error
if [[ -z $ID_ANALISIS_TIPO_RESULT ]]; then
    echo "Error: No se pudo obtener ID_ANALISIS_TIPO"
    exit 1
fi

CSV_FILE="${PARENT_DIR}/COSECHA_MECANICA.csv"
dos2unix $CSV_FILE

# Pasar el ID_ANALISIS_TIPO_RESULT como segundo argumento a insert_aps_data
insert_cosecha_data $CSV_FILE $ID_ANALISIS_TIPO_RESULT
