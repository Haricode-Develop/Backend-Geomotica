const {
    obtenerCampoUnico,
    obtenerPromedio,
    obtenerTiempoTotal,
} = require('../utils/indicadoresMapeoAnalisis');

const COLECCION_CM = 'cosecha_mecanica';

// Funciones específicas para obtener campos individuales
const obtenerNombreResponsableCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'RESPONSABLE');

const obtenerFechaInicioCosechaCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'FECHA_INICIO');

const obtenerFechaFinCosechaCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'FECHA_FINAL');

const obtenerNombreFincaCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'NOMBRE_FINCA');

const obtenerCodigoParcelasResponsableCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'CODIGO_FINCA');

const obtenerNombreOperadorCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'OPERADOR');

const obtenerNombreMaquinaCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'CODIGO_DE_MAQUINA');

const obtenerActividadCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'ACTIVIDAD');

const obtenerAreaNetaCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'AREA_NETA_Ha');

const obtenerAreaBrutaCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'AREA_BRUTA_Ha');

const obtenerDiferenciaDeAreaCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'DIFERENCIA_DE_AREA_Ha');

const obtenerHoraInicioCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'HORA_INICIO');

const obtenerHoraFinalCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'HORA_FINAL');

const obtenerPorcentajeAreaPilotoCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'PILOTO_AUTOMATICO');

const obtenerPorcentajeAreaAutotrackerCm = async (idAnalisis) =>
    obtenerCampoUnico(COLECCION_CM, idAnalisis, 'AUTO_TRACKER'); // Corregir nombre del campo

// Funciones específicas para obtener promedios
const obtenerConsumoCombustibleCm = async (idAnalisis) =>
    obtenerPromedio(COLECCION_CM, idAnalisis, 'CONSUMOS_DE_COMBUSTIBLE');

const obtenerPresionCortadorBase = async (idAnalisis) =>
    obtenerPromedio(COLECCION_CM, idAnalisis, 'PRESION_DE_CORTADOR_BASE');

const obtenerRpmCm = async (idAnalisis) =>
    obtenerPromedio(COLECCION_CM, idAnalisis, 'RPM');

const obtenerTch = async (idAnalisis) =>
    obtenerPromedio(COLECCION_CM, idAnalisis, 'TCH');

const obtenerTah = async (idAnalisis) =>
    obtenerPromedio(COLECCION_CM, idAnalisis, 'TAH');

const obtenerCalidadGpsCm = async (idAnalisis) =>
    obtenerPromedio(COLECCION_CM, idAnalisis, 'CALIDAD_DE_SENAL');

const obtenerEficienciaCm = async (idAnalisis) =>
    obtenerPromedio(COLECCION_CM, idAnalisis, 'EFICIENCIA_Hora_Ha');

const obtenerPromedioVelocidadCm = async (idAnalisis) =>
    obtenerPromedio(COLECCION_CM, idAnalisis, 'VELOCIDAD_Km_H');

// Función para obtener el tiempo total de actividad
const obtenerTiempoTotalActividadCm = async (idAnalisis) =>
    obtenerTiempoTotal(COLECCION_CM, idAnalisis);

// Exportar todas las funciones correctamente
module.exports = {
    obtenerNombreResponsableCm,
    obtenerFechaInicioCosechaCm,
    obtenerFechaFinCosechaCm,
    obtenerNombreFincaCm,
    obtenerCodigoParcelasResponsableCm,
    obtenerNombreOperadorCm,
    obtenerNombreMaquinaCm,
    obtenerActividadCm,
    obtenerAreaNetaCm,
    obtenerAreaBrutaCm,
    obtenerDiferenciaDeAreaCm,
    obtenerHoraInicioCm,
    obtenerHoraFinalCm,
    obtenerPorcentajeAreaPilotoCm,
    obtenerPorcentajeAreaAutotrackerCm,
    obtenerConsumoCombustibleCm,
    obtenerPresionCortadorBase,
    obtenerRpmCm,
    obtenerTch,
    obtenerTah,
    obtenerCalidadGpsCm,
    obtenerEficienciaCm,
    obtenerPromedioVelocidadCm,
    obtenerTiempoTotalActividadCm
};
