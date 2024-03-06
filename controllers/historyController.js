const HistoryModel = require('../models/HistoryModel');
const path = require("path");

const keyFilename = path.join(__dirname, '..', 'analog-figure-382403-e34ca94833aa.json');
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

const generateV4ReadSignedUrl = async (bucketName, fileName) => {
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 1 * 60 * 60 * 1000,
    };

    const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);
    console.log(`La URL firmada para ${fileName} es ${url}`);
    return url;
};

module.exports = {
    analisis
}