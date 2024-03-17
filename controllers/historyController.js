const HistoryModel = require('../models/HistoryModel');
const path = require("path");
const { Storage } = require('@google-cloud/storage'); // Importa correctamente Storage

const keyFilename = path.join(__dirname, '..', 'analog-figure-382403-c95d79364b3d.json');
const storage = new Storage({ keyFilename: keyFilename });

const bucketName = 'geomotica_mapeo';
const bucket = storage.bucket(bucketName);
const {exec} = require('child_process');

const analisis = async(req, res) => {
    const idUsuario = req.query.idUsuario;
    try {
        const idsAnalisisUsuario = await HistoryModel.obtenerAnalisisUsuarios(idUsuario);
        return res.json({ idsAnalisis: idsAnalisisUsuario });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Error al obtener los análisis" });
    }
}

const obtenerArchivoTIFF = async (req, res) => {
    const nombreAnalisis = req.params.nombreAnalisis;
    const id = req.params.id;
    const archivoNombre = `raster/${nombreAnalisis}_${id}.tif`;
    const archivo = storage.bucket(bucketName).file(archivoNombre);

    console.log("ESTOS SON LOS PARAMETROS: ");
    console.log("NOMBRE DEL ARCHIVO: ", archivoNombre);

    try {
        const [existeArchivo] = await archivo.exists();
        if (!existeArchivo) {
            console.log("El archivo no existe, generando...");

            const [archivoGenerado] = await archivo.exists();
            if (!archivoGenerado) {
                return res.status(404).json({ mensaje: 'Archivo no encontrado después de generación' });
            }
        }

        // Obtiene la URL firmada del archivo
        const [url] = await archivo.getSignedUrl({
            action: 'read',
            expires: Date.now() + 3600 * 1000 // URL válida por 1 hora
        });

        // Obtiene los metadatos del archivo
        const [metadata] = await archivo.getMetadata();

        // Extrae los metadatos personalizados del objeto y los incluye en la respuesta
        const customMetadata = metadata.metadata;
        const { min_x, min_y, max_x, max_y } = customMetadata;
        const bounds = [[parseFloat(min_y), parseFloat(min_x)], [parseFloat(max_y), parseFloat(max_x)]];

        console.log("ESTA ES LA URL GENERADA:", url);
        console.log("Enviando URL del archivo y metadatos...");
        // Envía la URL y los metadatos del archivo en la respuesta
        return res.json({ url, bounds });
    } catch (error) {
        console.error(`Error al procesar la solicitud: ${error}`);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};
module.exports = {
    analisis, obtenerArchivoTIFF
}