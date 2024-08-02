const {
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
    obtenerTiempoTotalFertilizacion,
    obtenerEficienciaFertilizacion,
    obtenerPromedioDosisRealFertilizacion,
    obtenerDosisTeoricaFertilizacion,
} = require("../models/fertilizacionModel");

// Función genérica para crear controladores
const crearControlador = (funcionModelo, nombreControlador) => {
    return async (req, res) => {
        const idAnalisis = req.params.ID_ANALISIS;

        try {
            const resultado = await funcionModelo(idAnalisis);
            if (!resultado) {
                return res.status(404).json({ error: `No se encontró ${nombreControlador}` });
            }
            return res.json({ success: true, data: resultado });
        } catch (error) {
            console.error(`Error al obtener ${nombreControlador}:`, error);
            return res.status(500).json({ error: `Error interno del servidor: ${error.message}` });
        }
    };
};

// Controladores para cada función del modelo
const ResponsableFertilizacion = crearControlador(
    obtenerResponsableFertilizacion,
    "el responsable de fertilización"
);
const FechaInicioFertilizacion = crearControlador(
    obtenerFechaInicioFertilizacion,
    "la fecha de inicio de fertilización"
);
const FechaFinalFertilizacion = crearControlador(
    obtenerFechaFinalFertilizacion,
    "la fecha final de fertilización"
);
const NombreFincaFertilizacion = crearControlador(
    obtenerNombreFincaFertilizacion,
    "el nombre de la finca"
);
const OperadorFertilizacion = crearControlador(
    obtenerOperadorFertilizacion,
    "el operador de fertilización"
);
const EquipoFertilizacion = crearControlador(
    obtenerEquipoFertilizacion,
    "el equipo de fertilización"
);
const ActividadFertilizacion = crearControlador(
    obtenerActividadFertilizacion,
    "la actividad de fertilización"
);
const AreaNetaFertilizacion = crearControlador(
    obtenerAreaNetaFertilizacion,
    "el área neta de fertilización"
);
const AreaBrutaFertilizacion = crearControlador(
    obtenerAreaBrutaFertilizacion,
    "el área bruta de fertilización"
);
const DiferenciaAreaFertilizacion = crearControlador(
    obtenerDiferenciaAreaFertilizacion,
    "la diferencia de área de fertilización"
);
const HoraInicioFertilizacion = crearControlador(
    obtenerHoraInicioFertilizacion,
    "la hora de inicio de fertilización"
);
const HoraFinalFertilizacion = crearControlador(
    obtenerHoraFinalFertilizacion,
    "la hora final de fertilización"
);
const TiempoTotalFertilizacion = crearControlador(
    obtenerTiempoTotalFertilizacion,
    "el tiempo total de fertilización"
);
const EficienciaFertilizacion = crearControlador(
    obtenerEficienciaFertilizacion,
    "la eficiencia de fertilización"
);
const PromedioDosisRealFertilizacion = crearControlador(
    obtenerPromedioDosisRealFertilizacion,
    "el promedio de dosis real de fertilización"
);
const DosisTeoricaFertilizacion = crearControlador(
    obtenerDosisTeoricaFertilizacion,
    "la dosis teórica de fertilización"
);

// Exportar todos los controladores
module.exports = {
    ResponsableFertilizacion,
    FechaInicioFertilizacion,
    FechaFinalFertilizacion,
    NombreFincaFertilizacion,
    OperadorFertilizacion,
    EquipoFertilizacion,
    ActividadFertilizacion,
    AreaNetaFertilizacion,
    AreaBrutaFertilizacion,
    DiferenciaAreaFertilizacion,
    HoraInicioFertilizacion,
    HoraFinalFertilizacion,
    TiempoTotalFertilizacion,
    EficienciaFertilizacion,
    PromedioDosisRealFertilizacion,
    DosisTeoricaFertilizacion,
};
