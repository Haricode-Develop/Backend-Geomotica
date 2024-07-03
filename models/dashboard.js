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
    try {
        console.log("obtenerNombreResponsableAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerNombreResponsableAps - Resultado:", resultado);
        return resultado ? resultado.RESPONSABLE : null;
    } catch (error) {
        console.error("Error en obtenerNombreResponsableAps: ", error);
        throw new Error(`Error en obtenerNombreResponsableAps: ${error.message}`);
    }
};

const obtenerFechaInicioCosechaAps = async (idAnalisis) => {
    try {
        console.log("obtenerFechaInicioCosechaAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerFechaInicioCosechaAps - Resultado:", resultado);
        return resultado ? resultado.FECHA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerFechaInicioCosechaAps: ", error);
        throw new Error(`Error en obtenerFechaInicioCosechaAps: ${error.message}`);
    }
};

const obtenerFechaFinalCosechaAps = async (idAnalisis) => {
    try {
        console.log("obtenerFechaFinalCosechaAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerFechaFinalCosechaAps - Resultado:", resultado);
        return resultado ? resultado.FECHA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerFechaFinalCosechaAps: ", error);
        throw new Error(`Error en obtenerFechaFinalCosechaAps: ${error.message}`);
    }
};

const obtenerNombreFincaAps = async (idAnalisis) => {
    try {
        console.log("obtenerNombreFincaAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerNombreFincaAps - Resultado:", resultado);
        return resultado ? resultado.NOMBRE_FINCA : null;
    } catch (error) {
        console.error("Error en obtenerNombreFincaAps: ", error);
        throw new Error(`Error en obtenerNombreFincaAps: ${error.message}`);
    }
};

const obtenerCodigoFincaResponsableAps = async (idAnalisis) => {
    try {
        console.log("obtenerCodigoFincaResponsableAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerCodigoFincaResponsableAps - Resultado:", resultado);
        return resultado ? resultado.CODIGO_FINCA : null;
    } catch (error) {
        console.error("Error en obtenerCodigoFincaResponsableAps: ", error);
        throw new Error(`Error en obtenerCodigoFincaResponsableAps: ${error.message}`);
    }
};

const obtenerNombreOperadorAps = async (idAnalisis) => {
    try {
        console.log("obtenerNombreOperadorAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerNombreOperadorAps - Resultado:", resultado);
        return resultado ? resultado.NOMBRE_DE_OPERADOR : null;
    } catch (error) {
        console.error("Error en obtenerNombreOperadorAps: ", error);
        throw new Error(`Error en obtenerNombreOperadorAps: ${error.message}`);
    }
};

const obtenerCodigoEquipoAps = async (idAnalisis) => {
    try {
        console.log("obtenerCodigoEquipoAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerCodigoEquipoAps - Resultado:", resultado);
        return resultado ? resultado.CODIGO_DE_MAQUINA : null;
    } catch (error) {
        console.error("Error en obtenerCodigoEquipoAps: ", error);
        throw new Error(`Error en obtenerCodigoEquipoAps: ${error.message}`);
    }
};

const obtenerHoraInicioAps = async (idAnalisis) => {
    try {
        console.log("obtenerHoraInicioAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerHoraInicioAps - Resultado:", resultado);
        return resultado ? resultado.HORA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerHoraInicioAps: ", error);
        throw new Error(`Error en obtenerHoraInicioAps: ${error.message}`);
    }
};

const obtenerHoraFinalAps = async (idAnalisis) => {
    try {
        console.log("obtenerHoraFinalAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerHoraFinalAps - Resultado:", resultado);
        return resultado ? resultado.HORA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerHoraFinalAps: ", error);
        throw new Error(`Error en obtenerHoraFinalAps: ${error.message}`);
    }
};

const obtenerEficienciaAps = async (idAnalisis) => {
    try {
        console.log("obtenerEficienciaAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerEficienciaAps - Resultados:", resultados);

        const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA, 0);
        return eficienciaTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerEficienciaAps: ", error);
        throw new Error(`Error en obtenerEficienciaAps: ${error.message}`);
    }
};

const obtenerCodigoLoteAps = async (idAnalisis) => {
    try {
        console.log("obtenerCodigoLoteAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerCodigoLoteAps - Resultado:", resultado);
        return resultado ? resultado.CODIGO_LOTE : null;
    } catch (error) {
        console.error("Error en obtenerCodigoLoteAps: ", error);
        throw new Error(`Error en obtenerCodigoLoteAps: ${error.message}`);
    }
};

const obtenerDosisTeorica = async (idAnalisis) => {
    try {
        console.log("obtenerDosisTeorica - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerDosisTeorica - Resultado:", resultado);
        return resultado ? resultado.DOSIS_TEORICA : null;
    } catch (error) {
        console.error("Error en obtenerDosisTeorica: ", error);
        throw new Error(`Error en obtenerDosisTeorica: ${error.message}`);
    }
};

const obtenerHumedadDelCultivo = async (idAnalisis) => {
    try {
        console.log("obtenerHumedadDelCultivo - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerHumedadDelCultivo - Resultado:", resultado);
        return resultado ? resultado.HUMEDAD_DEL_CULTIVO : null;
    } catch (error) {
        console.error("Error en obtenerHumedadDelCultivo: ", error);
        throw new Error(`Error en obtenerHumedadDelCultivo: ${error.message}`);
    }
};

const obtenerTchEstimado = async (idAnalisis) => {
    try {
        console.log("obtenerTchEstimado - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerTchEstimado - Resultado:", resultado);
        return resultado ? resultado.TCH_ESTIMADO : null;
    } catch (error) {
        console.error("Error en obtenerTchEstimado: ", error);
        throw new Error(`Error en obtenerTchEstimado: ${error.message}`);
    }
};

const obtenerTiempoTotalAps = async (idAnalisis) => {
    try {
        console.log("obtenerTiempoTotalAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerTiempoTotalAps - Resultados:", resultados);

        const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL_H, 0);
        return tiempoTotal;
    } catch (error) {
        console.error("Error en obtenerTiempoTotalAps: ", error);
        throw new Error(`Error en obtenerTiempoTotalAps: ${error.message}`);
    }
};

// Funciones para obtener datos de Cosecha Mecánica
const obtenerNombreResponsableCm = async (idAnalisis) => {
    try {
        console.log("obtenerNombreResponsableCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerNombreResponsableCm - Resultado:", resultado);
        return resultado ? resultado.RESPONSABLE : null;
    } catch (error) {
        console.error("Error en obtenerNombreResponsableCm: ", error);
        throw new Error(`Error en obtenerNombreResponsableCm: ${error.message}`);
    }
};

const obtenerFechaInicioCosechaCm = async (idAnalisis) => {
    try {
        console.log("obtenerFechaInicioCosechaCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerFechaInicioCosechaCm - Resultado:", resultado);
        return resultado ? resultado.FECHA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerFechaInicioCosechaCm: ", error);
        throw new Error(`Error en obtenerFechaInicioCosechaCm: ${error.message}`);
    }
};

const obtenerFechaFinCosechaCm = async (idAnalisis) => {
    try {
        console.log("obtenerFechaFinCosechaCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerFechaFinCosechaCm - Resultado:", resultado);
        return resultado ? resultado.FECHA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerFechaFinCosechaCm: ", error);
        throw new Error(`Error en obtenerFechaFinCosechaCm: ${error.message}`);
    }
};

const obtenerNombreFincaCm = async (idAnalisis) => {
    try {
        console.log("obtenerNombreFincaCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerNombreFincaCm - Resultado:", resultado);
        return resultado ? resultado.NOMBRE_FINCA : null;
    } catch (error) {
        console.error("Error en obtenerNombreFincaCm: ", error);
        throw new Error(`Error en obtenerNombreFincaCm: ${error.message}`);
    }
};

const obtenerCodigoParcelasResponsableCm = async (idAnalisis) => {
    try {
        console.log("obtenerCodigoParcelasResponsableCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerCodigoParcelasResponsableCm - Resultado:", resultado);
        return resultado ? resultado.CODIGO_FINCA : null;
    } catch (error) {
        console.error("Error en obtenerCodigoParcelasResponsableCm: ", error);
        throw new Error(`Error en obtenerCodigoParcelasResponsableCm: ${error.message}`);
    }
};

const obtenerNombreOperadorCm = async (idAnalisis) => {
    try {
        console.log("obtenerNombreOperadorCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerNombreOperadorCm - Resultado:", resultado);
        return resultado ? resultado.OPERADOR : null;
    } catch (error) {
        console.error("Error en obtenerNombreOperadorCm: ", error);
        throw new Error(`Error en obtenerNombreOperadorCm: ${error.message}`);
    }
};

const obtenerNombreMaquinaCm = async (idAnalisis) => {
    try {
        console.log("obtenerNombreMaquinaCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerNombreMaquinaCm - Resultado:", resultado);
        return resultado ? resultado.CODIGO_DE_MAQUINA : null;
    } catch (error) {
        console.error("Error en obtenerNombreMaquinaCm: ", error);
        throw new Error(`Error en obtenerNombreMaquinaCm: ${error.message}`);
    }
};

const obtenerConsumoCombustibleCm = async (idAnalisis) => {
    try {
        console.log("obtenerConsumoCombustibleCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerConsumoCombustibleCm - Resultados:", resultados);

        const consumoTotal = resultados.reduce((acc, resultado) => acc + resultado.CONSUMOS_DE_COMBUSTIBLE, 0);
        return consumoTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerConsumoCombustibleCm: ", error);
        throw new Error(`Error en obtenerConsumoCombustibleCm: ${error.message}`);
    }
};

const obtenerPresionCortadorBase = async (idAnalisis) => {
    try {
        console.log("obtenerPresionCortadorBase - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerPresionCortadorBase - Resultado:", resultado);
        return resultado ? resultado.PRESION_DE_CORTADOR_BASE : null;
    } catch (error) {
        console.error("Error en obtenerPresionCortadorBase: ", error);
        throw new Error(`Error en obtenerPresionCortadorBase: ${error.message}`);
    }
};

const obtenerRpmCm = async (idAnalisis) => {
    try {
        console.log("obtenerRpmCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerRpmCm - Resultados:", resultados);

        const rpmTotal = resultados.reduce((acc, resultado) => acc + resultado.RPM, 0);
        return rpmTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerRpmCm: ", error);
        throw new Error(`Error en obtenerRpmCm: ${error.message}`);
    }
};

const obtenerTch = async (idAnalisis) => {
    try {
        console.log("obtenerTch - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerTch - Resultados:", resultados);

        const tchTotal = resultados.reduce((acc, resultado) => acc + resultado.TCH, 0);
        return tchTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerTch: ", error);
        throw new Error(`Error en obtenerTch: ${error.message}`);
    }
};

const obtenerTah = async (idAnalisis) => {
    try {
        console.log("obtenerTah - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerTah - Resultados:", resultados);

        const tahTotal = resultados.reduce((acc, resultado) => acc + resultado.TAH, 0);
        return tahTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerTah: ", error);
        throw new Error(`Error en obtenerTah: ${error.message}`);
    }
};

const obtenerCalidadGpsCm = async (idAnalisis) => {
    try {
        console.log("obtenerCalidadGpsCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerCalidadGpsCm - Resultados:", resultados);

        const calidadTotal = resultados.reduce((acc, resultado) => acc + resultado.CALIDAD_DE_SENAL, 0);
        return calidadTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerCalidadGpsCm: ", error);
        throw new Error(`Error en obtenerCalidadGpsCm: ${error.message}`);
    }
};

const obtenerActividadCm = async (idAnalisis) => {
    try {
        console.log("obtenerActividadCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerActividadCm - Resultado:", resultado);
        return resultado ? resultado.ACTIVIDAD : null;
    } catch (error) {
        console.error("Error en obtenerActividadCm: ", error);
        throw new Error(`Error en obtenerActividadCm: ${error.message}`);
    }
};

const obtenerAreaNetaCm = async (idAnalisis) => {
    try {
        console.log("obtenerAreaNetaCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerAreaNetaCm - Resultado:", resultado);
        return resultado ? resultado.AREA_NETA_Ha : null;
    } catch (error) {
        console.error("Error en obtenerAreaNetaCm: ", error);
        throw new Error(`Error en obtenerAreaNetaCm: ${error.message}`);
    }
};

const obtenerAreaBrutaCm = async (idAnalisis) => {
    try {
        console.log("obtenerAreaBrutaCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerAreaBrutaCm - Resultado:", resultado);
        return resultado ? resultado.AREA_BRUTA_Ha : null;
    } catch (error) {
        console.error("Error en obtenerAreaBrutaCm: ", error);
        throw new Error(`Error en obtenerAreaBrutaCm: ${error.message}`);
    }
};

const obtenerDiferenciaDeAreaCm = async (idAnalisis) => {
    try {
        console.log("obtenerDiferenciaDeAreaCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerDiferenciaDeAreaCm - Resultado:", resultado);
        return resultado ? resultado.DIFERENCIA_DE_AREA_Ha : null;
    } catch (error) {
        console.error("Error en obtenerDiferenciaDeAreaCm: ", error);
        throw new Error(`Error en obtenerDiferenciaDeAreaCm: ${error.message}`);
    }
};

const obtenerHoraInicioCm = async (idAnalisis) => {
    try {
        console.log("obtenerHoraInicioCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerHoraInicioCm - Resultado:", resultado);
        return resultado ? resultado.HORA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerHoraInicioCm: ", error);
        throw new Error(`Error en obtenerHoraInicioCm: ${error.message}`);
    }
};

const obtenerHoraFinalCm = async (idAnalisis) => {
    try {
        console.log("obtenerHoraFinalCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerHoraFinalCm - Resultado:", resultado);
        return resultado ? resultado.HORA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerHoraFinalCm: ", error);
        throw new Error(`Error en obtenerHoraFinalCm: ${error.message}`);
    }
};

const obtenerTiempoTotalActividadCm = async (idAnalisis) => {
    try {
        console.log("obtenerTiempoTotalActividadCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerTiempoTotalActividadCm - Resultados:", resultados);

        const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL, 0);
        return tiempoTotal;
    } catch (error) {
        console.error("Error en obtenerTiempoTotalActividadCm: ", error);
        throw new Error(`Error en obtenerTiempoTotalActividadCm: ${error.message}`);
    }
};

const obtenerEficienciaCm = async (idAnalisis) => {
    try {
        console.log("obtenerEficienciaCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerEficienciaCm - Resultados:", resultados);

        const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA_Hora_Ha, 0);
        return eficienciaTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerEficienciaCm: ", error);
        throw new Error(`Error en obtenerEficienciaCm: ${error.message}`);
    }
};

const obtenerPromedioVelocidadCm = async (idAnalisis) => {
    try {
        console.log("obtenerPromedioVelocidadCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerPromedioVelocidadCm - Resultados:", resultados);

        const velocidadTotal = resultados.reduce((acc, resultado) => acc + resultado.VELOCIDAD_Km_H, 0);
        return velocidadTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerPromedioVelocidadCm: ", error);
        throw new Error(`Error en obtenerPromedioVelocidadCm: ${error.message}`);
    }
};

const obtenerPorcentajeAreaPilotoCm = async (idAnalisis) => {
    try {
        console.log("obtenerPorcentajeAreaPilotoCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerPorcentajeAreaPilotoCm - Resultado:", resultado);
        return resultado ? resultado.PILOTO_AUTOMATICO : null;
    } catch (error) {
        console.error("Error en obtenerPorcentajeAreaPilotoCm: ", error);
        throw new Error(`Error en obtenerPorcentajeAreaPilotoCm: ${error.message}`);
    }
};

const obtenerPorcentajeAreaAutotrackerCm = async (idAnalisis) => {
    try {
        console.log("obtenerPorcentajeAreaAutotrackerCm - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('cosecha_mecanica');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerPorcentajeAreaAutotrackerCm - Resultado:", resultado);
        return resultado ? resultado.AUTO_TRACKET : null;
    } catch (error) {
        console.error("Error en obtenerPorcentajeAreaAutotrackerCm: ", error);
        throw new Error(`Error en obtenerPorcentajeAreaAutotrackerCm: ${error.message}`);
    }
};

// Funciones para obtener datos de Fertilización
const obtenerResponsableFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerResponsableFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerResponsableFertilizacion - Resultado:", resultado);
        return resultado ? resultado.RESPONSABLE : null;
    } catch (error) {
        console.error("Error en obtenerResponsableFertilizacion: ", error);
        throw new Error(`Error en obtenerResponsableFertilizacion: ${error.message}`);
    }
};

const obtenerFechaInicioFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerFechaInicioFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerFechaInicioFertilizacion - Resultado:", resultado);
        return resultado ? resultado.FECHA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerFechaInicioFertilizacion: ", error);
        throw new Error(`Error en obtenerFechaInicioFertilizacion: ${error.message}`);
    }
};

const obtenerFechaFinalFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerFechaFinalFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerFechaFinalFertilizacion - Resultado:", resultado);
        return resultado ? resultado.FECHA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerFechaFinalFertilizacion: ", error);
        throw new Error(`Error en obtenerFechaFinalFertilizacion: ${error.message}`);
    }
};

const obtenerNombreFincaFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerNombreFincaFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerNombreFincaFertilizacion - Resultado:", resultado);
        return resultado ? resultado.NOMBRE_FINCA : null;
    } catch (error) {
        console.error("Error en obtenerNombreFincaFertilizacion: ", error);
        throw new Error(`Error en obtenerNombreFincaFertilizacion: ${error.message}`);
    }
};

const obtenerOperadorFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerOperadorFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerOperadorFertilizacion - Resultado:", resultado);
        return resultado ? resultado.OPERADOR : null;
    } catch (error) {
        console.error("Error en obtenerOperadorFertilizacion: ", error);
        throw new Error(`Error en obtenerOperadorFertilizacion: ${error.message}`);
    }
};

const obtenerEquipoFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerEquipoFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerEquipoFertilizacion - Resultado:", resultado);
        return resultado ? resultado.EQUIPO : null;
    } catch (error) {
        console.error("Error en obtenerEquipoFertilizacion: ", error);
        throw new Error(`Error en obtenerEquipoFertilizacion: ${error.message}`);
    }
};

const obtenerActividadFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerActividadFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerActividadFertilizacion - Resultado:", resultado);
        return resultado ? resultado.ACTIVIDAD : null;
    } catch (error) {
        console.error("Error en obtenerActividadFertilizacion: ", error);
        throw new Error(`Error en obtenerActividadFertilizacion: ${error.message}`);
    }
};

const obtenerAreaNetaFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerAreaNetaFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerAreaNetaFertilizacion - Resultado:", resultado);
        return resultado ? resultado.AREA_NETA : null;
    } catch (error) {
        console.error("Error en obtenerAreaNetaFertilizacion: ", error);
        throw new Error(`Error en obtenerAreaNetaFertilizacion: ${error.message}`);
    }
};

const obtenerAreaBrutaFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerAreaBrutaFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerAreaBrutaFertilizacion - Resultado:", resultado);
        return resultado ? resultado.AREA_BRUTA : null;
    } catch (error) {
        console.error("Error en obtenerAreaBrutaFertilizacion: ", error);
        throw new Error(`Error en obtenerAreaBrutaFertilizacion: ${error.message}`);
    }
};

const obtenerDiferenciaAreaFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerDiferenciaAreaFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerDiferenciaAreaFertilizacion - Resultado:", resultado);
        return resultado ? resultado.DIFERENCIA_DE_AREA_Ha : null;
    } catch (error) {
        console.error("Error en obtenerDiferenciaAreaFertilizacion: ", error);
        throw new Error(`Error en obtenerDiferenciaAreaFertilizacion: ${error.message}`);
    }
};

const obtenerHoraInicioFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerHoraInicioFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerHoraInicioFertilizacion - Resultado:", resultado);
        return resultado ? resultado.HORA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerHoraInicioFertilizacion: ", error);
        throw new Error(`Error en obtenerHoraInicioFertilizacion: ${error.message}`);
    }
};

const obtenerHoraFinalFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerHoraFinalFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerHoraFinalFertilizacion - Resultado:", resultado);
        return resultado ? resultado.HORA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerHoraFinalFertilizacion: ", error);
        throw new Error(`Error en obtenerHoraFinalFertilizacion: ${error.message}`);
    }
};

const obtenerTiempoTotalFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerTiempoTotalFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerTiempoTotalFertilizacion - Resultados:", resultados);

        const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL_H, 0);
        return tiempoTotal;
    } catch (error) {
        console.error("Error en obtenerTiempoTotalFertilizacion: ", error);
        throw new Error(`Error en obtenerTiempoTotalFertilizacion: ${error.message}`);
    }
};

const obtenerEficienciaFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerEficienciaFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerEficienciaFertilizacion - Resultados:", resultados);

        const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA_Hora_Ha, 0);
        return eficienciaTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerEficienciaFertilizacion: ", error);
        throw new Error(`Error en obtenerEficienciaFertilizacion: ${error.message}`);
    }
};

const obtenerPromedioDosisRealFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerPromedioDosisRealFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerPromedioDosisRealFertilizacion - Resultados:", resultados);

        const dosisTotal = resultados.reduce((acc, resultado) => acc + resultado.DOSIS_REAL_Kg_ha, 0);
        return dosisTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerPromedioDosisRealFertilizacion: ", error);
        throw new Error(`Error en obtenerPromedioDosisRealFertilizacion: ${error.message}`);
    }
};

const obtenerDosisTeoricaFertilizacion = async (idAnalisis) => {
    try {
        console.log("obtenerDosisTeoricaFertilizacion - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('fertilización');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerDosisTeoricaFertilizacion - Resultado:", resultado);
        return resultado ? resultado.DOSIS_TEORICA_Kg_ha : null;
    } catch (error) {
        console.error("Error en obtenerDosisTeoricaFertilizacion: ", error);
        throw new Error(`Error en obtenerDosisTeoricaFertilizacion: ${error.message}`);
    }
};

// Funciones para obtener datos de Herbicidas
const obtenerResponsableHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerResponsableHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerResponsableHerbicidas - Resultado:", resultado);
        return resultado ? resultado.RESPONSABLE : null;
    } catch (error) {
        console.error("Error en obtenerResponsableHerbicidas: ", error);
        throw new Error(`Error en obtenerResponsableHerbicidas: ${error.message}`);
    }
};

const obtenerFechaHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerFechaHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerFechaHerbicidas - Resultado:", resultado);
        return resultado ? resultado.FECHA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerFechaHerbicidas: ", error);
        throw new Error(`Error en obtenerFechaHerbicidas: ${error.message}`);
    }
};

const obtenerNombreFincaHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerNombreFincaHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerNombreFincaHerbicidas - Resultado:", resultado);
        return resultado ? resultado.NOMBRE_FINCA : null;
    } catch (error) {
        console.error("Error en obtenerNombreFincaHerbicidas: ", error);
        throw new Error(`Error en obtenerNombreFincaHerbicidas: ${error.message}`);
    }
};

const obtenerParcelaHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerParcelaHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerParcelaHerbicidas - Resultado:", resultado);
        return resultado ? resultado.PARCELA : null;
    } catch (error) {
        console.error("Error en obtenerParcelaHerbicidas: ", error);
        throw new Error(`Error en obtenerParcelaHerbicidas: ${error.message}`);
    }
};

const obtenerOperadorHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerOperadorHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerOperadorHerbicidas - Resultado:", resultado);
        return resultado ? resultado.OPERADOR : null;
    } catch (error) {
        console.error("Error en obtenerOperadorHerbicidas: ", error);
        throw new Error(`Error en obtenerOperadorHerbicidas: ${error.message}`);
    }
};

const obtenerEquipoHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerEquipoHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerEquipoHerbicidas - Resultado:", resultado);
        return resultado ? resultado.EQUIPO : null;
    } catch (error) {
        console.error("Error en obtenerEquipoHerbicidas: ", error);
        throw new Error(`Error en obtenerEquipoHerbicidas: ${error.message}`);
    }
};

const obtenerActividadHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerActividadHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerActividadHerbicidas - Resultado:", resultado);
        return resultado ? resultado.ACTIVIDAD : null;
    } catch (error) {
        console.error("Error en obtenerActividadHerbicidas: ", error);
        throw new Error(`Error en obtenerActividadHerbicidas: ${error.message}`);
    }
};

const obtenerAreaNetaHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerAreaNetaHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerAreaNetaHerbicidas - Resultado:", resultado);
        return resultado ? resultado.AREA_NETA : null;
    } catch (error) {
        console.error("Error en obtenerAreaNetaHerbicidas: ", error);
        throw new Error(`Error en obtenerAreaNetaHerbicidas: ${error.message}`);
    }
};

const obtenerAreaBrutaHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerAreaBrutaHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerAreaBrutaHerbicidas - Resultado:", resultado);
        return resultado ? resultado.AREA_BRUTA : null;
    } catch (error) {
        console.error("Error en obtenerAreaBrutaHerbicidas: ", error);
        throw new Error(`Error en obtenerAreaBrutaHerbicidas: ${error.message}`);
    }
};

const obtenerDiferenciaDeAreaHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerDiferenciaDeAreaHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerDiferenciaDeAreaHerbicidas - Resultado:", resultado);
        return resultado ? resultado.DIFERENCIA_DE_AREA_Ha : null;
    } catch (error) {
        console.error("Error en obtenerDiferenciaDeAreaHerbicidas: ", error);
        throw new Error(`Error en obtenerDiferenciaDeAreaHerbicidas: ${error.message}`);
    }
};

const obtenerHoraInicioHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerHoraInicioHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerHoraInicioHerbicidas - Resultado:", resultado);
        return resultado ? resultado.HORA_INICIO : null;
    } catch (error) {
        console.error("Error en obtenerHoraInicioHerbicidas: ", error);
        throw new Error(`Error en obtenerHoraInicioHerbicidas: ${error.message}`);
    }
};

const obtenerHoraFinalHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerHoraFinalHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerHoraFinalHerbicidas - Resultado:", resultado);
        return resultado ? resultado.HORA_FINAL : null;
    } catch (error) {
        console.error("Error en obtenerHoraFinalHerbicidas: ", error);
        throw new Error(`Error en obtenerHoraFinalHerbicidas: ${error.message}`);
    }
};

const obtenerTiempoTotalHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerTiempoTotalHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerTiempoTotalHerbicidas - Resultados:", resultados);

        const tiempoTotal = resultados.reduce((acc, resultado) => acc + resultado.TIEMPO_TOTAL_H, 0);
        return tiempoTotal;
    } catch (error) {
        console.error("Error en obtenerTiempoTotalHerbicidas: ", error);
        throw new Error(`Error en obtenerTiempoTotalHerbicidas: ${error.message}`);
    }
};

const obtenerEficienciaHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerEficienciaHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerEficienciaHerbicidas - Resultados:", resultados);

        const eficienciaTotal = resultados.reduce((acc, resultado) => acc + resultado.EFICIENCIA_Hora_Ha, 0);
        return eficienciaTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerEficienciaHerbicidas: ", error);
        throw new Error(`Error en obtenerEficienciaHerbicidas: ${error.message}`);
    }
};

const obtenerPromedioVelocidadHerbicidas = async (idAnalisis) => {
    try {
        console.log("obtenerPromedioVelocidadHerbicidas - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('herbicidas');
        const resultados = await collection.find({ ID_ANALISIS: idAnalisis }).toArray();
        console.log("obtenerPromedioVelocidadHerbicidas - Resultados:", resultados);

        const velocidadTotal = resultados.reduce((acc, resultado) => acc + resultado.VELOCIDAD_Km_H, 0);
        return velocidadTotal / resultados.length;
    } catch (error) {
        console.error("Error en obtenerPromedioVelocidadHerbicidas: ", error);
        throw new Error(`Error en obtenerPromedioVelocidadHerbicidas: ${error.message}`);
    }
};

const obtenerProductosAps = async (idAnalisis) => {
    try {
        console.log("obtenerProductosAps - ID_ANALISIS:", idAnalisis);
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('aplicaciones_aereas');
        const resultado = await collection.findOne({ ID_ANALISIS: idAnalisis });
        console.log("obtenerProductosAps - Resultado:", resultado);
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
        const db = client.db('geomoticaapp');
        const collection = db.collection('ultimos_valores');
        const resultado = await collection.insertOne(datos);
        console.log("almacenarUltimosValores - Resultado:", resultado);
        return resultado.insertedId;
    } catch (error) {
        console.error("Error en almacenarUltimosValores: ", error);
        throw new Error(`Error en almacenarUltimosValores: ${error.message}`);
    }
};

const almacenarUltimosValoresAps = async (datos) => {
    try {
        const client = await connectDB();
        const db = client.db('geomoticaapp');
        const collection = db.collection('ultimos_valores_aps');
        const resultado = await collection.insertOne(datos);
        console.log("almacenarUltimosValoresAps - Resultado:", resultado);
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