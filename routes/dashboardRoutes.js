const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const DashbBoard = require('../controllers/dashboardController');
const AplicacionesAereas = require('../controllers/aplicacionesAereasController');
const CosechaMecanica = require('../controllers/cosechaMecanicaController');
const Fertilizacion = require('../controllers/fertilizacionController');
const Herbicidas = require('../controllers/herbicidasController');

// Rutas existentes
router.post('/insert_analisis/:tipoAnalisis/:idUsuario', DashbBoard.insertarAnalisis);
router.get('/ultimo_analisis/:tipoAnalisis/:idUsuario', DashbBoard.obtenerUltimoAnalisis);
router.post(
    '/execBash/:idUsuario/:idAnalisis/:idMax/:offset/:validar/:lineas',
    upload.fields([{ name: 'csv' }, { name: 'polygon' }]),
    DashbBoard.execBash
);
router.post('/procesarCsv/', upload.fields([{ name: 'csv' }]), DashbBoard.procesarCsv);

// ==== ANALISIS APS =======
router.get('/responsableAps/:ID_ANALISIS', AplicacionesAereas.ResponsableAps);
router.get('/fechaInicioCosechaAps/:ID_ANALISIS', AplicacionesAereas.FechaInicioCosechaAps);
router.get('/fechaFinCosechaAps/:ID_ANALISIS', AplicacionesAereas.FechaFinCosechaAPS);
router.get('/nombreOperadorAps/:ID_ANALISIS', AplicacionesAereas.NombreOperadorAps);
router.get('/nombreFincaAps/:ID_ANALISIS', AplicacionesAereas.NombreFincaAps);
router.get('/codigoParcelasAps/:ID_ANALISIS', AplicacionesAereas.CodigoParcelasAps);
router.get('/equipoAps/:ID_ANALISIS', AplicacionesAereas.EquipoAps);
router.get('/horaInicioAps/:ID_ANALISIS', AplicacionesAereas.HoraInicioAps);
router.get('/horaFinalAps/:ID_ANALISIS', AplicacionesAereas.HoraFinalAps);
router.get('/eficienciaAps/:ID_ANALISIS', AplicacionesAereas.EficienciaAps);
router.get('/codigoLotesAps/:ID_ANALISIS', AplicacionesAereas.CodigoLotesAps);
router.get('/dosisTeoricaAps/:ID_ANALISIS', AplicacionesAereas.DosisTeoricaAps);
router.get('/humedadDelCultivo/:ID_ANALISIS', AplicacionesAereas.HumedadDelCultivo);
router.get('/tchEstimado/:ID_ANALISIS', AplicacionesAereas.TchEstimado);
router.get('/tiempoTotalAps/:ID_ANALISIS', AplicacionesAereas.TiempoTotalAps);
router.get('/productoAps/:ID_ANALISIS', AplicacionesAereas.ProductoAps);

// ==== ANALISIS COSECHA_MECANICA =======
router.get('/nombreResponsableCm/:ID_ANALISIS', CosechaMecanica.NombreResponsableCm);
router.get('/fechaInicioCosechaCm/:ID_ANALISIS', CosechaMecanica.FechaInicioCosechaCm);
router.get('/fechaFinCosechaCm/:ID_ANALISIS', CosechaMecanica.FechaFinCosechaCm);
router.get('/nombreFincaCm/:ID_ANALISIS', CosechaMecanica.NombreFincaCm);
router.get('/codigoParcelaResponsableCm/:ID_ANALISIS', CosechaMecanica.CodigoParcelaResponsableCm);
router.get('/nombreOperadorCm/:ID_ANALISIS', CosechaMecanica.NombreOperadorCm);
router.get('/nombreMaquinaCm/:ID_ANALISIS', CosechaMecanica.NombreMaquinaCm);
router.get('/actividadCm/:ID_ANALISIS', CosechaMecanica.ActividadCm);
router.get('/horaInicioCm/:ID_ANALISIS', CosechaMecanica.HoraInicioCm);
router.get('/horaFinalCm/:ID_ANALISIS', CosechaMecanica.HoraFinalCm);
router.get('/tiempoTotalActividadCm/:ID_ANALISIS', CosechaMecanica.TiempoTotalActividadCm);
router.get('/eficienciaCm/:ID_ANALISIS', CosechaMecanica.EficienciaCm);
router.get('/promedioVelocidadCm/:ID_ANALISIS', CosechaMecanica.PromedioVelocidadCm);
router.get('/porcentajeAreaPilotoCm/:ID_ANALISIS', CosechaMecanica.PorcentajeAreaPilotoCm);
router.get('/porcentajeAreaAutoTrackerCm/:ID_ANALISIS', CosechaMecanica.PorcentajeAreaAutoTrackerCm);
router.get('/consumoCombustibleCm/:ID_ANALISIS', CosechaMecanica.ConsumoCombustibleCm);
router.get('/calidadGpsCm/:ID_ANALISIS', CosechaMecanica.CalidadGpsCm);
router.get('/rpmCm/:ID_ANALISIS', CosechaMecanica.RpmCm);
router.get('/tchCm/:ID_ANALISIS', CosechaMecanica.TchCm);
router.get('/tahCm/:ID_ANALISIS', CosechaMecanica.TahCm);
router.get('/presionCortadorBaseCm/:ID_ANALISIS', CosechaMecanica.PresionCortadorBaseCm);

// ==== ANALISIS FERTILIZACIÓN =======
router.get('/responsableFertilizacion/:ID_ANALISIS', Fertilizacion.ResponsableFetilizacion);
router.get('/fechaInicioFertilizacion/:ID_ANALISIS', Fertilizacion.FechaInicioFertilizacion);
router.get('/fechaFinalFertilizacion/:ID_ANALISIS', Fertilizacion.FechaFinalFertilizacion);
router.get('/nombreFincaFertilizacion/:ID_ANALISIS', Fertilizacion.NombreFincaFertilizacion);
router.get('/operadorFertilizacion/:ID_ANALISIS', Fertilizacion.OperadorFertilizacion);
router.get('/equipoFertilizacion/:ID_ANALISIS', Fertilizacion.EquipoFertilizacion);
router.get('/actividadFertilizacion/:ID_ANALISIS', Fertilizacion.ActividadFertilizacion);
router.get('/areaNetaFertilizacion/:ID_ANALISIS', Fertilizacion.AreaNetaFertilizacion);
router.get('/areaBrutaFertilizacion/:ID_ANALISIS', Fertilizacion.AreaBrutaFertilizacion);
router.get('/diferenciaAreaFertilizacion/:ID_ANALISIS', Fertilizacion.DiferenciaAreaFertilizacion);
router.get('/horaInicioFertilizacion/:ID_ANALISIS', Fertilizacion.HoraInicioFertilizacion);
router.get('/horaFinalFertilizacion/:ID_ANALISIS', Fertilizacion.HoraFinalFertilizacion);
router.get('/tiempoTotalFertilizacion/:ID_ANALISIS', Fertilizacion.TiempoTotalFertilizacion);
router.get('/eficienciaFertilizacion/:ID_ANALISIS', Fertilizacion.EficienciaFertilizacion);
router.get('/promedioDosisRealFertilizacion/:ID_ANALISIS', Fertilizacion.PromedioDosisRealFertilizacion);
router.get('/dosisTeoricaFertilizacion/:ID_ANALISIS', Fertilizacion.DosisTeoricaFertilizacion);

// ==== ANALISIS HERBICIDAS =======
router.get('/responsableHerbicidas/:ID_ANALISIS', Herbicidas.ResponsableHerbicidas);
router.get('/fechaHerbicidas/:ID_ANALISIS', Herbicidas.FechaHerbicidas);
router.get('/nombreFincaHerbicidas/:ID_ANALISIS', Herbicidas.NombreFincaHerbicidas);
router.get('/parcelaHerbicidas/:ID_ANALISIS', Herbicidas.ParcelaHerbicidas);
router.get('/operadorHerbicidas/:ID_ANALISIS', Herbicidas.OperadorHerbicidas);
router.get('/equipoHerbicidas/:ID_ANALISIS', Herbicidas.EquipoHerbicidas);
router.get('/actividadHerbicidas/:ID_ANALISIS', Herbicidas.ActividadHerbicidas);
router.get('/areaNetaHerbicidas/:ID_ANALISIS', Herbicidas.AreaNetaHerbicidas);
router.get('/areaBrutaHerbicidas/:ID_ANALISIS', Herbicidas.AreaBrutaHerbicidas);
router.get('/diferenciaDeAreaHerbicidas/:ID_ANALISIS', Herbicidas.DiferenciaDeAreaHerbicidas);
router.get('/horaInicioHerbicidas/:ID_ANALISIS', Herbicidas.HoraInicioHerbicidas);
router.get('/horaFinalHerbicidas/:ID_ANALISIS', Herbicidas.HoraFinalHerbicidas);
router.get('/tiempoTotalHerbicidas/:ID_ANALISIS', Herbicidas.TiempoTotalHerbicidas);
router.get('/eficienciaHerbicidas/:ID_ANALISIS', Herbicidas.EficienciaHerbicidas);
router.get('/promedioVelocidadHerbicidas/:ID_ANALISIS', Herbicidas.PromedioVelocidadHerbicidas);

// ==== JSON de análisis ========
router.post('/cosecha_mecanica_analisis/:ID_ANALISIS', CosechaMecanica.depositarJsonCosechaMecanica);

module.exports = router;
