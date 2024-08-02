const connectDB = require('../config/database');

// Función para obtener el último análisis realizado por un usuario de un tipo específico
const obtenerUltimoAnalisisQuery = async (tipoAnalisis, idUsuario) => {
    try {
        const db = await connectDB();
        const collection = db.collection('analisis');

        // Asegúrate de que idUsuario es un número
        const usuarioId = parseInt(idUsuario, 10);

        const resultado = await collection.findOne(
            { TIPO_ANALISIS: tipoAnalisis, ID_USUARIO: usuarioId },
            { sort: { _id: -1 } }
        );

        return resultado;
    } catch (error) {
        console.error("Error al obtener el último análisis: ", error);
        throw new Error(`Error al obtener el último análisis: ${error.message}`);
    }
};

// Función para insertar un nuevo análisis
const insertarAnalisis = async (tipoAnalisis, idUsuario) => {
    try {
        const db = await connectDB();
        const collection = db.collection('analisis');

        // Asegúrate de que idUsuario es un número
        const usuarioId = parseInt(idUsuario, 10);

        const resultado = await collection.insertOne({
            TIPO_ANALISIS: tipoAnalisis,
            ID_USUARIO: usuarioId,
            FECHA_CREACION: new Date()
        });

        return resultado.insertedId;
    } catch (error) {
        console.error("Error al insertar análisis: ", error);
        throw new Error(`Error al insertar análisis: ${error.message}`);
    }
};

module.exports = {
    obtenerUltimoAnalisisQuery,
    insertarAnalisis
};
