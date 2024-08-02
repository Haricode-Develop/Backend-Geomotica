const {
    obtenerCampoUnico,
    obtenerPromedio,
    obtenerTiempoTotal,
} = require('../utils/indicadoresMapeoAnalisis');

const COLECCION_APS = 'aplicaciones_aereas';

// Funciones específicas para obtener campos individuales
const obtenerNombreResponsableAps = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'RESPONSABLE');

const obtenerFechaInicioCosechaAps = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'FECHA_INICIO');

const obtenerFechaFinalCosechaAps = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'FECHA_FINAL');

const obtenerNombreFincaAps = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'NOMBRE_FINCA');

const obtenerCodigoFincaResponsableAps = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'CODIGO_FINCA');

const obtenerNombreOperadorAps = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'NOMBRE_DE_OPERADOR');

const obtenerCodigoEquipoAps = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'CODIGO_DE_MAQUINA');

const obtenerHoraInicioAps = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'HORA_INICIO');

const obtenerHoraFinalAps = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'HORA_FINAL');

const obtenerCodigoLoteAps = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'CODIGO_LOTE');

const obtenerDosisTeorica = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'DOSIS_TEORICA');

const obtenerHumedadDelCultivo = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'HUMEDAD_DEL_CULTIVO');

const obtenerTchEstimado = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'TCH_ESTIMADO');

// Funciones específicas para obtener promedios
const obtenerEficienciaAps = async (idAnalisis) =>
    obtenerPromedio(COLECCION_APS, idAnalisis, 'EFICIENCIA');

// Función para obtener el tiempo total de actividad
const obtenerTiempoTotalAps = async (idAnalisis) =>
    obtenerTiempoTotal(COLECCION_APS, idAnalisis);


const obtenerProductosAps = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_APS, idAnalisis, 'PRODUCTO');

// Exportar todas las funciones
module.exports = {
    obtenerNombreResponsableAps,
    obtenerFechaInicioCosechaAps,
    obtenerFechaFinalCosechaAps,
    obtenerNombreFincaAps,
    obtenerCodigoFincaResponsableAps,
    obtenerNombreOperadorAps,
    obtenerCodigoEquipoAps,
    obtenerHoraInicioAps,
    obtenerHoraFinalAps,
    obtenerCodigoLoteAps,
    obtenerDosisTeorica,
    obtenerHumedadDelCultivo,
    obtenerTchEstimado,
    obtenerEficienciaAps,
    obtenerTiempoTotalAps,
    obtenerProductosAps
};
