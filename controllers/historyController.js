const HistoryModel = require('../models/HistoryModel');
const path = require("path");
const { Storage } = require('@google-cloud/storage'); // Importa correctamente Storage

const keyFilename = path.join(__dirname, '..', 'analog-figure-382403-c95d79364b3d.json');
const storage = new Storage({ keyFilename: keyFilename });

const bucketName = 'geomotica_mapeo';
const bucket = storage.bucket(bucketName);

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

const obtenerArchivoGeoJSON = async (req, res) => {
    const nombreAnalisis = req.params.nombreAnalisis;
    const id = req.params.id;
    const archivoNombre = `interpolacion_${nombreAnalisis}_${id}`;

    try {
        console.log("ARCHIVO: ", `interpolaciones/${archivoNombre}.geojson`);
        const archivo = bucket.file(`interpolaciones/${archivoNombre}.geojson`);
        const existeArchivo = await archivo.exists();

        if (!existeArchivo[0]) {
            return res.status(404).json({ mensaje: 'Archivo no encontrado' });
        }

        // Descargar el archivo y enviarlo en la respuesta
        const stream = archivo.createReadStream();
        let buf = '';
        stream.on('data', function(d) {
            buf += d;
        }).on('end', function() {
            return res.json(JSON.parse(buf));
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensaje: 'Error al obtener el archivo' });
    }
};

module.exports = {
    analisis, obtenerArchivoGeoJSON
}