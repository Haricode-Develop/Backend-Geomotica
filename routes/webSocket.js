const express = require('express');
const socketController = require('../controllers/socketBackground');
const router = express.Router();

router.post('/emitirEvento', socketController.seInsertaronDatosAnalisis);
router.post('/updateMapLayer', socketController.recibirMapeoHtml);
router.post('/loadingAnalysis', socketController.loadingAnalysis);
router.post('/updateGeoJSONLayer', socketController.recibirCapaGeoJSON);
module.exports = router;

