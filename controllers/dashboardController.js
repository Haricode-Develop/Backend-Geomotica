const DashboardModel = require('../models/dashboard');
const multer = require('multer');
const path = require('path');

const {exec} = require('child_process');

const promedioVelocidad = async (req, res) => {
    const nombreTabla = req.params.nombreTabla;
    const idAnalisis = req.params.idAnalisis;

    const promedioVelocidadResult = await DashboardModel.promedioVelocidadQuery(nombreTabla, idAnalisis);

    return res.json(promedioVelocidadResult);
};
const promedioFertilizacionDosisReal = async (req, res) => {
    const idAnalisis = req.params.idAnalisis;
    const promedioFertilizacionDosisRealResult = await DashboardModel.promedioFertilizacionDosisQuery(idAnalisis);
    return res.json(promedioFertilizacionDosisRealResult);
}
const promedioAlturaGps = async(req,res)=>{
    const idAnalisis = req.params.idAnalisis;
    const promedioAlturaGpsResult = await DashboardModel.promedioAlturaGpsQuery(idAnalisis);
    return res.json(promedioAlturaGpsResult);
}
const tiempoTotalActividad = async(req, res) =>{
    const nombreTabla = req.params.nombreTabla;
    const idAnalisis = req.params.idAnalisis;
    const tiempoTotlActividadResult = await DashboardModel.tiempoTotalActividadQuery(nombreTabla, idAnalisis);
    return res.json(tiempoTotlActividadResult);

}
const eficiencia = async(req, res) =>{
    const nombreTabla = req.params.nombreTabla;
    const idAnalisis = req.params.idAnalisis;
    const eficidenciaResult = await DashboardModel.eficienciaQuery(nombreTabla, idAnalisis);
    return res.json(eficidenciaResult);
}
const presionContadorBase = async(req, res)=>{
    const idAnalisis = req.params.idAnalisis;
    const presionContadorBaseResult = await DashboardModel.presionContadorBaseQuery(idAnalisis);
    return res.json(presionContadorBaseResult);
}
const promedioTch = async(req, res) =>{
    const nombreTabla = req.params.nombreTabla;
    const idAnalisis = req.params.idAnalisis;
    const promedioTchResult = await DashboardModel.promedioTchQuery(nombreTabla, idAnalisis);
    return res.json(promedioTchResult);
}
const operador = async(req, res) =>{
    const nombreTabla = req.params.nombreTabla;
    const idAnalisis = req.params.idAnalisis;
    const operadorResult = await DashboardModel.operadorQuery(nombreTabla, idAnalisis);
    return res.json(operadorResult);
}
const fechaActividad = async(req,res)=>{
    const nombreTabla = req.params.nombreTabla;
    const idAnalisis = req.params.idAnalisis;
    const fechaActividadResult = await DashboardModel.fechaActividadQuery(nombreTabla, idAnalisis);
    return res.json(fechaActividadResult);
}
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

const execPython = (req, res) => {
    const idUsuario = req.params.idUsuario;
    const idAnalisis = req.params.idAnalisis;

    exec(`python3 /ruta/tu_archivo_python.py ${idUsuario} ${idAnalisis}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send(`Error executing script: ${error.message}`);
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res.send('Script executed successfully');
    });
}

module.exports = {
    promedioVelocidad,
    promedioFertilizacionDosisReal,
    promedioAlturaGps,
    tiempoTotalActividad,
    eficiencia,
    presionContadorBase,
    promedioTch,
    operador,
    fechaActividad,
    obtenerUltimoAnalisis,
    execBash,
    execPython
};
