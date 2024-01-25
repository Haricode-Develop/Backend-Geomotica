// validaciones.js

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
    if (valor === 'disengaged' || valor === 'engaged') {
        return valPilotAuto;
    }
    throw new Error(`Piloto automático inválido: ${valPilotAuto}`);
}

function validarAutoTracket(valAutoTrack) {
    const valor = valAutoTrack.toLowerCase().trim();
    if (valor === 'manual' || valor === 'automatic') {
        return valAutoTrack;
    }
    throw new Error(`Auto track inválido: ${valAutoTrack}`);
}

module.exports = {
    validarLatitud,
    validarLongitud,
    validarPilotoAutomatico,
    validarAutoTracket
};
