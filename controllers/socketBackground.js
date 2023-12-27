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


exports.loadingAnalysis = (req, res) => {
    const progress = req.body.progress;
    console.log(`Progreso de la carga: ${progress}%`);

    io.getIo().emit('progressUpdate', progress);
    res.send('Progreso actualizado');
};
