const connectDB = require('../config/database');

// Función genérica para obtener un solo campo de un documento
const obtenerCampoUnico = async (collectionName, idAnalisis, campo) => {
    try {
        const db = await connectDB(); // Reutiliza la conexión global
        const collection = db.collection(collectionName);
        const resultado = await collection.findOne(
            { ID_ANALISIS: idAnalisis },
            { projection: { [campo]: 1 } } // Proyección para optimizar la consulta
        );

        return resultado ? resultado[campo] : null;
    } catch (error) {
        console.error(
            `Error en obtenerCampoUnico de la colección ${collectionName}, campo ${campo}:`,
            error
        );
        throw new Error(`Error en obtenerCampoUnico (${campo}): ${error.message}`);
    }
};

// Función genérica para obtener el promedio de un campo
const obtenerPromedio = async (collectionName, idAnalisis, campo) => {
    try {
        const db = await connectDB(); // Reutiliza la conexión global
        const collection = db.collection(collectionName);

        const [resultado] = await collection
            .aggregate([
                { $match: { ID_ANALISIS: idAnalisis } },
                { $group: { _id: null, promedio: { $avg: `$${campo}` } } },
            ])
            .toArray();

        return resultado ? resultado.promedio : null;
    } catch (error) {
        console.error(
            `Error en obtenerPromedio de la colección ${collectionName}, campo ${campo}:`,
            error
        );
        throw new Error(`Error en obtenerPromedio (${campo}): ${error.message}`);
    }
};

// Función para obtener el tiempo total de actividad
const obtenerTiempoTotal = async (collectionName, idAnalisis) => {
    try {
        const db = await connectDB(); // Reutiliza la conexión global
        const collection = db.collection(collectionName);

        const [resultado] = await collection
            .aggregate([
                { $match: { ID_ANALISIS: idAnalisis } },
                { $group: { _id: null, total: { $sum: '$TIEMPO_TOTAL' } } },
            ])
            .toArray();

        return resultado ? resultado.total : null;
    } catch (error) {
        console.error(
            `Error en obtenerTiempoTotal de la colección ${collectionName}:`,
            error
        );
        throw new Error(`Error en obtenerTiempoTotal: ${error.message}`);
    }
};

module.exports = {
    obtenerCampoUnico,
    obtenerPromedio,
    obtenerTiempoTotal,
};
