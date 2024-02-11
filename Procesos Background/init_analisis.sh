#!/bin/bash

APS="1"
COSECHA_MECANICA="2"
HERBICIDAS="3"
FERTILIZACION="4"
TABLA_ACTUAL=""
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ARCHIVO_CSV="$3"
ARCHIVO_POLIGONO="$4"
ID_MAX="$5"
OFFSET="$6"
VALIDAR="$7"
ES_PRIMERA_ITERACION="$8"

API_URL="http://localhost:3001/socket/loadingAnalysis"
DATA='{"progress": 10, "message": "Iniciando análisis"}'

curl -X POST -H "Content-Type: application/json" -d "$DATA" $API_URL



echo "ESTA ES LA RUTA"
echo $SCRIPT_DIR
echo "============== INICIA PROCESO DE ANALISIS (INIT_ANALISIS.SH) ================"
echo "PARAMETRO 1 QUE SE LE PASA AL SH: "
echo "$1"
echo "PARAMETRO 2 QUE SE LE PASA AL SH: "
echo "$2"
echo "PARAMETRO ES PRIMERA ITERACIÓN: "
echo "$8"
if [ "$ES_PRIMERA_ITERACION" = "true" ]; then
      if [ $2 -eq $APS ]; then
      echo "======== Se ejecuta analisis APS ======="
      "$SCRIPT_DIR"/procesos/insertDatosAps.sh "$1" "$ARCHIVO_CSV"
      TABLA_ACTUAL="aps"
      fi

      if [ $2 -eq $COSECHA_MECANICA ] && [ "$VALIDAR" = "ok" ]; then
          echo "======== Se ejecuta analisis COSECHA MECANICA  ======="
          DATA='{"progress": 20, "message": "Ejecutando inserción de datos de cosecha mecánica"}'

          curl -X POST -H "Content-Type: application/json" -d "$DATA" $API_URL

          "$SCRIPT_DIR"/procesos/insertDatosCosechaMecanica.sh "$1" "$ARCHIVO_CSV" "$ID_MAX" "$API_URL"
          TABLA_ACTUAL="cosecha_mecanica"
      fi

      if [ $2  -eq  $HERBICIDAS ]; then
      echo "======== Se ejecuta analisis HERBICIDAS  ======="
        "$SCRIPT_DIR"/procesos/insertDatosHerbicidas.sh "$1" "$ARCHIVO_CSV"

      TABLA_ACTUAL="herbicidas"
      fi

      if [ $2 -eq $FERTILIZACION ]; then
      echo "======== Se ejecuta analisis FERTILIZACION  ======="
        "$SCRIPT_DIR"/procesos/insertDatosFertilizacion.sh "$1" "$ARCHIVO_CSV"

      TABLA_ACTUAL="usuarios"
      fi
fi

if [[ -f "$SCRIPT_DIR/tempIdAnalisis.txt" ]]; then
    ID_ANALISIS=$(cat "$SCRIPT_DIR/tempIdAnalisis.txt")
    echo "Este es el ID del analisis: $ID_ANALISIS"
    echo "Esta es la tabla que se quiere hacer el análisis: $TABLA_ACTUAL"

    POLIGONO_DIR="$SCRIPT_DIR/poligonoTemp"
    mkdir -p "$POLIGONO_DIR"
    unzip -o "$ARCHIVO_POLIGONO" -d "$POLIGONO_DIR"

      echo "Contenido de $POLIGONO_DIR:"
      ls -l "$POLIGONO_DIR"
    DATA='{"progress": 50, "message": "Iniciando mapeo de datos"}'
    curl -X POST -H "Content-Type: application/json" -d "$DATA" $API_URL
    export GOOGLE_APPLICATION_CREDENTIALS="/geomotica/procesos/analog-figure-382403-0c07b0baecfa.json"
    python3 "$SCRIPT_DIR/procesos/mapeo.py" "$ID_ANALISIS" "$TABLA_ACTUAL" "$POLIGONO_DIR" "$OFFSET"
else
    echo "Error: No se pudo obtener el ID del Analisis para el mapeo"
fi

rm -rf "$SCRIPT_DIR/poligonoTemp"

rm -rf "${SCRIPT_DIR}/Backend-Geomotica/uploads"/*

#echo "Eliminando contenido de la carpeta uploads..."
#rm -rf "${PARENT_DIR}/Backend-Geomotica/uploads"/*

# Eliminar el archivo tempIdAnalisis.txt
rm -f "$SCRIPT_DIR/tempIdAnalisis.txt"
