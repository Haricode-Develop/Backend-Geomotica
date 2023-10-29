const io = require('../socket');

const controller = {
    seInsertaronDatosAnalisis: (req, res) => {
        console.log("EMITIO EL EVENTO DE DATOS INSERTADOS");
        io.getIo().emit('datosInsertados');  // <-- Emite el evento
        res.send('Datos insertados con éxito');
    }

};

const recibirMapeoHtml = {
    recibeMapeo:(req, res) => {
        const htmlContent = req.body.htmlContent;
        io.on('connection', (socket) =>{
            socket.on('requestMap',()=>{
                socket.emit('sendMap', htmlContent);
            })
        });
        res.send('Mapeo Recibido');
    }
}
module.exports = {
    controller,
    recibirMapeoHtml

};
