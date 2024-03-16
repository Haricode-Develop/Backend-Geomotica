const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const DashbBoard = require('../controllers/dashboardController');
const History = require('../controllers/historyController');


router.get('/historialAnalisis', History.analisis);

router.get('/geojson/:nombreAnalisis/:id', History.obtenerArchivoTIFF);

module.exports = router;
