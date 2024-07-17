const { Storage } = require('@google-cloud/storage');
const path = require("path");
const fs = require('fs');
const keyFilename = path.join(__dirname, '..', 'analog-figure-382403-d8d65817b5d3.json');
const storage = new Storage({ keyFilename: keyFilename });
const bucketName = 'geomotica_mapeo';
const bucket = storage.bucket(bucketName);

const subirLotesIniciales = async (req, res) => {
    try {
        console.log('Inicio del método subirLotesIniciales');

        const userId = req.body.userId;
        const geojson = req.body.geojson;

        console.log('userId:', userId);
        console.log('geojson:', geojson);

        if (!userId || !geojson) {
            console.log('Validación fallida: faltan userId o geojson');
            return res.status(400).json({ error: 'El id del usuario y el archivo geojson son obligatorios' });
        }

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const filename = `lotes_iniciales_${today.getTime()}.geojson`;

        console.log('Fecha actual:', { year, month, day });
        console.log('Nombre del archivo:', filename);

        const destinationBlobName = `lotes_iniciales/${userId}/${year}/${month}/${day}/${filename}`;
        console.log('Nombre del blob de destino:', destinationBlobName);

        const blob = bucket.file(destinationBlobName);
        const blobStream = blob.createWriteStream({
            resumable: false,
        });

        console.log('Creación del stream del blob');

        blobStream.on('error', (err) => {
            console.error('Error al subir el archivo:', err);
            res.status(500).json({ error: `Error uploading file: ${err.message}` });
        });

        blobStream.on('finish', () => {
            console.log('Archivo subido exitosamente');

            // Limpiar la carpeta de uploads
            const uploadsPath = path.join(__dirname, '..', 'uploads');
            fs.readdir(uploadsPath, (err, files) => {
                if (err) throw err;
                for (const file of files) {
                    fs.unlink(path.join(uploadsPath, file), err => {
                        if (err) throw err;
                    });
                }
            });

            res.status(200).json({ message: `File uploaded to ${destinationBlobName}` });
        });

        console.log('Escribiendo datos en el stream del blob');
        blobStream.end(Buffer.from(JSON.stringify(geojson), 'utf8'));
    } catch (error) {
        console.error('Error al subir el archivo:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

const obtenerLoteInicialMasReciente = async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ error: 'El id del usuario es obligatorio' });
        }

        const [files] = await bucket.getFiles({
            prefix: `lotes_iniciales/${userId}/`,
        });

        if (files.length === 0) {
            return res.status(404).json({ error: 'No se encontraron archivos para este usuario' });
        }

        const sortedFiles = files.sort((a, b) => new Date(b.metadata.timeCreated) - new Date(a.metadata.timeCreated));
        const latestFile = sortedFiles[0];

        const fileContents = await latestFile.download();
        res.status(200).json({
            filename: latestFile.name,
            content: JSON.parse(fileContents.toString())
        });
    } catch (error) {
        console.error('Error al obtener el archivo más reciente:', error);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
};

const obtenerHistorialLotes = async (req, res) => {
    try {
        const userId = req.params.userId;

        const [files] = await bucket.getFiles({
            prefix: `lotes_iniciales/${userId}`
        });

        const fileList = files.map(file => ({
            name: file.name,
            created: file.metadata.timeCreated
        }));

        res.status(200).json(fileList);
    } catch (error) {
        console.error('Error retrieving file history:', error);
        res.status(500).json({ error: `Error retrieving file history: ${error.message}` });
    }
};

module.exports = { subirLotesIniciales, obtenerLoteInicialMasReciente, obtenerHistorialLotes };