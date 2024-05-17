const HistoryModel = require('../models/HistoryModel');
const path = require("path");
const { Storage } = require('@google-cloud/storage'); // Importa correctamente Storage

const keyFilename = path.join(__dirname, '..', 'analog-figure-382403-c95d79364b3d.json');
const storage = new Storage({ keyFilename: keyFilename });
const { promisify } = require('util');

const bucketName = 'geomotica_mapeo';
const bucket = storage.bucket(bucketName);
const exec = promisify(require('child_process').exec);

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

const obtenerUltimosValores = async (req, res)  => {
    const { idAnalisis } = req.query;
    try{
        const ultimosValores = await HistoryModel.obtenerUltimosValores(idAnalisis);
        return res.json({ultimosValores});
    } catch(error){
        return res
            .status(500)
            .json({message: "Error al obtener los ultimos valores"})
    }
}


const obtenerArchivoGeoJsonAplicacionesAreas = async(req, res) => {
    const nombeAnalisis = req.params.nombreAnalisis;
    const id = req.params.id;
    const archivoNombre = `geojson/${nombreAnalisis}_${id}.geojson`;
}

const obtenerArchivoTIFF = async (req, res) => {
    const nombreAnalisis = req.params.nombreAnalisis;
    const id = req.params.id;
    const archivoNombre = `raster/${nombreAnalisis}_${id}.tif`;
    const analisisNombre = `analisis/${id}.json`;
    const archivo = bucket.file(archivoNombre);
    const archivoAnalisis = bucket.file(analisisNombre);
    const nombreTabla = "cosecha_mecanica";
    console.log("ESTOS SON LOS PARAMETROS: ");
    console.log("NOMBRE DEL ARCHIVO: ", archivoNombre);

    try {
        const [existeArchivo] = await archivo.exists();
        const [existeArchivoAnalisis] = await archivoAnalisis.exists();

        if (!existeArchivo) {
            console.log("El archivo no existe, generando...");

            // Ejecuta el script Python para generar el archivo TIFF
            const comandoPython = `python3 /geomotica/procesos/generar_raster.py ${id} ${nombreTabla}`;
            console.log("EJECUCIÓN DEL COMANDO PYTHON: ", comandoPython);
            const options = { maxBuffer: 1024 * 1024 * 100 }; // 50 MB

            try {
                try {
                    const { stdout, stderr } = await exec(comandoPython, options);
                    console.log("Script de Python ejecutado exitosamente:", stdout);
                    if (stderr) {
                        console.error("Stderr:", stderr);
                    }
                } catch (error) {
                    console.error(`Error al ejecutar el script de Python: ${error}`);
                    console.error(`Salida de error (stderr): ${error.stderr}`);
                    return res.status(500).json({
                        mensaje: 'Error en el script de Python',
                        detalle: error.stderr
                    });
                }

                let archivoGenerado = false;
                const maxIntentos = 10;
                let intentos = 0;

                while (!archivoGenerado && intentos < maxIntentos) {
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    const [existe] = await archivo.exists();
                    if (existe) {
                        archivoGenerado = true;
                        break;
                    }
                    intentos++;
                }

                if (!archivoGenerado) {
                    return res.status(404).json({ mensaje: 'Archivo no encontrado después de generación' });
                }

            } catch (error) {
                console.error(`Error al ejecutar el script de Python: ${error.message}`);
                return res.status(500).json({ mensaje: 'Error al ejecutar el script de Python' });
            }
        }
        if(!existeArchivoAnalisis){
            console.log("El archivo del análisis no existe===================");
        }
        // Genera y envía la URL del archivo
        const [url] = await archivo.getSignedUrl({
            action: 'read',
            expires: Date.now() + 3600 * 1000, // URL válida por 1 hora
        });
        const [urlAnalisis] = await archivoAnalisis.getSignedUrl({
            action: 'read',
            expires: Date.now() + 3600 * 1000, // URL válida por 1 hora
        });

        const [metadata] = await archivo.getMetadata();

        const customMetadata = metadata.metadata;
        const { min_x, min_y, max_x, max_y } = customMetadata;
        const bounds = [[parseFloat(min_y), parseFloat(min_x)], [parseFloat(max_y), parseFloat(max_x)]];

        console.log("ESTA ES LA URL GENERADA:", url);
        console.log("Enviando URL del archivo y metadatos...");
        return res.json({ url, bounds, urlAnalisis });
    } catch (error) {
        console.error(`Error al procesar la solicitud: ${error}`);
        return res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};
module.exports = {
    analisis, obtenerArchivoTIFF, obtenerUltimosValores
}