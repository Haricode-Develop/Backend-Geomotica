const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const History = require('../controllers/historyController');
const socketController = require("../controllers/socketBackground");


router.get('/historialAnalisis', History.analisis);


module.exports = router;
