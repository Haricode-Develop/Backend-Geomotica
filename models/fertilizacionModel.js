const {
    obtenerCampoUnico,
    obtenerPromedio,
    obtenerTiempoTotal,
} = require('../utils/indicadoresMapeoAnalisis');

const COLECCION_FERTILIZACION = 'fertilización';

// Funciones específicas para obtener campos individuales
const obtenerResponsableFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'RESPONSABLE');

const obtenerFechaInicioFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'FECHA_INICIO');

const obtenerFechaFinalFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'FECHA_FINAL');

const obtenerNombreFincaFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'NOMBRE_FINCA');

const obtenerOperadorFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'OPERADOR');

const obtenerEquipoFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'EQUIPO');

const obtenerActividadFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'ACTIVIDAD');

const obtenerAreaNetaFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'AREA_NETA');

const obtenerAreaBrutaFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'AREA_BRUTA');

const obtenerDiferenciaAreaFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'DIFERENCIA_DE_AREA_Ha');

const obtenerHoraInicioFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'HORA_INICIO');

const obtenerHoraFinalFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'HORA_FINAL');

// Funciones específicas para obtener promedios
const obtenerEficienciaFertilizacion = async (idAnalisis) =>
    obtenerPromedio(COLECCION_FERTILIZACION, idAnalisis, 'EFICIENCIA_Hora_Ha');

const obtenerPromedioDosisRealFertilizacion = async (idAnalisis) =>
    obtenerPromedio(COLECCION_FERTILIZACION, idAnalisis, 'DOSIS_REAL_Kg_ha');

// Función para obtener el tiempo total de actividad
const obtenerTiempoTotalFertilizacion = async (idAnalisis) =>
    obtenerTiempoTotal(COLECCION_FERTILIZACION, idAnalisis);

const obtenerDosisTeoricaFertilizacion = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_FERTILIZACION, idAnalisis, 'DOSIS_TEORICA_Kg_ha');

// Exportar todas las funciones
module.exports = {
    obtenerResponsableFertilizacion,
    obtenerFechaInicioFertilizacion,
    obtenerFechaFinalFertilizacion,
    obtenerNombreFincaFertilizacion,
    obtenerOperadorFertilizacion,
    obtenerEquipoFertilizacion,
    obtenerActividadFertilizacion,
    obtenerAreaNetaFertilizacion,
    obtenerAreaBrutaFertilizacion,
    obtenerDiferenciaAreaFertilizacion,
    obtenerHoraInicioFertilizacion,
    obtenerHoraFinalFertilizacion,
    obtenerEficienciaFertilizacion,
    obtenerPromedioDosisRealFertilizacion,
    obtenerTiempoTotalFertilizacion,
    obtenerDosisTeoricaFertilizacion,
};
