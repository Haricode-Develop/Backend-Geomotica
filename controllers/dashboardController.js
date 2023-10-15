const DashboardModel = require('../models/dashboard');
const {exec} = require('child_process');
const promedioVelocidad = async (req, res) => {
    const nombreTabla = req.params.nombreTabla;

    const promedioVelocidadResult = await DashboardModel.promedioVelocidadQuery(nombreTabla);

    return res.json(promedioVelocidadResult);
};
const promedioFertilizacionDosisReal = async (req, res) => {
    const promedioFertilizacionDosisRealResult = await DashboardModel.promedioFertilizacionDosisQuery();
    return res.json(promedioFertilizacionDosisRealResult);
}
const promedioAlturaGps = async(req,res)=>{
    const promedioAlturaGpsResult = await DashboardModel.promedioAlturaGpsQuery();
    return res.json(promedioAlturaGpsResult);
}
const tiempoTotalActividad = async(req, res) =>{
    const nombreTabla = req.params.nombreTabla;
    const tiempoTotlActividadResult = await DashboardModel.tiempoTotalActividadQuery(nombreTabla);
    return res.json(tiempoTotlActividadResult);

}
const eficiencia = async(req, res) =>{
    const nombreTabla = req.params.nombreTabla;
    const eficidenciaResult = await DashboardModel.eficienciaQuery(nombreTabla);
    return res.json(eficidenciaResult);
}
const presionContadorBase = async(req, res)=>{
    const presionContadorBaseResult = await DashboardModel.presionContadorBaseQuery();
    return res.json(presionContadorBaseResult);
}
const promedioTch = async(req, res) =>{
    const nombreTabla = req.params.nombreTabla;
    const promedioTchResult = await DashboardModel.promedioTchQuery(nombreTabla);
    return res.json(promedioTchResult);
}
const operador = async(req, res) =>{
    const nombreTabla = req.params.nombreTabla;
    const operadorResult = await DashboardModel.operadorQuery(nombreTabla);
    return res.json(operadorResult);
}
const fechaActividad = async(req,res)=>{
    const nombreTabla = req.params.nombreTabla;
    const fechaActividadResult = await DashboardModel.fechaActividadQuery(nombreTabla);
    return res.json(fechaActividadResult);
}
const execBash = (req, res) =>{
    exec('bash /geomotica/init_analisis.sh', (errorm ,stdout, stderr) =>{
        if(error){
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
    execBash
};
