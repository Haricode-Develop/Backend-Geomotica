const io = require('../socket');

exports.seInsertaronDatosAnalisis = (req, res) => {
    console.log("EMITIO EL EVENTO DE DATOS INSERTADOS");
    io.getIo().emit('datosInsertados');  // <-- Emite el evento
    res.send('Datos insertados con éxito');
};

exports.recibirMapeoHtml = (req, res) => {
    const htmlContent = req.body.htmlContent;
    io.getIo.emit('sendMap', htmlContent);
    res.send('Mapeo Recibido');
};
