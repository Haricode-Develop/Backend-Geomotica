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
    const layerUrl = req.body.layerUrl;
    console.log("URL de la Capa GeoJSON Recibida: ", layerUrl);

    // Emitir el evento con la URL de la capa
    io.getIo().emit('updateGeoJSONLayer', layerUrl);

    res.send('Capa GeoJSON recibida y emitida');
};
exports.loadingAnalysis = (req, res) => {
    const progress = req.body.progress;
    console.log(`Progreso de la carga: ${progress}%`);

    io.getIo().emit('progressUpdate', progress);
    res.send('Progreso actualizado');
};
