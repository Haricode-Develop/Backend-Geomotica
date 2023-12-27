const express = require('express');
const socketController = require('../controllers/socketBackground');
const router = express.Router();

router.post('/emitirEvento', socketController.seInsertaronDatosAnalisis);
router.post('/updateMapLayer', socketController.recibirMapeoHtml);
router.post('/loadingAnalysis', socketController.loadingAnalysis);

module.exports = router;

