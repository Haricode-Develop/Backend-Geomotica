const io = require('../socket');

exports.seInsertaronDatosAnalisis = (req, res) => {
    console.log("EMITIO EL EVENTO DE DATOS INSERTADOS =======");
    io.getIo().emit('datosInsertados');  // <-- Emite el evento
    res.send('Datos insertados con éxito');
};

exports.recibirMapeoHtml = (req, res) => {
    console.log("EMITIO EL EVENTO DE ENVIAR MAPA =======");

    const layerData = req.body;

    io.getIo().emit('mapLayer', layerData);
    res.status(200).send("Capa de mapa recibida y emitida");

};

exports.recibirCapaGeoJSON = (req, res) => {
    const geojsonData = req.body.geojsonData;
    console.log("Datos GeoJSON Recibidos: ", geojsonData);

    // Emitir el evento con los datos GeoJSON
    io.getIo().emit('updateGeoJSONLayer', geojsonData);

    res.send('Datos GeoJSON recibidos y emitidos');
};
exports.loadingAnalysis = (req, res) => {
    const progress = req.body.progress;
    const message = req.body.message;

    console.log(`Progreso de la carga: ${progress}%, Mensaje: ${message}`);

    io.getIo().emit('progressUpdate', { progress, message });

    res.send('Progreso y mensaje actualizados');
};
