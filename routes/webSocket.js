const express = require('express');
const socketController = require('../controllers/socketBackground');
const router = express.Router();

router.post('/emitirEvento', socketController.seInsertaronDatosAnalisis);
router.post('/reciveMap', socketController.recibirMapeoHtml);

module.exports = router;

