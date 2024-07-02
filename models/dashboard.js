const { ObjectId } = require('mongodb');
const connectDB = require('../config/database');

// Funciones para obtener datos de APS
const obtenerUltimoAnalisisQuery = async (tipoAnalisis, idUsuario) => {
    try {
        const client = await connectDB();
        const db = client.db('geomoticaapp');
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
        const db = client.db('geomoticaapp');
        const collection = db.collection('analisis');

        console.log("ESTE ES EL TIPO DE ANÁLISIS: ", tipoAnalisis);
        console.log("ESTE ES EL ID DE USUARIO: ", idUsuario);

        const resultado = await collection.insertOne({
            TIPO_ANALISIS: tipoAnalisis,
            ID_USUARIO: parseInt(idUsuario, 10),
            FECHA_CREACION: new Date()
        });

        console.log("ESTE ES EL RESULTADO: ", resultado);
        return resultado.insertedId;
    } catch (error) {
        console.error("Error al insertar análisis: ", error);
        throw new Error(`Error al insertar análisis: ${error.message}`);
    }
};

// Cambiar la obtención del ID_ANALISIS como string en lugar de ObjectId
const obtenerNombreResponsableAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.RESPONSABLE : null;
};

const obtenerFechaInicioCosechaAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.FECHA_INICIO : null;
};

const obtenerFechaFinalCosechaAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.FECHA_FINAL : null;
};

const obtenerNombreFincaAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.NOMBRE_FINCA : null;
};

const obtenerCodigoFincaResponsableAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.CODIGO_FINCA : null;
};

const obtenerNombreOperadorAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.NOMBRE_DE_OPERADOR : null;
};

const obtenerCodigoEquipoAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.CODIGO_DE_MAQUINA : null;
};

const obtenerHoraInicioAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.HORA_INICIO : null;
};

const obtenerHoraFinalAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.HORA_FINAL : null;
};

const obtenerEficienciaAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA, 0);
    return eficienciaTotal / resultados.length;
};

const obtenerCodigoLoteAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.CODIGO_LOTE : null;
};

const obtenerDosisTeorica = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.DOSIS_TEORICA : null;
};

const obtenerHumedadDelCultivo = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.HUMEDAD_DEL_CULTIVO : null;
};

const obtenerTchEstimado = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.TCH_ESTIMADO : null;
};

const obtenerTiempoTotalAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL_H, 0);
    return tiempoTotal;
};

// Funciones para obtener datos de Cosecha Mecánica
const obtenerNombreResponsableCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.RESPONSABLE : null;
};

const obtenerFechaInicioCosechaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.FECHA_INICIO : null;
};

const obtenerFechaFinCosechaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.FECHA_FINAL : null;
};

const obtenerNombreFincaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.NOMBRE_FINCA : null;
};

const obtenerCodigoParcelasResponsableCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.CODIGO_FINCA : null;
};

const obtenerNombreOperadorCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.OPERADOR : null;
};

const obtenerNombreMaquinaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.CODIGO_DE_MAQUINA : null;
};

const obtenerConsumoCombustibleCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const consumoTotal = resultados.reduce((acc, resultado) => acc + resultado.CONSUMOS_DE_COMBUSTIBLE, 0);
    return consumoTotal / resultados.length;
};

const obtenerPresionCortadorBase = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.PRESION_DE_CORTADOR_BASE : null;
};

const obtenerRpmCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const rpmTotal = resultados.reduce((acc, resultado) => acc + resultado.RPM, 0);
    return rpmTotal / resultados.length;
};

const obtenerTch = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const tchTotal = resultados.reduce((acc, resultado) => acc + resultado.TCH, 0);
    return tchTotal / resultados.length;
};

const obtenerTah = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const tahTotal = resultados.reduce((acc, resultado) => acc + resultado.TAH, 0);
    return tahTotal / resultados.length;
};

const obtenerCalidadGpsCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const calidadTotal = resultados.reduce((acc, resultado) => acc + resultado.CALIDAD_DE_SENAL, 0);
    return calidadTotal / resultados.length;
};

const obtenerActividadCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.ACTIVIDAD : null;
};

const obtenerAreaNetaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.AREA_NETA_Ha : null;
};

const obtenerAreaBrutaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.AREA_BRUTA_Ha : null;
};

const obtenerDiferenciaDeAreaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.DIFERENCIA_DE_AREA_Ha : null;
};

const obtenerHoraInicioCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.HORA_INICIO : null;
};

const obtenerHoraFinalCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.HORA_FINAL : null;
};

const obtenerTiempoTotalActividadCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL, 0);
    return tiempoTotal;
};

const obtenerEficienciaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA_Hora_Ha, 0);
    return eficienciaTotal / resultados.length;
};

const obtenerPromedioVelocidadCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const velocidadTotal = resultados.reduce((acc, resultado) => acc + resultado.VELOCIDAD_Km_H, 0);
    return velocidadTotal / resultados.length;
};

const obtenerPorcentajeAreaPilotoCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.PILOTO_AUTOMATICO : null;
};

const obtenerPorcentajeAreaAutotrackerCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.AUTO_TRACKET : null;
};

// Funciones para obtener datos de Fertilización
const obtenerResponsableFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.RESPONSABLE : null;
};

const obtenerFechaInicioFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.FECHA_INICIO : null;
};

const obtenerFechaFinalFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.FECHA_FINAL : null;
};

const obtenerNombreFincaFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.NOMBRE_FINCA : null;
};

const obtenerOperadorFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.OPERADOR : null;
};

const obtenerEquipoFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.EQUIPO : null;
};

const obtenerActividadFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.ACTIVIDAD : null;
};

const obtenerAreaNetaFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.AREA_NETA : null;
};

const obtenerAreaBrutaFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.AREA_BRUTA : null;
};

const obtenerDiferenciaAreaFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.DIFERENCIA_DE_AREA_Ha : null;
};

const obtenerHoraInicioFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.HORA_INICIO : null;
};

const obtenerHoraFinalFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.HORA_FINAL : null;
};

const obtenerTiempoTotalFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL_H, 0);
    return tiempoTotal;
};

const obtenerEficienciaFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA_Hora_Ha, 0);
    return eficienciaTotal / resultados.length;
};

const obtenerPromedioDosisRealFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const dosisTotal = resultados.reduce((acc, resultado) => acc + resultado.DOSIS_REAL_Kg_ha, 0);
    return dosisTotal / resultados.length;
};

const obtenerDosisTeoricaFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.DOSIS_TEORICA_Kg_ha : null;
};

// Funciones para obtener datos de Herbicidas
const obtenerResponsableHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.RESPONSABLE : null;
};

const obtenerFechaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.FECHA_INICIO : null;
};

const obtenerNombreFincaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.NOMBRE_FINCA : null;
};

const obtenerParcelaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.PARCELA : null;
};

const obtenerOperadorHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.OPERADOR : null;
};

const obtenerEquipoHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.EQUIPO : null;
};

const obtenerActividadHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.ACTIVIDAD : null;
};

const obtenerAreaNetaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.AREA_NETA : null;
};

const obtenerAreaBrutaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.AREA_BRUTA : null;
};

const obtenerDiferenciaDeAreaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.DIFERENCIA_DE_AREA_Ha : null;
};

const obtenerHoraInicioHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.HORA_INICIO : null;
};

const obtenerHoraFinalHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.HORA_FINAL : null;
};

const obtenerTiempoTotalHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL_H, 0);
    return tiempoTotal;
};

const obtenerEficienciaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA_Hora_Ha, 0);
    return eficienciaTotal / resultados.length;
};

const obtenerPromedioVelocidadHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();

    const velocidadTotal = resultados.reduce((acc, resultado) => acc + resultado.VELOCIDAD_Km_H, 0);
    return velocidadTotal / resultados.length;
};

const obtenerProductosAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
    return resultado ? resultado.PRODUCTO : null;
};

// Funciones para almacenar últimos valores
const almacenarUltimosValores = async (datos) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('ultimos_valores');
    const resultado = await collection.insertOne(datos);
    return resultado.insertedId;
};

const almacenarUltimosValoresAps = async (datos) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('ultimos_valores_aps');
    const resultado = await collection.insertOne(datos);
    return resultado.insertedId;
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
};s