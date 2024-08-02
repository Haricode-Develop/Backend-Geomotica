// controllers/aplicacionesAereasController.js

const {
    obtenerNombreResponsableAps,
    obtenerFechaInicioCosechaAps,
    obtenerFechaFinalCosechaAps,
    obtenerTiempoTotalAps,
    obtenerNombreFincaAps,
    obtenerCodigoFincaResponsableAps,
    obtenerNombreOperadorAps,
    obtenerCodigoEquipoAps,
    obtenerHoraInicioAps,
    obtenerHoraFinalAps,
    obtenerEficienciaAps,
    obtenerCodigoLoteAps,
    obtenerDosisTeorica,
    obtenerHumedadDelCultivo,
    obtenerTchEstimado,
    obtenerProductosAps
} = require("../models/aplicacionesAereasModel");

// Función para crear controladores de forma genérica
const crearControlador = (funcionModelo, descripcion) => {
    return async (req, res) => {
        const idAnalisis = req.params.ID_ANALISIS;

        try {
            const resultado = await funcionModelo(idAnalisis);
            if (!resultado) {
                return res.status(404).json({ error: `No se encontró ${descripcion}` });
            }
            return res.json({ success: true, data: resultado });
        } catch (error) {
            console.error(`Error al obtener ${descripcion}:`, error);
            return res.status(500).json({ error: `Error interno del servidor: ${error.message}` });
        }
    };
};

// Controladores para cada campo
const ResponsableAps = crearControlador(obtenerNombreResponsableAps, "el responsable");
const FechaInicioCosechaAps = crearControlador(obtenerFechaInicioCosechaAps, "la fecha de inicio de cosecha");
const FechaFinCosechaAPS = crearControlador(obtenerFechaFinalCosechaAps, "la fecha de fin de cosecha");
const TiempoTotalAps = crearControlador(obtenerTiempoTotalAps, "el tiempo total");
const NombreFincaAps = crearControlador(obtenerNombreFincaAps, "el nombre de la finca");
const CodigoParcelasAps = crearControlador(obtenerCodigoFincaResponsableAps, "el código de finca responsable");
const NombreOperadorAps = crearControlador(obtenerNombreOperadorAps, "el nombre del operador");
const EquipoAps = crearControlador(obtenerCodigoEquipoAps, "el código de equipo");
const HoraInicioAps = crearControlador(obtenerHoraInicioAps, "la hora de inicio");
const HoraFinalAps = crearControlador(obtenerHoraFinalAps, "la hora final");
const EficienciaAps = crearControlador(obtenerEficienciaAps, "la eficiencia");
const CodigoLotesAps = crearControlador(obtenerCodigoLoteAps, "el código de lote");
const DosisTeoricaAps = crearControlador(obtenerDosisTeorica, "la dosis teórica");
const HumedadDelCultivo = crearControlador(obtenerHumedadDelCultivo, "la humedad del cultivo");
const TchEstimado = crearControlador(obtenerTchEstimado, "el TCH estimado");
const ProductoAps = crearControlador(obtenerProductosAps, "el producto APS");

// Exportar todos los controladores
module.exports = {
    ResponsableAps,
    FechaInicioCosechaAps,
    FechaFinCosechaAPS,
    TiempoTotalAps,
    NombreFincaAps,
    CodigoParcelasAps,
    NombreOperadorAps,
    EquipoAps,
    HoraInicioAps,
    HoraFinalAps,
    EficienciaAps,
    CodigoLotesAps,
    DosisTeoricaAps,
    HumedadDelCultivo,
    TchEstimado,
    ProductoAps,
};
