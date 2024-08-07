const DashboardModel = require('../models/dashboard');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const io = require('../socket');
const Papa = require('papaparse');
const validaciones = require('../utils/validacionesMapeo');
const { exec } = require('child_process');
const { Storage } = require('@google-cloud/storage');

const keyFilename = path.join(__dirname, '..', 'analog-figure-382403-d8d65817b5d3.json');
const storage = new Storage({ keyFilename: keyFilename });

const bucketName = 'geomotica_mapeo';
const bucket = storage.bucket(bucketName);

const procesarCsv = async (req, res) => {
    const idTipoAnalisis = req.body.idTipoAnalisis;
    const tipoAnalisis = req.body.tipoAnalisis;
    const isExcel = req.body.isExcel === 'true';

    if (!req.files || !req.files['csv'] || !req.files['csv'][0]) {
        console.error('No se encontraron archivos en la solicitud');
        return res.status(400).send('No se encontró ningún archivo para procesar');
    }

    let file = req.files['csv'][0].path;
    console.log("ES EXCEL: ", isExcel);
    if (isExcel) {
        const outputCsvPath = path.join(path.dirname(file), 'output.csv');
        try {
            console.log("ENTRE PARA CONVERTIR EL EXCEL A CSV");
            await convertirExcelACsv(file, outputCsvPath);
            file = outputCsvPath;
        } catch (err) {
            console.error('Error al convertir el archivo Excel a CSV:', err);
            return res.status(500).send('Error al procesar el archivo');
        }
    }
    console.log("DESPUES DEL IF");
    try {
        console.log("ESTE ES EL FILE: ", file);
        const fileContent = fs.readFileSync(file, 'utf8');
        let filaError = 0;
        let processedData = [];
        console.log("FILECONTENT LENGTH: ", fileContent.length);

        if (tipoAnalisis === 'COSECHA_MECANICA') {
            await procesarArchivoCosechaMecanica(idTipoAnalisis, fileContent, filaError, processedData, res);
        } else if (tipoAnalisis === 'APLICACIONES_AEREAS') {
            await procesarArchivoAplicacionesAereas(idTipoAnalisis, fileContent, filaError, processedData, res);
        }
    } catch (err) {
        console.error('Error al leer el archivo:', err);
        return res.status(500).send('Error al procesar el archivo');
    }
};

async function procesarArchivoAplicacionesAereas(idTipoAnalisis, fileContent, filaError, processedData, res) {
    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: false,
            skipEmptyLines: true,
            delimiter: autoDetectDelimiter(fileContent),
            step: function (row, parser) {
                if (filaError === 0) {
                    filaError++;
                    return;
                }
                try {
                    const fila = row.data.map(campo => (campo === undefined || campo === null ? '' : campo.toString().trim()));
                    if (fila.every(campo => campo === '')) {
                        return;
                    }

                    // Validar y formatear los valores de la fila
                    fila[1] = formatearValor(fila[1], 11);
                    fila[2] = formatearValor(fila[2], 12);
                    fila.push(idTipoAnalisis);

                    processedData.push(fila);
                } catch (error) {
                    console.error('Error de validación en la fila:', error.message);
                }
                filaError++;
            },
            complete: function () {
                // Enviar los datos procesados como respuesta JSON
                res.status(200).json({ mensaje: 'Archivo procesado correctamente', data: processedData });
                resolve();
            },
            error: function (error) {
                console.error('Error al parsear CSV:', error.message);
                res.status(500).json({
                    mensaje: 'Error al parsear CSV',
                    error: error.message
                });
                reject(error);
            }
        });
    });
}

async function procesarArchivoCosechaMecanica(idTipoAnalisis, fileContent, filaError, processedData, res) {
    return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
            header: false,
            skipEmptyLines: true,
            delimiter: autoDetectDelimiter(fileContent),
            step: function (row, parser) {
                if (filaError === 0) {
                    filaError++;
                    return;
                }
                try {
                    const fila = row.data.map(campo => (campo === undefined || campo === null ? '' : campo.toString().trim()));
                    if (fila.every(campo => campo === '')) {
                        return;
                    }

                    // Validar y formatear los valores de la fila
                    fila[0] = validaciones.validarLongitud(fila[0]); // LATITUD VALIDACIÓN
                    fila[1] = validaciones.validarLongitud(fila[1]); // LONGITUD VALIDACIÓN
                    fila[11] = formatearValor(fila[11], 11); // FECHA INICIO COSECHA
                    fila[12] = formatearValor(fila[12], 12); // FECHA INICIO VALIDACIÓN
                    fila[13] = formatearValor(fila[13], 13); // HORA INICIO VALIDACIÓN
                    fila[14] = formatearValor(fila[14], 14); // HORA FINAL VALIDACIÓN
                    const tiempoTotal = validaciones.calcularTiempoTotal(fila[13], fila[14]);
                    fila.splice(15, 0, tiempoTotal);

                    fila.push(idTipoAnalisis);

                    processedData.push(fila);
                } catch (error) {
                    console.error('Error de validación en la fila:', error.message);
                }
                filaError++;
            },
            complete: function () {
                // Enviar los datos procesados como respuesta JSON
                res.status(200).json({ mensaje: 'Archivo procesado correctamente', data: processedData });
                resolve();
            },
            error: function (error) {
                console.error('Error al parsear CSV:', error.message);
                res.status(500).json({
                    mensaje: 'Error al parsear CSV',
                    error: error.message
                });
                reject(error);
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
    if (fecha === '') return '';
    const partes = fecha.split('/');
    if (partes.length !== 3 || isNaN(partes[0]) || isNaN(partes[1]) || isNaN(partes[2])) {
        return '';
    }

    let anio = partes[2];
    if (anio.length === 2) {
        anio = `20${anio}`; // Asumiendo que el año es del siglo 21
    }

    return `${anio}-${partes[0].padStart(2, '0')}-${partes[1].padStart(2, '0')}`;
}

function formatearHora(hora) {
    if (hora === '') return '';
    // Aquí puedes agregar lógica de formateo de hora si es necesario
    return hora;
}

const execBash = async (req, res) => {
    const fs = require('fs');
    const path = require('path');
    const { exec } = require('child_process');

    const idUsuario = req.params.idUsuario;
    const idAnalisis = req.params.idAnalisis;
    const idMax = req.params.idMax;
    const lineas = req.params.lineas;
    const offset = req.params.offset;
    const validar = req.params.validar;

    const esPrimeraIteracion = req.body.esPrimeraIteracion === 'true' ? 'true' : 'false';
    const esKmlInteractivo = req.body.esKmlInteractivo === 'true' ? 'true' : 'false';

    if (!req.files['csv'] && idAnalisis === '2') {
        return res.status(400).send('Archivo Csv no propocionado');
    }

    let csvPath = null;
    if (req.files['csv']) {
        csvPath = req.files['csv'][0].path;
        // Verificar y agregar la extensión .gz si es necesario
        if (!csvPath.endsWith('.gz')) {
            const newCsvPath = `${csvPath}.gz`;
            fs.renameSync(csvPath, newCsvPath);
            csvPath = newCsvPath;
        }
    }

    let polygonPath = null;
    if (req.files['polygon']) {
        polygonPath = req.files['polygon'][0].path;
    }

    console.log("==============================================");
    console.log("PARAMETROS QUE SE LE PASAN AL INIT_ANALISIS: ");
    console.log("ID USUARIO = " + idUsuario);
    console.log("ID ANALISIS = " + idAnalisis);
    console.log("CSV PATH = " + csvPath);
    console.log("PAOLYGON PATH = " + polygonPath);
    console.log("ID MAX = " + idMax);
    console.log("OFFSET = " + offset);
    console.log("VALIDAR = " + validar);
    console.log("ES KML INTERACTIVO = " + esKmlInteractivo);
    console.log("==============================================");

    const totalLines = parseInt(lineas, 10);
    const currentOffset = parseInt(req.params.offset, 10);
    const batchSize = 10000;
    const isLastIteration = (currentOffset + batchSize) >= totalLines;

    try {
        await new Promise((resolve, reject) => {
            let comandoBash = `bash /geomotica/init_analisis.sh ${idUsuario} ${idAnalisis} ${csvPath} ${polygonPath} ${idMax} ${offset} ${validar} ${esPrimeraIteracion}  ${isLastIteration ? 'true' : 'false' } ${esKmlInteractivo}`;

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
                io.getIo().emit('datosInsertados');
                io.getIo().emit('progressUpdate', { progress: 100, message: 'Carga finalizada' });
                resolve();
            });
        });
        res.send('Script executed successfully');
    } catch (error) {
        res.status(500).send(error);
    }
};


const insertarAnalisis = async (req, res) => {
    try {
        const tipoAnalisis = req.params.tipoAnalisis;
        const idUsuario = req.params.idUsuario;
        const idAnalisisInsertado = await DashboardModel.insertarAnalisis(tipoAnalisis, idUsuario);

        return res.json({ idAnalisis: idAnalisisInsertado });
    } catch (error) {
        res.status(500).json({ error: 'Error al insertar' });
    }
};

function autoDetectDelimiter(fileContent) {
    // Lógica para detectar automáticamente el delimitador
    const delimiters = [',', ';', '\t', '|'];
    let detectedDelimiter = ',';
    let maxCount = 0;

    delimiters.forEach(delimiter => {
        const count = fileContent.split(delimiter).length;
        if (count > maxCount) {
            maxCount = count;
            detectedDelimiter = delimiter;
        }
    });

    return detectedDelimiter;
}

const obtenerUltimoAnalisis = async (req, res) => {
    const tipoAnalisis = req.params.tipoAnalisis;
    const idUsuario = req.params.idUsuario;
    const obtenerUltimoAnalisisResult = await DashboardModel.obtenerUltimoAnalisisQuery(tipoAnalisis, idUsuario);

    return res.json(obtenerUltimoAnalisisResult);
};


async function convertirExcelACsv(inputFilePath, outputFilePath) {
    try {
        const workbook = XLSX.readFile(inputFilePath);
        const sheet_name_list = workbook.SheetNames;
        if (sheet_name_list.length === 0) {
            throw new Error('El archivo Excel no contiene ninguna hoja.');
        }
        const csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheet_name_list[0]]);
        if (!csv) {
            throw new Error('La conversión a CSV falló o el archivo CSV resultante está vacío.');
        }
        fs.writeFileSync(outputFilePath, csv);
        console.log('Conversión de Excel a CSV completada.');
    } catch (error) {
        console.error('Error al convertir el archivo Excel a CSV:', error);
        throw error;
    }
}


module.exports = {
    obtenerUltimoAnalisis,
    insertarAnalisis,
    execBash,
    procesarCsv,
};