const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const DashbBoard = require('../controllers/dashboardController');

// Rutas existentes
router.post('/insert_analisis/:tipoAnalisis/:idUsuario', DashbBoard.insertarAnalisis);
router.get('/ultimo_analisis/:tipoAnalisis/:idUsuario', DashbBoard.obtenerUltimoAnalisis);
router.post('/execBash/:idUsuario/:idAnalisis/:idMax/:offset/:validar', upload.fields([{ name: 'csv' }, { name: 'polygon' }]), DashbBoard.execBash);
router.post('/procesarCsv/',  upload.fields([{ name: 'csv' }]), DashbBoard.procesarCsv);

// ==== ANALISIS APS =======
router.get('/responsableAps/:ID_ANALISIS', DashbBoard.ResponsableAps);
router.get('/fechaInicioCosechaAps/:ID_ANALISIS', DashbBoard.FechaInicioCosechaAps);
router.get('/fechaFinCosechaAps/:ID_ANALISIS', DashbBoard.FechaFinCosechaAPS);
router.get('/nombreFincaAps/:ID_ANALISIS', DashbBoard.NombreFincaAps);
router.get('/codigoParcelasAps/:ID_ANALISIS', DashbBoard.CodigoParcelasAps);
router.get('/nombreOperadorAps/:ID_ANALISIS', DashbBoard.NombreOperadorAps);
router.get('/equipoAps/:ID_ANALISIS', DashbBoard.EquipoAps);
router.get('/actividadAps/:ID_ANALISIS', DashbBoard.ActividadAps);
router.get('/areaNetaAps/:ID_ANALISIS', DashbBoard.AreaNetaAps);
router.get('/areaBrutaAps/:ID_ANALISIS', DashbBoard.AreaBrutaAps);
router.get('/diferenciaEntreAreasAps/:ID_ANALISIS', DashbBoard.DiferenciaEntreAreasAps);
router.get('/horaInicioAps/:ID_ANALISIS', DashbBoard.HoraInicioAps);
router.get('/horaFinalAps/:ID_ANALISIS', DashbBoard.HoraFinalAps);
router.get('/tiempoTotalActividadesAps/:ID_ANALISIS', DashbBoard.TiempoTotalActividadesAps);
router.get('/eficienciaAps/:ID_ANALISIS', DashbBoard.EficienciaAps);
router.get('/promedioVelocidadAps/:ID_ANALISIS', DashbBoard.PromedioVelocidadAps);

// ==== ANALISIS COSECHA_MECANICA =======
router.get('/nombreResponsableCm/:ID_ANALISIS', DashbBoard.NombreResponsableCm);
router.get('/fechaInicioCosechaCm/:ID_ANALISIS', DashbBoard.FechaInicioCosechaCm);
router.get('/fechaFinCosechaCm/:ID_ANALISIS', DashbBoard.FechaFinCosechaCm);
router.get('/nombreFincaCm/:ID_ANALISIS', DashbBoard.NombreFincaCm);
router.get('/codigoParcelaResponsableCm/:ID_ANALISIS', DashbBoard.CodigoParcelaResponsableCm);
router.get('/nombreOperadorCm/:ID_ANALISIS', DashbBoard.NombreOperadorCm);
router.get('/nombreMaquinaCm/:ID_ANALISIS', DashbBoard.NombreMaquinaCm);
router.get('/actividadCm/:ID_ANALISIS', DashbBoard.ActividadCm);
router.get('/horaInicioCm/:ID_ANALISIS', DashbBoard.HoraInicioCm);
router.get('/horaFinalCm/:ID_ANALISIS', DashbBoard.HoraFinalCm);
router.get('/tiempoTotalActividadCm/:ID_ANALISIS', DashbBoard.TiempoTotalActividadCm);
router.get('/eficienciaCm/:ID_ANALISIS', DashbBoard.EficienciaCm);
router.get('/promedioVelocidadCm/:ID_ANALISIS', DashbBoard.PromedioVelocidadCm);
router.get('/porcentajeAreaPilotoCm/:ID_ANALISIS', DashbBoard.PorcentajeAreaPilotoCm);
router.get('/porcentajeAreaAutoTrackerCm/:ID_ANALISIS', DashbBoard.PorcentajeAreaAutoTrackerCm);
router.get('/consumoCombustibleCm/:ID_ANALISIS', DashbBoard.consumoCombustibleCm);
router.get('/calidadGpsCm/:ID_ANALISIS', DashbBoard.calidadGpsCm);
router.get('/rpmCm/:ID_ANALISIS', DashbBoard.rpmCm);
router.get('/tchCm/:ID_ANALISIS', DashbBoard.tchCm);
router.get('/tahCm/:ID_ANALISIS', DashbBoard.tahCm);

// ==== ANALISIS FERTILIZACIÓN =======
router.get('/responsableFertilizacion/:ID_ANALISIS', DashbBoard.ResponsableFetilizacion);
router.get('/fechaInicioFertilizacion/:ID_ANALISIS', DashbBoard.FechaInicioFertilizacion);
router.get('/fechaFinalFertilizacion/:ID_ANALISIS', DashbBoard.FechaFinalFertilizacion);
router.get('/nombreFincaFertilizacion/:ID_ANALISIS', DashbBoard.NombreFincaFertilizacion);
router.get('/operadorFertilizacion/:ID_ANALISIS', DashbBoard.OperadorFertilizacion);
router.get('/equipoFertilizacion/:ID_ANALISIS', DashbBoard.EquipoFertilizacion);
router.get('/actividadFertilizacion/:ID_ANALISIS', DashbBoard.ActividadFertilizacion);
router.get('/areaNetaFertilizacion/:ID_ANALISIS', DashbBoard.AreaNetaFetilizacion);
router.get('/areaBrutaFertilizacion/:ID_ANALISIS', DashbBoard.AreaBrutaFertilizacion);
router.get('/diferenciaAreaFertilizacion/:ID_ANALISIS', DashbBoard.DiferenciaAreaFertilizacion);
router.get('/horaInicioFertilizacion/:ID_ANALISIS', DashbBoard.HoraInicioFertilizacion);
router.get('/horaFinalFertilizacion/:ID_ANALISIS', DashbBoard.HoraFinalFertilizacion);
router.get('/tiempoTotalFertilizacion/:ID_ANALISIS', DashbBoard.TiempoTotalFertilizacion);
router.get('/eficienciaFertilizacion/:ID_ANALISIS', DashbBoard.EficienciaFertilizacion);
router.get('/promedioDosisRealFertilizacion/:ID_ANALISIS', DashbBoard.PromedioDosisRealFertilizacion);
router.get('/dosisTeoricaFertilizacion/:ID_ANALISIS', DashbBoard.DosisTeoricaFertilizacion);

// ==== ANALISIS HERBICIDAS =======
router.get('/responsableHerbicidas/:ID_ANALISIS', DashbBoard.ResponsableHerbicidas);
router.get('/fechaHerbicidas/:ID_ANALISIS', DashbBoard.FechaHerbicidas);
router.get('/nombreFincaHerbicidas/:ID_ANALISIS', DashbBoard.NombreFincaHerbicidas);
router.get('/parcelaHerbicidas/:ID_ANALISIS', DashbBoard.ParcelaHerbicidas);
router.get('/operadorHerbicidas/:ID_ANALISIS', DashbBoard.OperadorHerbicidas);
router.get('/equipoHerbicidas/:ID_ANALISIS', DashbBoard.EquipoHerbicidas);
router.get('/actividadHerbicidas/:ID_ANALISIS', DashbBoard.ActividadHerbicidas);
router.get('/areaNetaHerbicidas/:ID_ANALISIS', DashbBoard.AreaNetaHerbicidas);
router.get('/areaBrutaHerbicidas/:ID_ANALISIS', DashbBoard.AreaBrutaHerbicidas);
router.get('/diferenciaDeAreaHerbicidas/:ID_ANALISIS', DashbBoard.DiferenciaDeAreaHerbicidas);
router.get('/horaInicioHerbicidas/:ID_ANALISIS', DashbBoard.HoraInicioHerbicidas);
router.get('/horaFinalHerbicidas/:ID_ANALISIS', DashbBoard.HoraFinalHerbicidas);
router.get('/tiempoTotalHerbicidas/:ID_ANALISIS', DashbBoard.TiempoTotalHerbicidas);
router.get('/eficienciaHerbicidas/:ID_ANALISIS', DashbBoard.EficienciaHerbicidas);
router.get('/promedioVelocidadHerbicidas/:ID_ANALISIS', DashbBoard.PromedioVelocidadHerbicidas);

module.exports = router;
