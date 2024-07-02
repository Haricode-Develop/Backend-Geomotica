const { ObjectId } = require('mongodb');
const connectDB = require('../config/database');

// Funciones para obtener datos de APS
const obtenerUltimoAnalisisQuery = async (tipoAnalisis, idUsuario) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('analisis');
    const resultado = await collection.findOne({ TIPO_ANALISIS: tipoAnalisis, ID_USUARIO: ObjectId(idUsuario) }, { sort: { _id: -1 } });
    return resultado;
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


const obtenerNombreResponsableAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.RESPONSABLE;
};

const obtenerFechaInicioCosechaAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.FECHA_INICIO;
};

const obtenerFechaFinalCosechaAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.FECHA_FINAL;
};

const obtenerNombreFincaAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.NOMBRE_FINCA;
};

const obtenerCodigoFincaResponsableAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.CODIGO_FINCA;
};

const obtenerNombreOperadorAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.NOMBRE_DE_OPERADOR;
};

const obtenerCodigoEquipoAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.CODIGO_DE_MAQUINA;
};

const obtenerHoraInicioAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.HORA_INICIO;
};

const obtenerHoraFinalAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.HORA_FINAL;
};

const obtenerEficienciaAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA, 0);
    return eficienciaTotal / resultados.length;
};

const obtenerCodigoLoteAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.CODIGO_LOTE;
};

const obtenerDosisTeorica = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.DOSIS_TEORICA;
};

const obtenerHumedadDelCultivo = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.HUMEDAD_DEL_CULTIVO;
};

const obtenerTchEstimado = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.TCH_ESTIMADO;
};

const obtenerTiempoTotalAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL_H, 0);
    return tiempoTotal;
};


// Funciones para obtener datos de Cosecha Mecánica
const obtenerNombreResponsableCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.RESPONSABLE;
};

const obtenerFechaInicioCosechaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.FECHA_INICIO;
};

const obtenerFechaFinCosechaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.FECHA_FINAL;
};

const obtenerNombreFincaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.NOMBRE_FINCA;
};

const obtenerCodigoParcelasResponsableCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.CODIGO_FINCA;
};

const obtenerNombreOperadorCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.OPERADOR;
};

const obtenerNombreMaquinaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.CODIGO_DE_MAQUINA;
};

const obtenerConsumoCombustibleCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const consumoTotal = resultados.reduce((acc, resultado) => acc + resultado.CONSUMOS_DE_COMBUSTIBLE, 0);
    return consumoTotal / resultados.length;
};

const obtenerPresionCortadorBase = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.PRESION_DE_CORTADOR_BASE;
};

const obtenerRpmCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const rpmTotal = resultados.reduce((acc, resultado) => acc + resultado.RPM, 0);
    return rpmTotal / resultados.length;
};

const obtenerTch = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const tchTotal = resultados.reduce((acc, resultado) => acc + resultado.TCH, 0);
    return tchTotal / resultados.length;
};

const obtenerTah = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const tahTotal = resultados.reduce((acc, resultado) => acc + resultado.TAH, 0);
    return tahTotal / resultados.length;
};

const obtenerCalidadGpsCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const calidadTotal = resultados.reduce((acc, resultado) => acc + resultado.CALIDAD_DE_SENAL, 0);
    return calidadTotal / resultados.length;
};

const obtenerActividadCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.ACTIVIDAD;
};

const obtenerAreaNetaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.AREA_NETA_Ha;
};

const obtenerAreaBrutaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.AREA_BRUTA_Ha;
};

const obtenerDiferenciaDeAreaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.DIFERENCIA_DE_AREA_Ha;
};

const obtenerHoraInicioCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.HORA_INICIO;
};

const obtenerHoraFinalCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.HORA_FINAL;
};

const obtenerTiempoTotalActividadCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL, 0);
    return tiempoTotal;
};

const obtenerEficienciaCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA_Hora_Ha, 0);
    return eficienciaTotal / resultados.length;
};

const obtenerPromedioVelocidadCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const velocidadTotal = resultados.reduce((acc, resultado) => acc + resultado.VELOCIDAD_Km_H, 0);
    return velocidadTotal / resultados.length;
};

const obtenerPorcentajeAreaPilotoCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.PILOTO_AUTOMATICO;
};

const obtenerPorcentajeAreaAutotrackerCm = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('cosecha_mecanica');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.AUTO_TRACKET;
};

// Funciones para obtener datos de Fertilización
const obtenerResponsableFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.RESPONSABLE;
};

const obtenerFechaInicioFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.FECHA_INICIO;
};

const obtenerFechaFinalFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.FECHA_FINAL;
};

const obtenerNombreFincaFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.NOMBRE_FINCA;
};

const obtenerOperadorFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.OPERADOR;
};

const obtenerEquipoFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.EQUIPO;
};

const obtenerActividadFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.ACTIVIDAD;
};

const obtenerAreaNetaFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.AREA_NETA;
};

const obtenerAreaBrutaFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.AREA_BRUTA;
};

const obtenerDiferenciaAreaFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.DIFERENCIA_DE_AREA_Ha;
};

const obtenerHoraInicioFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.HORA_INICIO;
};

const obtenerHoraFinalFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.HORA_FINAL;
};

const obtenerTiempoTotalFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL_H, 0);
    return tiempoTotal;
};

const obtenerEficienciaFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA_Hora_Ha, 0);
    return eficienciaTotal / resultados.length;
};

const obtenerPromedioDosisRealFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const dosisTotal = resultados.reduce((acc, resultado) => acc + resultado.DOSIS_REAL_Kg_ha, 0);
    return dosisTotal / resultados.length;
};

const obtenerDosisTeoricaFertilizacion = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('fertilización');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.DOSIS_TEORICA_Kg_ha;
};

// Funciones para obtener datos de Herbicidas
const obtenerResponsableHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.RESPONSABLE;
};

const obtenerFechaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.FECHA_INICIO;
};

const obtenerNombreFincaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.NOMBRE_FINCA;
};

const obtenerParcelaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.PARCELA;
};

const obtenerOperadorHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.OPERADOR;
};

const obtenerEquipoHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.EQUIPO;
};

const obtenerActividadHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.ACTIVIDAD;
};

const obtenerAreaNetaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.AREA_NETA;
};

const obtenerAreaBrutaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.AREA_BRUTA;
};

const obtenerDiferenciaDeAreaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.DIFERENCIA_DE_AREA_Ha;
};

const obtenerHoraInicioHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.HORA_INICIO;
};

const obtenerHoraFinalHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.HORA_FINAL;
};

const obtenerTiempoTotalHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL_H, 0);
    return tiempoTotal;
};

const obtenerEficienciaHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA_Hora_Ha, 0);
    return eficienciaTotal / resultados.length;
};

const obtenerPromedioVelocidadHerbicidas = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('herbicidas');
    const resultados = await collection.find({ ID_ANALISIS: ObjectId(idAnalisis) }).toArray();

    const velocidadTotal = resultados.reduce((acc, resultado) => acc + resultado.VELOCIDAD_Km_H, 0);
    return velocidadTotal / resultados.length;
};

const obtenerProductosAps = async (idAnalisis) => {
    const client = await connectDB();
    const db = client.db('geomoticaapp');
    const collection = db.collection('aplicaciones_aereas');
    const resultado = await collection.findOne({ ID_ANALISIS: ObjectId(idAnalisis) });
    return resultado.PRODUCTO;
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
};