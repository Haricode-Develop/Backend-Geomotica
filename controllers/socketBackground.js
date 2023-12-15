const io = require('../socket');

exports.seInsertaronDatosAnalisis = (req, res) => {
    console.log("EMITIO EL EVENTO DE DATOS INSERTADOS =======");
    io.getIo().emit('datosInsertados');  // <-- Emite el evento
    res.send('Datos insertados con éxito');
};

exports.recibirMapeoHtml = (req, res) => {
    console.log("EMITIO EL EVENTO DE ENVIAR MAPA =======");

    const htmlContent = req.body.htmlContent;
    io.getIo().emit('sendMap', htmlContent);
    res.send('Mapeo Recibido');
};


exports.loadingAnalysis = (req, res) => {
    const progress = req.body.progress;
    console.log(`Progreso de la carga: ${progress}%`);

    io.getIo().emit('progressUpdate', progress);
    res.send('Progreso actualizado');
};
