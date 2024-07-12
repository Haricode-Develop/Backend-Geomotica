const connectDB = require('../config/database');

// Funciones para obtener datos de APS
const obtenerUltimoAnalisisQuery = async (tipoAnalisis, idUsuario) => {
    try {
        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('analisis');
        const resultado = await collection.findOne(
            { TIPO_ANALISIS: tipoAnalisis, ID_USUARIO: parseInt(idUsuario, 10) },
            { sort: { _id: -1 } }
        );
        return resultado;
    } catch (error) {
        console.error("Error al obtener el último análisis: ", error);
        throw new Error(`Error al obtener el último análisis: ${error.message}`);
    }
};

const insertarAnalisis = async (tipoAnalisis, idUsuario) => {
    try {
        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('analisis');


        const resultado = await collection.insertOne({
            TIPO_ANALISIS: tipoAnalisis,
            ID_USUARIO: parseInt(idUsuario, 10),
            FECHA_CREACION: new Date()
        });

        return resultado.insertedId;
    } catch (error) {
        console.error("Error al insertar análisis: ", error);
        throw new Error(`Error al insertar análisis: ${error.message}`);
    }
};

// Cambiar la obtención del ID_ANALISIS como string en lugar de ObjectId
const obtenerNombreResponsableAps = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.RESPONSABLE : null;
    } catch (error) {
        console.error("Error en obtenerNombreResponsableAps: ", error);
        throw new Error(`Error en obtenerNombreResponsableAps: ${error.message}`);
    }
};

const obtenerFechaInicioCosechaAps = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.FECHA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerFechaInicioCosechaAps: ", error);
        throw new Error(`Error en obtenerFechaInicioCosechaAps: ${error.message}`);
    }
};

const obtenerFechaFinalCosechaAps = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.FECHA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerFechaFinalCosechaAps: ", error);
        throw new Error(`Error en obtenerFechaFinalCosechaAps: ${error.message}`);
    }
};

const obtenerNombreFincaAps = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.NOMBRE_FINCA : null;
    } catch (error) {
        console.error("Error en obtenerNombreFincaAps: ", error);
        throw new Error(`Error en obtenerNombreFincaAps: ${error.message}`);
    }
};

const obtenerCodigoFincaResponsableAps = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.CODIGO_FINCA : null;
    } catch (error) {
        console.error("Error en obtenerCodigoFincaResponsableAps: ", error);
        throw new Error(`Error en obtenerCodigoFincaResponsableAps: ${error.message}`);
    }
};

const obtenerNombreOperadorAps = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.NOMBRE_DE_OPERADOR : null;
    } catch (error) {
        console.error("Error en obtenerNombreOperadorAps: ", error);
        throw new Error(`Error en obtenerNombreOperadorAps: ${error.message}`);
    }
};

const obtenerCodigoEquipoAps = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.CODIGO_DE_MAQUINA : null;
    } catch (error) {
        console.error("Error en obtenerCodigoEquipoAps: ", error);
        throw new Error(`Error en obtenerCodigoEquipoAps: ${error.message}`);
    }
};

const obtenerHoraInicioAps = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.HORA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerHoraInicioAps: ", error);
        throw new Error(`Error en obtenerHoraInicioAps: ${error.message}`);
    }
};

const obtenerHoraFinalAps = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.HORA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerHoraFinalAps: ", error);
        throw new Error(`Error en obtenerHoraFinalAps: ${error.message}`);
    }
};

const obtenerEficienciaAps = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA, 0);
        return eficienciaTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerEficienciaAps: ", error);
        throw new Error(`Error en obtenerEficienciaAps: ${error.message}`);
    }
};

const obtenerCodigoLoteAps = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.CODIGO_LOTE : null;
    } catch (error) {
        console.error("Error en obtenerCodigoLoteAps: ", error);
        throw new Error(`Error en obtenerCodigoLoteAps: ${error.message}`);
    }
};

const obtenerDosisTeorica = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.DOSIS_TEORICA : null;
    } catch (error) {
        console.error("Error en obtenerDosisTeorica: ", error);
        throw new Error(`Error en obtenerDosisTeorica: ${error.message}`);
    }
};

const obtenerHumedadDelCultivo = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.HUMEDAD_DEL_CULTIVO : null;
    } catch (error) {
        console.error("Error en obtenerHumedadDelCultivo: ", error);
        throw new Error(`Error en obtenerHumedadDelCultivo: ${error.message}`);
    }
};

const obtenerTchEstimado = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.TCH_ESTIMADO : null;
    } catch (error) {
        console.error("Error en obtenerTchEstimado: ", error);
        throw new Error(`Error en obtenerTchEstimado: ${error.message}`);
    }
};

const obtenerTiempoTotalAps = async (idAnalisis) => {
    try {
        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultados = await collection.distinct('ID_ANALISIS', { ID_ANALISIS: idAnalisis });
        console.log("RESULTADOS DE TIEMPO TOTAL: ", resultados);

        const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL, 0);
        return tiempoTotal;
    } catch (error) {
        console.error("Error en obtenerTiempoTotalAps: ", error);
        throw new Error(`Error en obtenerTiempoTotalAps: ${error.message}`);
    }
};




// Funciones para obtener datos de Cosecha Mecánica
const obtenerNombreResponsableCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.RESPONSABLE : null;
    } catch (error) {
        console.error("Error en obtenerNombreResponsableCm: ", error);
        throw new Error(`Error en obtenerNombreResponsableCm: ${error.message}`);
    }
};

const obtenerFechaInicioCosechaCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.FECHA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerFechaInicioCosechaCm: ", error);
        throw new Error(`Error en obtenerFechaInicioCosechaCm: ${error.message}`);
    }
};

const obtenerFechaFinCosechaCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.FECHA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerFechaFinCosechaCm: ", error);
        throw new Error(`Error en obtenerFechaFinCosechaCm: ${error.message}`);
    }
};

const obtenerNombreFincaCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.NOMBRE_FINCA : null;
    } catch (error) {
        console.error("Error en obtenerNombreFincaCm: ", error);
        throw new Error(`Error en obtenerNombreFincaCm: ${error.message}`);
    }
};

const obtenerCodigoParcelasResponsableCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.CODIGO_FINCA : null;
    } catch (error) {
        console.error("Error en obtenerCodigoParcelasResponsableCm: ", error);
        throw new Error(`Error en obtenerCodigoParcelasResponsableCm: ${error.message}`);
    }
};

const obtenerNombreOperadorCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.OPERADOR : null;
    } catch (error) {
        console.error("Error en obtenerNombreOperadorCm: ", error);
        throw new Error(`Error en obtenerNombreOperadorCm: ${error.message}`);
    }
};

const obtenerNombreMaquinaCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.CODIGO_DE_MAQUINA : null;
    } catch (error) {
        console.error("Error en obtenerNombreMaquinaCm: ", error);
        throw new Error(`Error en obtenerNombreMaquinaCm: ${error.message}`);
    }
};

const obtenerConsumoCombustibleCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const consumoTotal = resultados.reduce((acc, resultado) => acc + resultado.CONSUMOS_DE_COMBUSTIBLE, 0);
        return consumoTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerConsumoCombustibleCm: ", error);
        throw new Error(`Error en obtenerConsumoCombustibleCm: ${error.message}`);
    }
};

const obtenerPresionCortadorBase = async (idAnalisis) => {
    try {
        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const presionTotal = resultados.reduce((acc, resultado) => acc + resultado.PRESION_DE_CORTADOR_BASE, 0);
        return presionTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerPresionCortadorBase: ", error);
        throw new Error(`Error en obtenerPresionCortadorBase: ${error.message}`);
    }
};

const obtenerRpmCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const rpmTotal = resultados.reduce((acc, resultado) => acc + resultado.RPM, 0);
        return rpmTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerRpmCm: ", error);
        throw new Error(`Error en obtenerRpmCm: ${error.message}`);
    }
};

const obtenerTch = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const tchTotal = resultados.reduce((acc, resultado) => acc + resultado.TCH, 0);
        return tchTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerTch: ", error);
        throw new Error(`Error en obtenerTch: ${error.message}`);
    }
};

const obtenerTah = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const tahTotal = resultados.reduce((acc, resultado) => acc + resultado.TAH, 0);
        return tahTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerTah: ", error);
        throw new Error(`Error en obtenerTah: ${error.message}`);
    }
};

const obtenerCalidadGpsCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const calidadTotal = resultados.reduce((acc, resultado) => acc + resultado.CALIDAD_DE_SENAL, 0);
        return calidadTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerCalidadGpsCm: ", error);
        throw new Error(`Error en obtenerCalidadGpsCm: ${error.message}`);
    }
};

const obtenerActividadCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.ACTIVIDAD : null;
    } catch (error) {
        console.error("Error en obtenerActividadCm: ", error);
        throw new Error(`Error en obtenerActividadCm: ${error.message}`);
    }
};

const obtenerAreaNetaCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.AREA_NETA_Ha : null;
    } catch (error) {
        console.error("Error en obtenerAreaNetaCm: ", error);
        throw new Error(`Error en obtenerAreaNetaCm: ${error.message}`);
    }
};

const obtenerAreaBrutaCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.AREA_BRUTA_Ha : null;
    } catch (error) {
        console.error("Error en obtenerAreaBrutaCm: ", error);
        throw new Error(`Error en obtenerAreaBrutaCm: ${error.message}`);
    }
};

const obtenerDiferenciaDeAreaCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.DIFERENCIA_DE_AREA_Ha : null;
    } catch (error) {
        console.error("Error en obtenerDiferenciaDeAreaCm: ", error);
        throw new Error(`Error en obtenerDiferenciaDeAreaCm: ${error.message}`);
    }
};

const obtenerHoraInicioCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.HORA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerHoraInicioCm: ", error);
        throw new Error(`Error en obtenerHoraInicioCm: ${error.message}`);
    }
};

const obtenerHoraFinalCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.HORA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerHoraFinalCm: ", error);
        throw new Error(`Error en obtenerHoraFinalCm: ${error.message}`);
    }
};

const obtenerTiempoTotalActividadCm = async (idAnalisis) => {
    try {
        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.distinct('ID_ANALISIS', { ID_ANALISIS: idAnalisis });

        const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL, 0);
        return tiempoTotal;
    } catch (error) {
        console.error("Error en obtenerTiempoTotalActividadCm: ", error);
        throw new Error(`Error en obtenerTiempoTotalActividadCm: ${error.message}`);
    }
};


const obtenerEficienciaCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA_Hora_Ha, 0);
        return eficienciaTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerEficienciaCm: ", error);
        throw new Error(`Error en obtenerEficienciaCm: ${error.message}`);
    }
};

const obtenerPromedioVelocidadCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const velocidadTotal = resultados.reduce((acc, resultado) => acc + resultado.VELOCIDAD_Km_H, 0);
        return velocidadTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerPromedioVelocidadCm: ", error);
        throw new Error(`Error en obtenerPromedioVelocidadCm: ${error.message}`);
    }
};

const obtenerPorcentajeAreaPilotoCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.PILOTO_AUTOMATICO : null;
    } catch (error) {
        console.error("Error en obtenerPorcentajeAreaPilotoCm: ", error);
        throw new Error(`Error en obtenerPorcentajeAreaPilotoCm: ${error.message}`);
    }
};

const obtenerPorcentajeAreaAutotrackerCm = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.AUTO_TRACKET : null;
    } catch (error) {
        console.error("Error en obtenerPorcentajeAreaAutotrackerCm: ", error);
        throw new Error(`Error en obtenerPorcentajeAreaAutotrackerCm: ${error.message}`);
    }
};

// Funciones para obtener datos de Fertilización
const obtenerResponsableFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.RESPONSABLE : null;
    } catch (error) {
        console.error("Error en obtenerResponsableFertilizacion: ", error);
        throw new Error(`Error en obtenerResponsableFertilizacion: ${error.message}`);
    }
};

const obtenerFechaInicioFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.FECHA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerFechaInicioFertilizacion: ", error);
        throw new Error(`Error en obtenerFechaInicioFertilizacion: ${error.message}`);
    }
};

const obtenerFechaFinalFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.FECHA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerFechaFinalFertilizacion: ", error);
        throw new Error(`Error en obtenerFechaFinalFertilizacion: ${error.message}`);
    }
};

const obtenerNombreFincaFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.NOMBRE_FINCA : null;
    } catch (error) {
        console.error("Error en obtenerNombreFincaFertilizacion: ", error);
        throw new Error(`Error en obtenerNombreFincaFertilizacion: ${error.message}`);
    }
};

const obtenerOperadorFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.OPERADOR : null;
    } catch (error) {
        console.error("Error en obtenerOperadorFertilizacion: ", error);
        throw new Error(`Error en obtenerOperadorFertilizacion: ${error.message}`);
    }
};

const obtenerEquipoFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.EQUIPO : null;
    } catch (error) {
        console.error("Error en obtenerEquipoFertilizacion: ", error);
        throw new Error(`Error en obtenerEquipoFertilizacion: ${error.message}`);
    }
};

const obtenerActividadFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.ACTIVIDAD : null;
    } catch (error) {
        console.error("Error en obtenerActividadFertilizacion: ", error);
        throw new Error(`Error en obtenerActividadFertilizacion: ${error.message}`);
    }
};

const obtenerAreaNetaFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.AREA_NETA : null;
    } catch (error) {
        console.error("Error en obtenerAreaNetaFertilizacion: ", error);
        throw new Error(`Error en obtenerAreaNetaFertilizacion: ${error.message}`);
    }
};

const obtenerAreaBrutaFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.AREA_BRUTA : null;
    } catch (error) {
        console.error("Error en obtenerAreaBrutaFertilizacion: ", error);
        throw new Error(`Error en obtenerAreaBrutaFertilizacion: ${error.message}`);
    }
};

const obtenerDiferenciaAreaFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.DIFERENCIA_DE_AREA_Ha : null;
    } catch (error) {
        console.error("Error en obtenerDiferenciaAreaFertilizacion: ", error);
        throw new Error(`Error en obtenerDiferenciaAreaFertilizacion: ${error.message}`);
    }
};

const obtenerHoraInicioFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.HORA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerHoraInicioFertilizacion: ", error);
        throw new Error(`Error en obtenerHoraInicioFertilizacion: ${error.message}`);
    }
};

const obtenerHoraFinalFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.HORA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerHoraFinalFertilizacion: ", error);
        throw new Error(`Error en obtenerHoraFinalFertilizacion: ${error.message}`);
    }
};

const obtenerTiempoTotalFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL_H, 0);
        return tiempoTotal;
    } catch (error) {
        console.error("Error en obtenerTiempoTotalFertilizacion: ", error);
        throw new Error(`Error en obtenerTiempoTotalFertilizacion: ${error.message}`);
    }
};

const obtenerEficienciaFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA_Hora_Ha, 0);
        return eficienciaTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerEficienciaFertilizacion: ", error);
        throw new Error(`Error en obtenerEficienciaFertilizacion: ${error.message}`);
    }
};

const obtenerPromedioDosisRealFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const dosisTotal = resultados.reduce((acc, resultado) => acc + resultado.DOSIS_REAL_Kg_ha, 0);
        return dosisTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerPromedioDosisRealFertilizacion: ", error);
        throw new Error(`Error en obtenerPromedioDosisRealFertilizacion: ${error.message}`);
    }
};

const obtenerDosisTeoricaFertilizacion = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.DOSIS_TEORICA_Kg_ha : null;
    } catch (error) {
        console.error("Error en obtenerDosisTeoricaFertilizacion: ", error);
        throw new Error(`Error en obtenerDosisTeoricaFertilizacion: ${error.message}`);
    }
};

// Funciones para obtener datos de Herbicidas
const obtenerResponsableHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.RESPONSABLE : null;
    } catch (error) {
        console.error("Error en obtenerResponsableHerbicidas: ", error);
        throw new Error(`Error en obtenerResponsableHerbicidas: ${error.message}`);
    }
};

const obtenerFechaHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.FECHA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerFechaHerbicidas: ", error);
        throw new Error(`Error en obtenerFechaHerbicidas: ${error.message}`);
    }
};

const obtenerNombreFincaHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.NOMBRE_FINCA : null;
    } catch (error) {
        console.error("Error en obtenerNombreFincaHerbicidas: ", error);
        throw new Error(`Error en obtenerNombreFincaHerbicidas: ${error.message}`);
    }
};

const obtenerParcelaHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.PARCELA : null;
    } catch (error) {
        console.error("Error en obtenerParcelaHerbicidas: ", error);
        throw new Error(`Error en obtenerParcelaHerbicidas: ${error.message}`);
    }
};

const obtenerOperadorHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.OPERADOR : null;
    } catch (error) {
        console.error("Error en obtenerOperadorHerbicidas: ", error);
        throw new Error(`Error en obtenerOperadorHerbicidas: ${error.message}`);
    }
};

const obtenerEquipoHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.EQUIPO : null;
    } catch (error) {
        console.error("Error en obtenerEquipoHerbicidas: ", error);
        throw new Error(`Error en obtenerEquipoHerbicidas: ${error.message}`);
    }
};

const obtenerActividadHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.ACTIVIDAD : null;
    } catch (error) {
        console.error("Error en obtenerActividadHerbicidas: ", error);
        throw new Error(`Error en obtenerActividadHerbicidas: ${error.message}`);
    }
};

const obtenerAreaNetaHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.AREA_NETA : null;
    } catch (error) {
        console.error("Error en obtenerAreaNetaHerbicidas: ", error);
        throw new Error(`Error en obtenerAreaNetaHerbicidas: ${error.message}`);
    }
};

const obtenerAreaBrutaHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.AREA_BRUTA : null;
    } catch (error) {
        console.error("Error en obtenerAreaBrutaHerbicidas: ", error);
        throw new Error(`Error en obtenerAreaBrutaHerbicidas: ${error.message}`);
    }
};

const obtenerDiferenciaDeAreaHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.DIFERENCIA_DE_AREA_Ha : null;
    } catch (error) {
        console.error("Error en obtenerDiferenciaDeAreaHerbicidas: ", error);
        throw new Error(`Error en obtenerDiferenciaDeAreaHerbicidas: ${error.message}`);
    }
};

const obtenerHoraInicioHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.HORA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerHoraInicioHerbicidas: ", error);
        throw new Error(`Error en obtenerHoraInicioHerbicidas: ${error.message}`);
    }
};

const obtenerHoraFinalHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.HORA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerHoraFinalHerbicidas: ", error);
        throw new Error(`Error en obtenerHoraFinalHerbicidas: ${error.message}`);
    }
};

const obtenerTiempoTotalHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL_H, 0);
        return tiempoTotal;
    } catch (error) {
        console.error("Error en obtenerTiempoTotalHerbicidas: ", error);
        throw new Error(`Error en obtenerTiempoTotalHerbicidas: ${error.message}`);
    }
};

const obtenerEficienciaHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA_Hora_Ha, 0);
        return eficienciaTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerEficienciaHerbicidas: ", error);
        throw new Error(`Error en obtenerEficienciaHerbicidas: ${error.message}`);
    }
};

const obtenerPromedioVelocidadHerbicidas = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('herbicidas');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

        const velocidadTotal = resultados.reduce((acc, resultado) => acc + resultado.VELOCIDAD_Km_H, 0);
        return velocidadTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerPromedioVelocidadHerbicidas: ", error);
        throw new Error(`Error en obtenerPromedioVelocidadHerbicidas: ${error.message}`);
    }
};

const obtenerProductosAps = async (idAnalisis) => {
    try {

        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });

        return resultado ? resultado.PRODUCTO : null;
    } catch (error) {
        console.error("Error en obtenerProductosAps: ", error);
        throw new Error(`Error en obtenerProductosAps: ${error.message}`);
    }
};

// Funciones para almacenar últimos valores
const almacenarUltimosValores = async (datos) => {
    try {
        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('ultimos_valores');
        const resultado = await collection.insertOne(datos);

        return resultado.insertedId;
    } catch (error) {
        console.error("Error en almacenarUltimosValores: ", error);
        throw new Error(`Error en almacenarUltimosValores: ${error.message}`);
    }
};

const almacenarUltimosValoresAps = async (datos) => {
    try {
        const client = await connectDB();
        const db = client.db('GeomoticaProduccion');
        const collection = db.collection('ultimos_valores_aps');
        const resultado = await collection.insertOne(datos);

        return resultado.insertedId;
    } catch (error) {
        console.error("Error en almacenarUltimosValoresAps: ", error);
        throw new Error(`Error en almacenarUltimosValoresAps: ${error.message}`);
    }
};

module.exports = {
    obtenerUltimoAnalisisQuery,
    insertarAnalisis,
    obtenerNombreResponsableAps,
    obtenerFechaInicioCosechaAps,
    obtenerFechaFinalCosechaAps,
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
    obtenerTiempoTotalAps,
    obtenerProductosAps,
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
    almacenarUltimosValores,
    almacenarUltimosValoresAps
};