// validaciones.js

function validarLatitud(latitud) {
    console.log("ESTA ES LA LATITU: "+ latitud);

    const num = parseFloat(latitud);
    if (!isNaN(num) && num >= -90 && num <= 90) {
        return num;
    }
    throw new Error(`Latitud inválida: ${latitud}`);
}

function validarLongitud(longitud) {
    console.log("ESTA ES LA LONGITUD: "+ longitud);
    const num = parseFloat(longitud);
    if (!isNaN(num) && num >= -180 && num <= 180) {
        return num;
    }
    throw new Error(`Longitud inválida: ${longitud}`);
}

function validarPilotoAutomatico(valPilotAuto) {
    console.log("ESTA ES EL PILOTO AUTOMATICO: "+ valPilotAuto);

    const valor = valPilotAuto.toLowerCase().trim();
    if (valor === 'manual' || valor === 'automatic') {
        return valPilotAuto;
    }
    throw new Error(`Piloto automático inválido: ${valPilotAuto}`);

}

function validarAutoTracket(valAutoTrack) {
    console.log("ESTA ES EL PILOTO AUTO TRACKET: "+ valAutoTrack);


    const valor = valAutoTrack.toLowerCase().trim();
    if (valor === 'disengaged' || valor === 'engaged') {
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
