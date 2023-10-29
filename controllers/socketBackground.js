const io = require('../socket');

const controller = {
    seInsertaronDatosAnalisis: (req, res) => {
        io.getIo().emit('datosInsertados');  // <-- Emite el evento
        res.send('Datos insertados con éxito');
    }
};

module.exports = controller;
