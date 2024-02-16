// validaciones.js
const moment = require('moment');

function validarLatitud(latitud) {

    const num = parseFloat(latitud);
    if (!isNaN(num) && num >= -90 && num <= 90) {
        return num;
    }
    throw new Error(`Latitud inválida: ${latitud}`);
}

function validarLongitud(longitud) {
    const num = parseFloat(longitud);
    if (!isNaN(num) && num >= -180 && num <= 180) {
        return num;
    }
    throw new Error(`Longitud inválida: ${longitud}`);
}

function validarPilotoAutomatico(valPilotAuto) {

    const valor = valPilotAuto.toLowerCase().trim();
    if (valor === 'manual' || valor === 'automatic') {
        return valPilotAuto;
    }
    throw new Error(`Piloto automático inválido: ${valPilotAuto}`);

}

function validarAutoTracket(valAutoTrack) {


    const valor = valAutoTrack.toLowerCase().trim();
    if (valor === 'disengaged' || valor === 'engaged') {
        return valAutoTrack;
    }
    throw new Error(`Auto track inválido: ${valAutoTrack}`);
}


function calcularTiempoTotal(horaInicio, horaFinal) {
    const formato = 'HH:mm';
    const momentoInicio = moment(horaInicio, formato);
    const momentoFinal = moment(horaFinal, formato);
    // Calcular la diferencia en minutos
    const diferencia = momentoFinal.diff(momentoInicio, 'minutes');
    const horas = Math.floor(diferencia / 60);
    const minutos = diferencia % 60;
    return `${horas}h ${minutos}m`;
}
function calcularTiempoTotal(horaInicio, horaFinal) {
    const [horaIni, minutoIni] = horaInicio.split(':').map(Number);
    const [horaFin, minutoFin] = horaFinal.split(':').map(Number);

    let horaTotal = horaFin - horaIni;
    let minutoTotal = minutoFin - minutoIni;

    if (minutoTotal < 0) {
        minutoTotal += 60; // Ajustar minutos
        horaTotal -= 1; // Ajustar horas
    }

    // Asegurarse de que las horas y minutos tengan dos dígitos
    const horasFormateadas = horaTotal.toString().padStart(2, '0');
    const minutosFormateados = minutoTotal.toString().padStart(2, '0');

    return `${horasFormateadas}:${minutosFormateados}`;
}


module.exports = {
    validarLatitud,
    validarLongitud,
    validarPilotoAutomatico,
    validarAutoTracket,
    calcularTiempoTotal
};
