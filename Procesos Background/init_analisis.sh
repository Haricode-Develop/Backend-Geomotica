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
echo "ESTA ES LA RUTA"
echo $SCRIPT_DIR
echo "============== INICIA PROCESO DE ANALISIS (INIT_ANALISIS.SH) ================"
echo "PARAMETRO 1 QUE SE LE PASA AL SH: "
echo "$1"
echo "PARAMETRO 2 QUE SE LE PASA AL SH: "
echo "$2"

if [ $2 -eq $APS ]; then
echo "======== Se ejecuta analisis APS ======="
 "$SCRIPT_DIR"/procesos/insertDatosAps.sh "$1" "$ARCHIVO_CSV"
TABLA_ACTUAL="aps"
fi

if [ $2 -eq $COSECHA_MECANICA ]; then
echo "======== Se ejecuta analisis COSECHA MECANICA  ======="
  "$SCRIPT_DIR"/procesos/insertDatosCosechaMecanica.sh "$1" "$ARCHIVO_CSV" "$ID_MAX"

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

if [[ -f "$SCRIPT_DIR/tempIdAnalisis.txt" ]]; then
ID_ANALISIS=$(cat "$SCRIPT_DIR/tempIdAnalisis.txt")
echo "Este es el ID del analisis: $ID_ANALISIS"
echo "Esta es la tabla que se quiere hacer el análisis: $TABLA_ACTUAL"
unzip -o $ARCHIVO_POLIGONO -d "poligonoTemp"
python3 "$SCRIPT_DIR"/procesos/mapeo.py "$ID_ANALISIS" "$TABLA_ACTUAL" "poligonoTemp"
else
echo "Error: No se pudo obtener el ID del Analisis para el mapeo"
fi


rm -f tempIdAnalisis.txt