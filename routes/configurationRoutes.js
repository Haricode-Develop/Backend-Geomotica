const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { subirLotesIniciales, obtenerLoteInicialMasReciente, obtenerHistorialLotes } = require('../controllers/configurationController');

router.post('/lotesIniciales', upload.none(), subirLotesIniciales);
router.get('/lotesIniciales/masReciente/:userId', obtenerLoteInicialMasReciente);
router.get('/lotesIniciales/historial/:userId', obtenerHistorialLotes);

module.exports = router;