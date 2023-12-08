const DashboardModel = require('../models/dashboard');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {exec} = require('child_process');

const execBash = async (req, res) => {
    console.log("EJECUTANDO EL BASH =======");
    const idUsuario = req.params.idUsuario;
    const idAnalisis = req.params.idAnalisis;

    // Verificar si los archivos están presentes
    if (!req.files['csv'] || !req.files['polygon']) {
        return res.status(400).send('Archivos CSV o polígono no proporcionados');
    }

    const csvPath = req.files['csv'][0].path;
    const polygonPath = req.files['polygon'][0].path;


    console.log("ARCHIVO =========");
    console.log(req.files['csv'][0]);
    console.log("======= PARAMETROS QUE SE LE PASAN AL BASH =========");
    console.log("ID USUARIO:");
    console.log(idUsuario);
    console.log("ID ANALISIS:");
    console.log(idAnalisis);
    console.log("CSV PATH:");
    console.log(csvPath);
    console.log("POLYGONO PATH:");
    console.log(polygonPath);

    exec(`bash /geomotica/init_analisis.sh ${idUsuario} ${idAnalisis} ${csvPath} ${polygonPath}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Error executing script: ${error.message}`);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send('Script executed successfully');
    });
};
const obtenerUltimoAnalisis = async (req, res) => {
    const tipoAnalisis = req.params.tipoAnalisis;
    const idUsuario = req.params.idUsuario;
    const obtenerUltimoAnalisisResult = await DashboardModel.obtenerUltimoAnalisisQuery(tipoAnalisis, idUsuario);
    return res.json(obtenerUltimoAnalisisResult);
}

/*======================================================
*  ENDPOINT'S INFORME APS
* ======================================================*/
const ResponsableAps = async (req, res)=>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerResponsable = await DashboardModel.obtenerNombreResponsableAps(idAnalisis);
    return res.json(obtenerResponsable);
}
const FechaInicioCosechaAps = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerFechaInicio = await DashboardModel.obtenerFechaInicioCosechaAps(idAnalisis);
    return res.json(obtenerFechaInicio);
}
const FechaFinCosechaAPS = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerFechaFin = await DashboardModel.obtenerFechaFinalCosechaAps(idAnalisis);
    return res.json(obtenerFechaFin);

}
const NombreFincaAps = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerNombreFinca = await DashboardModel.obtenerNombreFincaAps(idAnalisis);
    return res.json(obtenerNombreFinca);
}

const CodigoParcelasAps = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerCodigoParcelas = await DashboardModel.obtenerCodigoParcelasResponsableAps(idAnalisis);
    return res.json(obtenerCodigoParcelas);
}

const NombreOperadorAps = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerNombreOperador = await DashboardModel.obtenerNombreOperadorAps(idAnalisis);
    return res.json(obtenerNombreOperador);
}

const EquipoAps = async(req, res)=> {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerEquipoAps = await DashboardModel.obtenerEquipoAps(idAnalisis);
    return res.json(obtenerEquipoAps);
}

const ActividadAps = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerActividadAps = await DashboardModel.obtenerActividadAps(idAnalisis);
    return res.json(obtenerActividadAps);
}

const AreaNetaAps = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerAreaNetaAps = await DashboardModel.obtenerAreaNetaAps(idAnalisis);
    return res.json(obtenerAreaNetaAps);
}
const AreaBrutaAps = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerAreaBrutaAps = await DashboardModel.obtenerAreaBrutaAps(idAnalisis);
    return res.json(obtenerAreaBrutaAps);

}

const DiferenciaEntreAreasAps = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerDiferenciaEntreAreasAps = await DashboardModel.obtenerDiferenciaEntreAreasAps(idAnalisis);
    return res.json(obtenerDiferenciaEntreAreasAps);

}

const HoraInicioAps = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerHoraInicioAps = await DashboardModel.obtenerHoraInicioAps(idAnalisis);
    return res.json(obtenerHoraInicioAps);
}

const HoraFinalAps = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerHoraFinalAps = await DashboardModel.obtenerHoraFinalAps(idAnalisis);
    return res.json(obtenerHoraFinalAps);

}


const TiempoTotalActividadesAps = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerTiempoTotalActividadAps = DashboardModel.obtenerTiempoTotalActividadAps(idAnalisis);
    return res.json(obtenerTiempoTotalActividadAps);

}

const EficienciaAps = async(req, res)=>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerEficienciaAps = DashboardModel.obtenerEficienciaAps(idAnalisis);
    return res.json(obtenerEficienciaAps);
}

const PromedioVelocidadAps = async(req, res)=>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerPromedioVelocidadAps = DashboardModel.obtenerPromedioVelocidadAps(idAnalisis);
    return res.json(obtenerPromedioVelocidadAps);
}

/*======================================================
*  ENDPOINT'S INFORME COSECHA_MECANICA
* ======================================================*/

const NombreResponsableCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerResponsableCm = DashboardModel.obtenerNombreResponsableCm(idAnalisis);
    return res.json(obtenerResponsableCm);
}

const FechaInicioCosechaCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerFechaIncioCosechaCm = DashboardModel.obtenerFechaInicioCosechaCm(idAnalisis);
    return res.json(obtenerFechaIncioCosechaCm);
}

const FechaFinCosechaCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerFechaFinCosechaCm = DashboardModel.obtenerFechaFinCosechaCm(idAnalisis);
    return res.json(obtenerFechaFinCosechaCm);
}

const NombreFincaCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerNombreFincaCm = DashboardModel.obtenerNombreFincaCm(idAnalisis);
    return res.json(obtenerNombreFincaCm);
}

const CodigoParcelaResponsableCm = async (req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerCodigoParcelaResponsableCm = DashboardModel.obtenerCodigoParcelasResponsableCm(idAnalisis);
    return res.json(obtenerCodigoParcelaResponsableCm);
}

const NombreOperadorCm = async (req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerNombreOperadorCm = DashboardModel.obtenerNombreOperadorCm(idAnalisis);
    return res.json(obtenerNombreOperadorCm);
}

const NombreMaquinaCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerNombreMaquinaCm = DashboardModel.obtenerNombreMaquinaCm(idAnalisis);
    return res.json(obtenerNombreMaquinaCm);
}

const ActividadCm = async(req, res)=>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerActividadCm = DashboardModel.obtenerActividadCm(idAnalisis);
    return res.json(obtenerActividadCm);
}

const AreaNetaCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
     const obtenerAreaNetaCm = DashboardModel.obtenerAreaNetaCm(idAnalisis);
    return res.json(obtenerAreaNetaCm);
}

const AreaBrutaCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerAreaBrutaCm = DashboardModel.obtenerAreaBrutaCm(idAnalisis);
    return res.json(obtenerAreaBrutaCm);
}

const DiferenciaDeAreaCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerDiferenciaDeAreaCm = DashboardModel.obtenerDiferenciaDeAreaCm(idAnalisis);
    return res.json(obtenerDiferenciaDeAreaCm);
}

const HoraInicioCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerHoraInicioCm = DashboardModel.obtenerHoraInicioCm(idAnalisis);
    return res.json(obtenerHoraInicioCm);
}

const HoraFinalCm = async(req, res)=>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerHoraFinalCm = DashboardModel.obtenerHoraFinalCm(idAnalisis);
    return res.json(obtenerHoraFinalCm);

}

const TiempoTotalActividadCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerTiempoTotalActividadCm = DashboardModel.obtenerTiempoTotalActividadCm(idAnalisis);
    return res.json(obtenerTiempoTotalActividadCm);

}

const EficienciaCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerEficienciaCm = DashboardModel.obtenerEficienciaCm(idAnalisis);
    return res.json(obtenerEficienciaCm);
}

const PromedioVelocidadCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerPromedioVelocidadCm = DashboardModel.obtenerPromedioVelocidadCm(idAnalisis);
    return res.json(obtenerPromedioVelocidadCm);
}

const PorcentajeAreaPilotoCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerPorcentajeAreaPilotoCm = DashboardModel.obtenerPorcentajeAreaPilotoCm(idAnalisis);
    return res.json(obtenerPorcentajeAreaPilotoCm);
}

const PorcentajeAreaAutoTrackerCm = async(req, res) => {
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerPorcentajeAreaAutoTrackerCm = DashboardModel.obtenerPorcentajeAreaAutotrackerCm(idAnalisis);
    return res.json(obtenerPorcentajeAreaAutoTrackerCm);
}


/*======================================================
*  ENDPOINT'S INFORME FERTILIZACIÓN
* ======================================================*/

const ResponsableFetilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerResponsableFertilizacion = DashboardModel.obtenerResponsableFertilizacion(idAnalisis);
    return res.json(obtenerResponsableFertilizacion);
}


const FechaInicioFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerFechaInicioFertilizacion = DashboardModel.obtenerFechaInicioFertilizacion(idAnalisis);
    return res.json(obtenerFechaInicioFertilizacion);
}


const FechaFinalFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerFechaFinalFertilizacion = DashboardModel.obtenerFechaFinalFertilizacion(idAnalisis);
    return res.json(obtenerFechaFinalFertilizacion);

}

const NombreFincaFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerNombreFincaFertilizacion =DashboardModel.obtenerNombreFincaFertilizacion(idAnalisis);
    return res.json(obtenerNombreFincaFertilizacion);
}

const OperadorFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerOperadorFertilizacion = DashboardModel.obtenerOperadorFertilizacion(idAnalisis);
    return res.json(obtenerOperadorFertilizacion);

}

const EquipoFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerEquipoFertilizacion = DashboardModel.obtenerEquipoFertilizacion(idAnalisis);
    return res.json(obtenerEquipoFertilizacion);
}

const ActividadFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerActividadFertilizacion = DashboardModel.obtenerActividadFertilizacion(idAnalisis);
    return res.json(obtenerActividadFertilizacion);
}

const AreaNetaFetilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerAreaNetaFertilizacion = DashboardModel.obtenerAreaNetaFertilizacion(idAnalisis);
    return res.json(obtenerAreaNetaFertilizacion);
}

const AreaBrutaFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerAreaBrutaFertilizacion = DashboardModel.obtenerAreaBrutaFertilizacion(idAnalisis);
    return res.json(obtenerAreaBrutaFertilizacion);
}

const DiferenciaAreaFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerDiferenciaAreaFertilizacion = DashboardModel.obtenerDiferenciaAreaFertilizacion(idAnalisis);
    return res.json(obtenerDiferenciaAreaFertilizacion);
}
const HoraInicioFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerHoraInicioFertilizacion = DashboardModel.obtenerHoraInicioFertilizacion(idAnalisis);
    return res.json(obtenerHoraInicioFertilizacion);

}

const HoraFinalFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerHoraFinalFertilizacion = DashboardModel.obtenerHoraFinalFertilizacion(idAnalisis);
    return res.json(obtenerHoraFinalFertilizacion);
}
const TiempoTotalFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerTiempoTotalFertilizacion = DashboardModel.obtenerTiempoTotalFertilizacion(idAnalisis);
    return res.json(obtenerTiempoTotalFertilizacion);
}

const EficienciaFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerEficienciaFertilizacion = DashboardModel.obtenerEficienciaFertilizacion(idAnalisis);
    return res.json(obtenerEficienciaFertilizacion);
}

const PromedioDosisRealFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerPromedioDosisRealFertilizacion = DashboardModel.obtenerPromedioDosisRealFertilizacion(idAnalisis);
    return res.json(obtenerPromedioDosisRealFertilizacion);
}

const DosisTeoricaFertilizacion = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    const obtenerDosisTeoricaFertilizacion = DashboardModel.obtenerDosisTeoricaFertilizacion(idAnalisis);
    return res.json(obtenerDosisTeoricaFertilizacion);

}

/*======================================================
*  ENDPOINT'S INFORME HERBICIDAS
* ======================================================*/

const ResponsableHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerResponsableHerbicidas = DashboardModel.obtenerResponsableHerbicidas(idAnalisis);
    return res.json(obtenerResponsableHerbicidas);
}

const FechaHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerFechaHerbicidas = DashboardModel.obtenerFechaHerbicidas(idAnalisis);
    return res.json(obtenerFechaHerbicidas);
}

const NombreFincaHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerNombreFincaHerbicidas = DashboardModel.obtenerNombreFincaHerbicidas(idAnalisis);
    return res.json(obtenerNombreFincaHerbicidas);
}

const ParcelaHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerParcelaHerbicidas = DashboardModel.obtenerParcelaHerbicidas(idAnalisis);
    return res.json(obtenerParcelaHerbicidas);
}

const OperadorHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerOperadorHerbicidas = DashboardModel.obtenerOperadorHerbicidas(idAnalisis);
    return res.json(obtenerOperadorHerbicidas);
}

const EquipoHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerEquipoHerbicidas = DashboardModel.obtenerEquipoHerbicidas(idAnalisis);
    return res.json(obtenerEquipoHerbicidas);
}

const ActividadHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerActividadHerbicidas = DashboardModel.obtenerActividadHerbicidas(idAnalisis);
    return res.json(obtenerActividadHerbicidas);
}

const AreaNetaHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerAreaNetaHerbicidas = DashboardModel.obtenerAreaNetaHerbicidas(idAnalisis);
    return res.json(obtenerAreaNetaHerbicidas);
}

const AreaBrutaHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerAreaBrutaHerbicidas = DashboardModel.obtenerAreaBrutaHerbicidas(idAnalisis);
    return res.json(obtenerAreaBrutaHerbicidas);
}

const DiferenciaDeAreaHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerDiferenciaDeAreaHerbicidas = DashboardModel.obtenerDiferenciaDeAreaHerbicidas(idAnalisis);
    return res.json(obtenerDiferenciaDeAreaHerbicidas);
}

const HoraInicioHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerHoraInicioHerbicidas = DashboardModel.obtenerHoraInicioHerbicidas(idAnalisis);
    return res.json(obtenerHoraInicioHerbicidas);
}

const HoraFinalHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerHoraFinalHerbicidas = DashboardModel.obtenerHoraFinalHerbicidas(idAnalisis);
    return res.json(obtenerHoraFinalHerbicidas);
}

const TiempoTotalHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerTiempoTotalHerbicidas = DashboardModel.obtenerTiempoTotalHerbicidas(idAnalisis);
    return res.json(obtenerTiempoTotalHerbicidas);
}

const EficienciaHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerEficienciaHerbicidas = DashboardModel.obtenerEficienciaHerbicidas(idAnalisis);
    return res.json(obtenerEficienciaHerbicidas);
}

const PromedioVelocidadHerbicidas = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const obtenerPromedioVelocidadHerbicidas = DashboardModel.obtenerPromedioVelocidadHerbicidas(idAnalisis);
    return res.json(obtenerPromedioVelocidadHerbicidas);
}


module.exports = {
    obtenerUltimoAnalisis,
    //==== ANALISIS APS=======
    ResponsableAps,
    FechaInicioCosechaAps,
    FechaFinCosechaAPS,
    NombreFincaAps,
    CodigoParcelasAps,
    NombreOperadorAps,
    EquipoAps,
    ActividadAps,
    AreaNetaAps,
    AreaBrutaAps,
    DiferenciaEntreAreasAps,
    HoraInicioAps,
    HoraFinalAps,
    TiempoTotalActividadesAps,
    EficienciaAps,
    PromedioVelocidadAps,
    //==== ANALISIS COSECHA_MACANICA=======
    NombreResponsableCm,
    FechaInicioCosechaCm,
    FechaFinCosechaCm,
    NombreFincaCm,
    CodigoParcelaResponsableCm,
    NombreOperadorCm,
    NombreMaquinaCm,
    ActividadCm,
    AreaNetaCm,
    AreaBrutaCm,
    DiferenciaDeAreaCm,
    HoraInicioCm,
    HoraFinalCm,
    TiempoTotalActividadCm,
    EficienciaCm,
    PromedioVelocidadCm,
    PorcentajeAreaPilotoCm,
    PorcentajeAreaAutoTrackerCm,
    //==== ANALISIS FERTILIZACIÓN=======
    ResponsableFetilizacion,
    FechaInicioFertilizacion,
    FechaFinalFertilizacion,
    NombreFincaFertilizacion,
    OperadorFertilizacion,
    EquipoFertilizacion,
    ActividadFertilizacion,
    AreaNetaFetilizacion,
    AreaBrutaFertilizacion,
    DiferenciaAreaFertilizacion,
    HoraInicioFertilizacion,
    HoraFinalFertilizacion,
    TiempoTotalFertilizacion,
    EficienciaFertilizacion,
    PromedioDosisRealFertilizacion,
    DosisTeoricaFertilizacion,
    //==== ANALISIS HERBICIDAS=======
    ResponsableHerbicidas,
    FechaHerbicidas,
    NombreFincaHerbicidas,
    ParcelaHerbicidas,
    OperadorHerbicidas,
    EquipoHerbicidas,
    ActividadHerbicidas,
    AreaNetaHerbicidas,
    AreaBrutaHerbicidas,
    DiferenciaDeAreaHerbicidas,
    HoraInicioHerbicidas,
    HoraFinalHerbicidas,
    TiempoTotalHerbicidas,
    EficienciaHerbicidas,
    PromedioVelocidadHerbicidas,
    execBash
};
