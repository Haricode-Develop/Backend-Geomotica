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
    const archivoNombre = `${nombreAnalisis}_${id}.tif`;
    const archivo = bucket.file(archivoNombre);

    try {
        const [existeArchivo] = await archivo.exists();
        if (!existeArchivo) {
            console.log("El archivo no existe, generando...");
            // Ejecuta el script Python para generar el archivo TIFF
            const comandoPython = `python3 /geomotica/procesos/generar_raster.py ${id} ${nombreAnalisis}`;

            // Aumenta el tamaño de maxBuffer
            const options = { maxBuffer: 1024 * 1024 * 5 }; // 5 MB

            exec(comandoPython, options, async (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    return res.status(500).json({ mensaje: 'Error al ejecutar el script de Python' });
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                    return res.status(500).json({ mensaje: 'Error en el script de Python' });
                }
                console.log("Script de Python ejecutado exitosamente.");

                // Verifica de nuevo si el archivo existe después de la generación
                const [existeArchivoGenerado] = await archivo.exists();
                if (!existeArchivoGenerado) {
                    return res.status(404).json({ mensaje: 'Archivo no encontrado después de generación' });
                }

                // Genera y envía la URL del archivo
                const [url] = await archivo.getSignedUrl({
                    action: 'read',
                    expires: Date.now() + 3600 * 1000, // URL válida por 1 hora
                });
                console.log("Enviando URL del archivo generado...");
                return res.json({ url });
            });
        } else {
            // Genera y envía la URL del archivo existente
            const [url] = await archivo.getSignedUrl({
                action: 'read',
                expires: Date.now() + 3600 * 1000, // URL válida por 1 hora
            });
            console.log("Enviando URL del archivo existente...");
            return res.json({ url });
        }
    } catch (error) {
        console.error(`Error al procesar la solicitud: ${error}`);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};
module.exports = {
    analisis, obtenerArchivoTIFF
}