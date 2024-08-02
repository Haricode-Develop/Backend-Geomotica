const {
    obtenerNombreResponsableCm,
    obtenerFechaInicioCosechaCm,
    obtenerFechaFinCosechaCm,
    obtenerNombreFincaCm,
    obtenerCodigoParcelasResponsableCm,
    obtenerNombreOperadorCm,
    obtenerNombreMaquinaCm,
    obtenerConsumoCombustibleCm,
    obtenerPresionCortadorBase,
    obtenerRpmCm,
    obtenerTch,
    obtenerTah,
    obtenerCalidadGpsCm,
    obtenerActividadCm,
    obtenerAreaNetaCm,
    obtenerAreaBrutaCm,
    obtenerDiferenciaDeAreaCm,
    obtenerHoraInicioCm,
    obtenerHoraFinalCm,
    obtenerTiempoTotalActividadCm,
    obtenerEficienciaCm,
    obtenerPromedioVelocidadCm,
    obtenerPorcentajeAreaPilotoCm,
    obtenerPorcentajeAreaAutotrackerCm,
} = require("../models/cosechaMecanicaModel");

// Controladores para cada función del modelo
const crearControlador = (funcionModelo, nombreControlador) => {
    return async (req, res) => {
        const idAnalisis = req.params.ID_ANALISIS;

        try {
            const resultado = await funcionModelo(idAnalisis);
            return res.json(resultado);
        } catch (error) {
            console.error(`Error al obtener ${nombreControlador}:`, error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    };
};

// Controladores para obtener campos individuales
const NombreResponsableCm = crearControlador(obtenerNombreResponsableCm, "el nombre del responsable");
const FechaInicioCosechaCm = crearControlador(obtenerFechaInicioCosechaCm, "la fecha de inicio de cosecha");
const FechaFinCosechaCm = crearControlador(obtenerFechaFinCosechaCm, "la fecha de fin de cosecha");
const NombreFincaCm = crearControlador(obtenerNombreFincaCm, "el nombre de la finca");
const CodigoParcelaResponsableCm = crearControlador(obtenerCodigoParcelasResponsableCm, "el código de parcelas responsable");
const NombreOperadorCm = crearControlador(obtenerNombreOperadorCm, "el nombre del operador");
const NombreMaquinaCm = crearControlador(obtenerNombreMaquinaCm, "el nombre de la máquina");

// Controladores para obtener promedios
const ConsumoCombustibleCm = crearControlador(obtenerConsumoCombustibleCm, "el consumo de combustible");
const PresionCortadorBaseCm = crearControlador(obtenerPresionCortadorBase, "la presión del cortador base");
const RpmCm = crearControlador(obtenerRpmCm, "las RPM");
const TchCm = crearControlador(obtenerTch, "el TCH");
const TahCm = crearControlador(obtenerTah, "el TAH");
const CalidadGpsCm = crearControlador(obtenerCalidadGpsCm, "la calidad del GPS");

// Controladores para obtener campos adicionales
const ActividadCm = crearControlador(obtenerActividadCm, "la actividad");
const AreaNetaCm = crearControlador(obtenerAreaNetaCm, "el área neta");
const AreaBrutaCm = crearControlador(obtenerAreaBrutaCm, "el área bruta");
const DiferenciaDeAreaCm = crearControlador(obtenerDiferenciaDeAreaCm, "la diferencia de área");
const HoraInicioCm = crearControlador(obtenerHoraInicioCm, "la hora de inicio");
const HoraFinalCm = crearControlador(obtenerHoraFinalCm, "la hora final");
const TiempoTotalActividadCm = crearControlador(obtenerTiempoTotalActividadCm, "el tiempo total de actividad");
const EficienciaCm = crearControlador(obtenerEficienciaCm, "la eficiencia");
const PromedioVelocidadCm = crearControlador(obtenerPromedioVelocidadCm, "el promedio de velocidad");
const PorcentajeAreaPilotoCm = crearControlador(obtenerPorcentajeAreaPilotoCm, "el porcentaje de área de piloto");
const PorcentajeAreaAutoTrackerCm = crearControlador(obtenerPorcentajeAreaAutotrackerCm, "el porcentaje de área de autotracker");

// Controlador para subir un archivo JSON
const depositarJsonCosechaMecanica = async (req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const datos = req.body.datos;

    // Convertir los datos a una cadena JSON
    const json = JSON.stringify(datos);
    const fileName = `analisis/${idAnalisis}.json`;

    try {
        const file = bucket.file(fileName);

        await file.save(json, {
            metadata: {
                contentType: "application/json",
            },
        });

        res
            .status(200)
            .json({ message: "Archivo JSON subido exitosamente", fileName });
    } catch (error) {
        console.error("Error al subir el archivo JSON:", error);
        res
            .status(500)
            .json({ message: "Error al subir el archivo JSON", error: error.message });
    }
};

// Exportar todos los controladores
module.exports = {
    NombreResponsableCm,
    FechaInicioCosechaCm,
    FechaFinCosechaCm,
    NombreFincaCm,
    CodigoParcelaResponsableCm,
    NombreOperadorCm,
    NombreMaquinaCm,
    ConsumoCombustibleCm,
    PresionCortadorBaseCm,
    RpmCm,
    TchCm,
    TahCm,
    CalidadGpsCm,
    ActividadCm,
    AreaNetaCm,
    AreaBrutaCm,
    DiferenciaDeAreaCm,
    HoraInicioCm,
    HoraFinalCm,
    TiempoTotalActividadCm,
    EficienciaCm,
    PromedioVelocidadCm,
    PorcentajeAreaPilotoCm,
    PorcentajeAreaAutoTrackerCm,
    depositarJsonCosechaMecanica,
};
