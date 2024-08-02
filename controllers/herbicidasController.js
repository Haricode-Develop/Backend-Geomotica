// Importar funciones del modelo
const {
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
} = require("../models/herbicidasModel");

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
const ResponsableHerbicidas = crearControlador(
    obtenerResponsableHerbicidas,
    "el responsable de herbicidas"
);

const FechaHerbicidas = crearControlador(
    obtenerFechaHerbicidas,
    "la fecha de herbicidas"
);

const NombreFincaHerbicidas = crearControlador(
    obtenerNombreFincaHerbicidas,
    "el nombre de la finca"
);

const ParcelaHerbicidas = crearControlador(
    obtenerParcelaHerbicidas,
    "la parcela de herbicidas"
);

const OperadorHerbicidas = crearControlador(
    obtenerOperadorHerbicidas,
    "el operador de herbicidas"
);

const EquipoHerbicidas = crearControlador(
    obtenerEquipoHerbicidas,
    "el equipo de herbicidas"
);

const ActividadHerbicidas = crearControlador(
    obtenerActividadHerbicidas,
    "la actividad de herbicidas"
);

const AreaNetaHerbicidas = crearControlador(
    obtenerAreaNetaHerbicidas,
    "el área neta de herbicidas"
);

const AreaBrutaHerbicidas = crearControlador(
    obtenerAreaBrutaHerbicidas,
    "el área bruta de herbicidas"
);

const DiferenciaDeAreaHerbicidas = crearControlador(
    obtenerDiferenciaDeAreaHerbicidas,
    "la diferencia de área de herbicidas"
);

const HoraInicioHerbicidas = crearControlador(
    obtenerHoraInicioHerbicidas,
    "la hora de inicio de herbicidas"
);

const HoraFinalHerbicidas = crearControlador(
    obtenerHoraFinalHerbicidas,
    "la hora final de herbicidas"
);

const TiempoTotalHerbicidas = crearControlador(
    obtenerTiempoTotalHerbicidas,
    "el tiempo total de herbicidas"
);

const EficienciaHerbicidas = crearControlador(
    obtenerEficienciaHerbicidas,
    "la eficiencia de herbicidas"
);

const PromedioVelocidadHerbicidas = crearControlador(
    obtenerPromedioVelocidadHerbicidas,
    "el promedio de velocidad de herbicidas"
);

// Exportar todos los controladores
module.exports = {
    ResponsableHerbicidas,
    FechaHerbicidas,
    NombreFincaHerbicidas,
    ParcelaHerbicidas,
    OperadorHerbicidas,
    EquipoHerbicidas,
    ActividadHerbicidas,
    AreaNetaHerbicidas,
    AreaBrutaHerbicidas,
    DiferenciaDeAreaHerbicidas,
    HoraInicioHerbicidas,
    HoraFinalHerbicidas,
    TiempoTotalHerbicidas,
    EficienciaHerbicidas,
    PromedioVelocidadHerbicidas,
};