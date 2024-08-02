const {
    obtenerCampoUnico,
    obtenerPromedio,
    obtenerTiempoTotal,
} = require('../utils/indicadoresMapeoAnalisis');

const COLECCION_HERBICIDAS = 'herbicidas';

// Funciones específicas para obtener campos individuales
const obtenerResponsableHerbicidas = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_HERBICIDAS, idAnalisis, 'RESPONSABLE');

const obtenerFechaHerbicidas = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_HERBICIDAS, idAnalisis, 'FECHA_INICIO');

const obtenerNombreFincaHerbicidas = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_HERBICIDAS, idAnalisis, 'NOMBRE_FINCA');

const obtenerParcelaHerbicidas = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_HERBICIDAS, idAnalisis, 'PARCELA');

const obtenerOperadorHerbicidas = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_HERBICIDAS, idAnalisis, 'OPERADOR');

const obtenerEquipoHerbicidas = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_HERBICIDAS, idAnalisis, 'EQUIPO');

const obtenerActividadHerbicidas = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_HERBICIDAS, idAnalisis, 'ACTIVIDAD');

const obtenerAreaNetaHerbicidas = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_HERBICIDAS, idAnalisis, 'AREA_NETA');

const obtenerAreaBrutaHerbicidas = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_HERBICIDAS, idAnalisis, 'AREA_BRUTA');

const obtenerDiferenciaDeAreaHerbicidas = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_HERBICIDAS, idAnalisis, 'DIFERENCIA_DE_AREA_Ha');

const obtenerHoraInicioHerbicidas = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_HERBICIDAS, idAnalisis, 'HORA_INICIO');

const obtenerHoraFinalHerbicidas = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_HERBICIDAS, idAnalisis, 'HORA_FINAL');

// Función para obtener el tiempo total de actividad
const obtenerTiempoTotalHerbicidas = async (idAnalisis) =>
    obtenerTiempoTotal(COLECCION_HERBICIDAS, idAnalisis);

// Funciones específicas para obtener promedios
const obtenerEficienciaHerbicidas = async (idAnalisis) =>
    obtenerPromedio(COLECCION_HERBICIDAS, idAnalisis, 'EFICIENCIA_Hora_Ha');

const obtenerPromedioVelocidadHerbicidas = async (idAnalisis) =>
    obtenerPromedio(COLECCION_HERBICIDAS, idAnalisis, 'VELOCIDAD_Km_H');

// Exportar todas las funciones
module.exports = {
    obtenerResponsableHerbicidas,
    obtenerFechaHerbicidas,
    obtenerNombreFincaHerbicidas,
    obtenerParcelaHerbicidas,
    obtenerOperadorHerbicidas,
    obtenerEquipoHerbicidas,
    obtenerActividadHerbicidas,
    obtenerAreaNetaHerbicidas,
    obtenerAreaBrutaHerbicidas,
    obtenerDiferenciaDeAreaHerbicidas,
    obtenerHoraInicioHerbicidas,
    obtenerHoraFinalHerbicidas,
    obtenerTiempoTotalHerbicidas,
    obtenerEficienciaHerbicidas,
    obtenerPromedioVelocidadHerbicidas,
};