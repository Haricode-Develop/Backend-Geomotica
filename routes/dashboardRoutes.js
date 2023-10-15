const express = require('express');
const router = express.Router();
const DashbBoard = require('../controllers/dashboardController');
router.get('/promedio_velocidad/:nombreTabla', DashbBoard.promedioVelocidad);
router.get('/promedio_fertilizacion_dosis_real', DashbBoard.promedioFertilizacionDosisReal);
router.get('/promedio_altura_m', DashbBoard.promedioAlturaGps);
router.get('/tiempo_total_actividad/:nombreTabla', DashbBoard.tiempoTotalActividad);
router.get('/eficiencia/:nombreTabla', DashbBoard.eficiencia);
router.get('/presion_contador', DashbBoard.presionContadorBase);
router.get('/promedio_tch/:nombreTabla',DashbBoard.promedioTch);
router.get('/operador/:nombreTabla',DashbBoard.operador);
router.get('/fecha_actividad/:nombreTabla',DashbBoard.fechaActividad)
router.get('/execBash', DashbBoard.execBash);

module.exports = router;