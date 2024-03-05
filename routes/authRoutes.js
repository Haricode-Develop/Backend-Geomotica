const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.post('/passwordRecuperation', AuthController.passwordRecuperation)
router.post('/registryConfirmation', AuthController.registerConfirmation)
router.post('/passwordGeneration/', AuthController.temporalPasswordGeneration)
router.post('/confirmGeneration/', AuthController.confirmGeneration) //   este es para el envio del correo 
router.post('/accountConfirmation/', AuthController.accountConfirmation) //este es para la vista
module.exports = router;
