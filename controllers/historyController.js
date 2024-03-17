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

    try {
        console.log("Buscando archivo: ", archivoNombre);
        const archivo = bucket.file(archivoNombre);
        const existeArchivo = await archivo.exists();

        if (!existeArchivo[0]) {
            console.log("El archivo no existe, generando...");
            const comandoPython = `python3 /geomotica/procesos/generar_raster.py ${id} ${nombreAnalisis}`;

            exec(comandoPython, async (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    return res.status(500).json({ mensaje: 'Error al ejecutar el script de Python' });
                }
                if (stderr) {
                    console.error(`Stderr: ${stderr}`);
                    return res.status(500).json({ mensaje: 'Error en el script de Python' });
                }

                console.log("Script de Python ejecutado exitosamente.");

                setTimeout(async () => {
                    const existeArchivoGenerado = await archivo.exists();
                    if (!existeArchivoGenerado[0]) {
                        return res.status(404).json({ mensaje: 'Archivo no encontrado después de generación' });
                    }

                    console.log("Enviando archivo generado...");
                    res.setHeader('Content-Type', 'image/tiff');
                    return archivo.createReadStream().pipe(res);
                }, 5000);
            });
        } else {
            console.log("Enviando archivo existente...");
            res.setHeader('Content-Type', 'image/tiff');
            return archivo.createReadStream().pipe(res);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al obtener el archivo' });
    }
};
module.exports = {
    analisis, obtenerArchivoTIFF
}