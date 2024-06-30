const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const DashboardIndicadoresRoute = require('../controllers/dashboardIndicadoresController');


router.get('/grafica1', DashboardIndicadoresRoute.grafica1);

module.exports = router;
