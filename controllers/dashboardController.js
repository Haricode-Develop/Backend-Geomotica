const DashboardModel = require('../models/dashboard');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const io = require('../socket');
let esPrimeraEjecucion = true;
const Papa = require('papaparse');
const validaciones = require('../utils/validacionesMapeo');
const {exec} = require('child_process');
const { Storage } = require('@google-cloud/storage');

const keyFilename = path.join(__dirname, '..', 'analog-figure-382403-c95d79364b3d.json');
const storage = new Storage({ keyFilename: keyFilename });

const bucketName = 'geomotica_mapeo';
const bucket = storage.bucket(bucketName);

const procesarCsv = async (req, res) => {
    const idTipoAnalisis = req.body.idTipoAnalisis;
    // Acceder al primer elemento del array y obtener la propiedad 'path'
    const file = req.files['csv'][0].path;

    console.log("ESTE ES EL PATH QUE ME ESTA TIRANDO ERROR AHORITA: =====****");
    console.log(file);

    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error('Error al leer el archivo:', err);
            return res.status(500).send('Error al procesar el archivo');
        }
        let filaError = 0;
        let errorEncountered = false;
        let processedData = [];
        // Procesa el archivo CSV
        Papa.parse(data, {
            header: false,
            skipEmptyLines: true,
            step: function(row, parser) {
                if (errorEncountered) {
                    return;
                }

                if (filaError === 0) {
                    filaError++;
                    return;
                }
                try {
                    const fila = row.data;
                    if (fila.every(campo => campo === null || campo.match(/^ *$/) !== null)) {
                        return;
                    }
                    fila[0] = validaciones.validarLongitud(fila[0]); // LATITUD VALIDACIÓN
                    fila[1] = validaciones.validarLongitud(fila[1]); // LONGITUD VALIDACIÓN
                    fila[11] = formatearValor(fila[11], 11); // FECHA INICIO COSECHA
                    fila[12] = formatearValor(fila[12], 12); // FECHA INICIO VALIDACIÓN
                    fila[13] = formatearValor(fila[13], 13); // HORA INICIO VALIDACIÓN
                    fila[14] = formatearValor(fila[14], 14); // HORA FINAL VALIDACIÓN
                    const tiempoTotal = validaciones.calcularTiempoTotal(fila[13], fila[14]);
                    fila.splice(15, 0, tiempoTotal);
                    fila[18] = validaciones.validarPilotoAutomatico(fila[18]); // PILOTO VALIDACIÓN
                    fila[19] = validaciones.validarAutoTracket(fila[19]); // AUTO TRACKET VALIDACIÓN

                    fila.push(idTipoAnalisis);

                    processedData.push(fila);
                } catch (error) {
                    errorEncountered = true;
                    parser.abort();
                    res.status(400).json({
                        mensaje: 'Error de validación',
                        error: error.message,
                        fila: filaError,
                    });
                    return;
                }
                filaError++;

            },
            complete: function() {
                if (!errorEncountered) {
                    // Enviar los datos procesados como respuesta JSON
                    res.status(200).json({ mensaje: 'Archivo procesado correctamente', data: processedData });
                }
            },
            error: function(error) {
                console.error('Error al parsear CSV:', error.message);
                res.status(500).json({
                    mensaje: 'Error al parsear CSV',
                    error: error.message
                });
            }
        });
    });
}



function formatearValor(valor, indice) {
    switch (indice) {
        case 11:
        case 12:
            return formatearFecha(valor);
        case 13:
        case 14:
        case 15:
            return formatearHora(valor);

        default:
            return valor;
    }
}

function formatearFecha(fecha) {
    if (fecha === '') return 'NULL';
    const partes = fecha.split('/');
    return `${partes[2]}-${partes[0].padStart(2, '0')}-${partes[1].padStart(2, '0')}`;
}

function formatearHora(hora) {
    if (hora === '') return 'NULL';
    // Aquí puedes agregar lógica de formateo de hora si es necesario
    return hora;
}

const execBash = async (req, res) => {

    console.log("======= EJECUTANDO EL BASH DEL LADO DE NODE.JS ==========");
    console.log("LOG DE PARAMETROS ====");
    console.log(req.params);
    const idUsuario = req.params.idUsuario;
    const idAnalisis = req.params.idAnalisis;
    const idMax = req.params.idMax;
    const lineas = req.params.lineas;
    const offset = req.params.offset;
    const validar = req.params.validar;
    const esPrimeraIteracion = req.body.esPrimeraIteracion === 'true';
    console.log("ES LA PRIMERA ITERACIÓN: ", esPrimeraIteracion);
    if (!req.files['csv'] || !req.files['polygon']) {
        return res.status(400).send('Archivos CSV o polígono no proporcionados');
    }

    const csvPath = req.files['csv'][0].path;
    const polygonPath = req.files['polygon'][0].path;
    console.log("==============================================");
    console.log("PARAMETROS QUE SE LE PASAN AL INIT_ANALISIS: ");
    console.log("ID USUARIO = " + idUsuario);
    console.log("ID ANALISIS = " + idAnalisis);
    console.log("CSV PATH = " + csvPath);
    console.log("PAOLYGON PATH = " + polygonPath);
    console.log("ID MAX = "+ idMax);
    console.log("OFFSET = "+offset);
    console.log("VALIDAR = "+validar);

    console.log("==============================================");
    const totalLines = parseInt(lineas, 10);
    const currentOffset = parseInt(req.params.offset, 10);
    const batchSize = 10000;
    const isLastIteration = (currentOffset + batchSize) >= totalLines;
    try {
        await new Promise((resolve, reject) => {
            let comandoBash = `bash /geomotica/init_analisis.sh ${idUsuario} ${idAnalisis} ${csvPath} ${polygonPath} ${idMax} ${offset} ${validar} ${esPrimeraIteracion}  ${isLastIteration ? 'true' : 'false'}`;

            exec(comandoBash, (error, stdout, stderr) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject(`Error executing script: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                }
                    console.log(`stdout: ${stdout}`);
                    console.log("SE HA EJECUTADO EL EVENTO PARA MOSTRAR EL ANÁLISIS ======");
                    io.getIo().emit('datosInsertados');
                    io.getIo().emit('progressUpdate', { progress: 100, message: 'Carga finalizada' });
                    esPrimeraEjecucion = false;

                resolve();
            });
        });
        res.send('Script executed successfully');
    } catch (error) {
        res.status(500).send(error);
    }
};

const insertarAnalisis = async (req, res) =>{
    try {
        const tipoAnalisis = req.params.tipoAnalisis;
        const idUsuario = req.params.idUsuario;
        const idAnalisisInsertado  = await DashboardModel.insertarAnalisis(tipoAnalisis, idUsuario);
        console.log("ESTE ES EL ANALISIS QUE SE INSERTO =====");
        console.log(idAnalisisInsertado);
        return res.json({ idAnalisis: idAnalisisInsertado });
    }catch (error){
        res.status(500).json({error: 'Error al insertar'})
    }

}
const obtenerUltimoAnalisis = async (req, res) => {
    const tipoAnalisis = req.params.tipoAnalisis;
    const idUsuario = req.params.idUsuario;
    const obtenerUltimoAnalisisResult = await DashboardModel.obtenerUltimoAnalisisQuery(tipoAnalisis, idUsuario);
    console.log("SE OBTIENE EL ULTIMO ANÁLISIS ======");
    console.log(obtenerUltimoAnalisisResult);
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

const NombreResponsableCm = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;

    try {
        const obtenerResponsableCm = await DashboardModel.obtenerNombreResponsableCm(idAnalisis);
        return res.json(obtenerResponsableCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const FechaInicioCosechaCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    try {
    const obtenerFechaIncioCosechaCm = await DashboardModel.obtenerFechaInicioCosechaCm(idAnalisis);
    return res.json(obtenerFechaIncioCosechaCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const FechaFinCosechaCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    try {
    const obtenerFechaFinCosechaCm = await DashboardModel.obtenerFechaFinCosechaCm(idAnalisis);
    return res.json(obtenerFechaFinCosechaCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const NombreFincaCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    try {

        const obtenerNombreFincaCm = await DashboardModel.obtenerNombreFincaCm(idAnalisis);
    return res.json(obtenerNombreFincaCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const CodigoParcelaResponsableCm = async (req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    try {

        const obtenerCodigoParcelaResponsableCm = await DashboardModel.obtenerCodigoParcelasResponsableCm(idAnalisis);
    return res.json(obtenerCodigoParcelaResponsableCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const NombreOperadorCm = async (req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    try {
    const obtenerNombreOperadorCm = await DashboardModel.obtenerNombreOperadorCm(idAnalisis);
    return res.json(obtenerNombreOperadorCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const NombreMaquinaCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    try {
    const obtenerNombreMaquinaCm = await DashboardModel.obtenerNombreMaquinaCm(idAnalisis);
    return res.json(obtenerNombreMaquinaCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}
const consumoCombustibleCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    try{
        const obtenerConsumosCombustibleCm = await DashboardModel.obtenerConsumoCombustibleCm(idAnalisis);
        return res.json(obtenerConsumosCombustibleCm);
    } catch(error){
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }

}

const presionCortadorBaseCm = async(req, res)  =>{
    const idAnalisis = req.params.ID_ANALISIS;
    try{
        const obtenerPresionCortadorBaseCm = await DashboardModel.obtenerPresionCortadorBase(idAnalisis);
        return res.json(obtenerPresionCortadorBaseCm);
    } catch(error){
        console.error("Error al obtener la presion de cortador Base:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const rpmCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    try{
        const obtenerRpmCm = await DashboardModel.obtenerRpmCm(idAnalisis);
        return res.json(obtenerRpmCm);

    } catch(error){
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const tchCm = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    try{
        const obtenerTchCm = await DashboardModel.obtenerTch(idAnalisis);
        return res.json(obtenerTchCm);

    } catch(error){
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const tahCm = async(req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    try{
        const obtenerTahCm = await DashboardModel.obtenerTah(idAnalisis);
        return res.json(obtenerTahCm);

    }catch(error){
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const calidadGpsCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    try{
        const obtenerCalidadGps = await DashboardModel.obtenerCalidadGpsCm(idAnalisis);
        return res.json(obtenerCalidadGps);
    } catch(error){
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({error: "Error interno del servidor"});

    }
}
const ActividadCm = async(req, res)=>{
    const idAnalisis =  req.params.ID_ANALISIS;
    try {
    const obtenerActividadCm = await DashboardModel.obtenerActividadCm(idAnalisis);
    return res.json(obtenerActividadCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const AreaNetaCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    try {

        const obtenerAreaNetaCm = await DashboardModel.obtenerAreaNetaCm(idAnalisis);
    return res.json(obtenerAreaNetaCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const AreaBrutaCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    try {

        const obtenerAreaBrutaCm = await DashboardModel.obtenerAreaBrutaCm(idAnalisis);
    return res.json(obtenerAreaBrutaCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const DiferenciaDeAreaCm = async(req, res) =>{
    const idAnalisis = req.params.ID_ANALISIS;
    try {
        const obtenerDiferenciaDeAreaCm = await DashboardModel.obtenerDiferenciaDeAreaCm(idAnalisis);
    return res.json(obtenerDiferenciaDeAreaCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const HoraInicioCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    try {

        const obtenerHoraInicioCm = await DashboardModel.obtenerHoraInicioCm(idAnalisis);
    return res.json(obtenerHoraInicioCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const HoraFinalCm = async(req, res)=>{
    const idAnalisis =  req.params.ID_ANALISIS;
    try {

        const obtenerHoraFinalCm = await DashboardModel.obtenerHoraFinalCm(idAnalisis);
    return res.json(obtenerHoraFinalCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }

}

const TiempoTotalActividadCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    try {

        const obtenerTiempoTotalActividadCm = await DashboardModel.obtenerTiempoTotalActividadCm(idAnalisis);
    return res.json(obtenerTiempoTotalActividadCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }

}

const EficienciaCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    try {

        const obtenerEficienciaCm = await DashboardModel.obtenerEficienciaCm(idAnalisis);
    return res.json(obtenerEficienciaCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }

}

const PromedioVelocidadCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    try {

        const obtenerPromedioVelocidadCm = await DashboardModel.obtenerPromedioVelocidadCm(idAnalisis);
    return res.json(obtenerPromedioVelocidadCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const PorcentajeAreaPilotoCm = async(req, res) =>{
    const idAnalisis =  req.params.ID_ANALISIS;
    try {

        const obtenerPorcentajeAreaPilotoCm = await DashboardModel.obtenerPorcentajeAreaPilotoCm(idAnalisis);
    return res.json(obtenerPorcentajeAreaPilotoCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
}

const PorcentajeAreaAutoTrackerCm = async(req, res) => {
    const idAnalisis =  req.params.ID_ANALISIS;
    try {

        const obtenerPorcentajeAreaAutoTrackerCm = await DashboardModel.obtenerPorcentajeAreaAutotrackerCm(idAnalisis);
    return res.json(obtenerPorcentajeAreaAutoTrackerCm);
    } catch (error) {
        console.error("Error al obtener el nombre del responsable:", error);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
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

const depositarJsonCosechaMecanica = async (req, res) => {
    const idAnalisis = req.params.ID_ANALISIS;
    const datos = req.body.datos;

    // Convertir los datos a una cadena JSON
    const json = JSON.stringify(datos);
    console.log("El archivo json se va a depositar=========================================================");
    const fileName = `analisis/${idAnalisis}.json`;

    try {
        const file = bucket.file(fileName);

        await file.save(json, {
            metadata: {
                contentType: 'application/json',
            },
        });

        res.status(200).json({ message: 'Archivo JSON subido exitosamente', fileName });
    } catch (error) {
        console.error('Error al subir el archivo JSON:', error);
        res.status(500).json({ message: 'Error al subir el archivo JSON', error: error.message });
    }
};

module.exports = {
    obtenerUltimoAnalisis,
    insertarAnalisis,
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
    calidadGpsCm,
    consumoCombustibleCm,
    presionCortadorBaseCm,
    tahCm,
    tchCm,
    rpmCm,
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
    execBash,
    procesarCsv,
    depositarJsonCosechaMecanica
};
