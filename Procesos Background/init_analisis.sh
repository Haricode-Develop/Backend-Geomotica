#!/bin/bash

APS="1"
COSECHA_MECANICA="2"
HERBICIDAS="3"
FERTILIZACION="4"
TABLA_ACTUAL=""
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
API_URL="https://geomotica.ingeoproyectos.com/socket/emitirEvento"

echo "ESTA ES LA RUTA"
echo $SCRIPT_DIR
echo "============== INICIA PROCESO DE ANALISIS ================"
echo "ID USUARIO ======= $1"
if [ $2 -eq $APS ]; then
echo "======== Se ejecuta analisis APS ======="
 "$SCRIPT_DIR"/procesos/insertDatosAps.sh "$1"
TABLA_ACTUAL="aps"
fi

if [ $2 -eq $COSECHA_MECANICA ]; then
echo "======== Se ejecuta analisis COSECHA MECANICA  ======="
  "$SCRIPT_DIR"/procesos/insertDatosCosechaMecanica.sh "$1"

TABLA_ACTUAL="cosecha_mecanica"
fi

if [ $2  -eq  $HERBICIDAS ]; then
echo "======== Se ejecuta analisis HERBICIDAS  ======="
  "$SCRIPT_DIR"/procesos/insertDatosHerbicidas.sh "$1"

TABLA_ACTUAL="herbicidas"
fi

if [ $2 -eq $FERTILIZACION ]; then
echo "======== Se ejecuta analisis FERTILIZACION  ======="
  "$SCRIPT_DIR"/procesos/insertDatosFertilizacion.sh "$1"

TABLA_ACTUAL="usuarios"
fi

curl -X POST $API_URL

if [[ -f "$SCRIPT_DIR/tempIdAnalisis.tx"t ]]; then
ID_ANALISIS=$(cat "$SCRIPT_DIR/tempIdAnalisis.txt")
echo "Este es el ID del analisis: $ID_ANALISIS"
echo "Esta es la tabla que se quiere hacer el análisis: $TABLA_ACTUAL"
python3 "$SCRIPT_DIR"/procesos/mapeo.py "$ID_ANALISIS" "$TABLA_ACTUAL" 
else
echo "Error: No se pudo obtener el ID del Analisis para el mapeo"
fi
rm -f tempIdAnalisis.txt
