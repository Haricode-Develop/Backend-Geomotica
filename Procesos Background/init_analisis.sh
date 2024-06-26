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
ES_ULTIMA_ITERACION="$9"
TABLA_ACTUAL_FILE="$SCRIPT_DIR/tabla_actual.txt"
API_URL="http://localhost:3001/socket/loadingAnalysis"


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
  DATA='{"progress": 10, "message": "Iniciando análisis"}'

  curl -X POST -H "Content-Type: application/json" -d "$DATA" $API_URL
      if [ $2 -eq $APS ] && [ "$VALIDAR" = "ok" ]; then
          echo "======== Se ejecuta analisis APS ======="
          DATA='{"progress": 20, "message": "Ejecutando inserción de datos de aplicaciones areas"}'
          curl -X POST -H "Content-Type: application/json" -d "$DATA" $API_URL

          "$SCRIPT_DIR"/procesos/insertDatosAps.sh "$1" "$ARCHIVO_CSV" "$ID_MAX" "$API_URL"
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
      echo $TABLA_ACTUAL > "$TABLA_ACTUAL_FILE"
else
      if [ -f "$TABLA_ACTUAL_FILE" ]; then
        TABLA_ACTUAL=$(cat "$TABLA_ACTUAL_FILE")
      fi
fi

if [[ -f "$SCRIPT_DIR/tempIdAnalisis.txt" ]]; then
    if [ $2 -ne $APS ] && [ "$VALIDAR" = "ok" ]; then
        ID_ANALISIS=$(cat "$SCRIPT_DIR/tempIdAnalisis.txt")
        echo "Este es el ID del analisis: $ID_ANALISIS"
        echo "Esta es la tabla que se quiere hacer el análisis: $TABLA_ACTUAL"
        POLIGONO_DIR="$SCRIPT_DIR/poligonoTemp"
        mkdir -p "$POLIGONO_DIR"
        unzip -o "$ARCHIVO_POLIGONO" -d "$POLIGONO_DIR"

          echo "Contenido de $POLIGONO_DIR:"
          ls -l "$POLIGONO_DIR"
        if [ "$ES_PRIMERA_ITERACION" = "true" ]; then
            DATA='{"progress": 50, "message": "Iniciando mapeo de datos"}'
        fi
        curl -X POST -H "Content-Type: application/json" -d "$DATA" $API_URL
        export GOOGLE_APPLICATION_CREDENTIALS="/geomotica/procesos/analog-figure-382403-0c07b0baecfa.json"
        python3 "$SCRIPT_DIR/procesos/mapeo.py" "$ID_ANALISIS" "$TABLA_ACTUAL" "$POLIGONO_DIR" "$OFFSET" "$ES_ULTIMA_ITERACION"
    elif [ $2 -eq $APS ] && [ "$VALIDAR" = "ok" ]; then
        ID_ANALISIS=$(cat "$SCRIPT_DIR/tempIdAnalisis.txt")
        echo "Este es el ID del analisis: $ID_ANALISIS"
        echo "Esta es la tabla que se quiere hacer el análisis: $TABLA_ACTUAL"

    fi
else
    echo "Error: No se pudo obtener el ID del Analisis para el mapeo"
fi

if [ "$ES_ULTIMA_ITERACION" = "true" ]; then
    rm -rf "$SCRIPT_DIR/poligonoTemp"
    rm -rf "${SCRIPT_DIR}/Backend-Geomotica/uploads"/*
    rm -f "$SCRIPT_DIR/tempIdAnalisis.txt"
    rm -f "$TABLA_ACTUAL_FILE"
    rm -rf "mnt"
fi
