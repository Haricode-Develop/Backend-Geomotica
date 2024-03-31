const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


const obtenerAnalisisUsuarios = async (usuario) => {
    const query = `
        SELECT
            a.ID_ANALISIS,
            a.ID_USUARIO,
            a.TIPO_ANALISIS,
            a.FECHA_CREACION,
            GROUP_CONCAT(DISTINCT cm.NOMBRE_FINCA ORDER BY cm.NOMBRE_FINCA ASC SEPARATOR ', ') AS NOMBRES_FINCA
        FROM
            analisis a
                JOIN
            cosecha_mecanica cm ON a.ID_ANALISIS = cm.ID_ANALISIS
        WHERE
            a.ID_USUARIO = ?
        GROUP BY
            a.ID_ANALISIS;
    `;
    const [rows] = await pool.query(query, [usuario]);
    return rows;
}

const obtenerUltimosValores = async (idAnalisis)  => {
    const query  = `    
    SELECT PILOTO_AUTOMATICO,
       AUTO_TRACKET,
       MODO_CORTE_BASE,
       VELOCIDAD_ACTIVADO,
       VELOCIDAD_BAJO,
       VELOCIDAD_MEDIO,
       VELOCIDAD_ALTO,
       CALIDAD_GPS_ACTIVADO,
       CALIDAD_GPS_BAJO,
       CALIDAD_GPS_MEDIO,
       CALIDAD_GPS_ALTO,
       COMBUSTIBLE_ACTIVADO,
       COMBUSTIBLE_BAJO,
       COMBUSTIBLE_MEDIO,
       COMBUSTIBLE_ALTO,
       RPM_ACTIVADO,
       RPM_BAJO,
       RPM_MEDIO,
       RPM_ALTO,
       PRESION_CORTADOR_BASE_ACTIVADO,
       PRESION_CORTADOR_BASE_BAJO,
       PRESION_CORTADOR_BASE_MEDIO,
       PRESION_CORTADOR_BASE_ALTO,
       FECHA_CREACION
FROM configuraciones_formulario
WHERE ID_ANALISIS = 2;    
    `;

    const [rows] = await pool.query(query, [idAnalisis]);
    return rows;
}


module.exports = {
    obtenerAnalisisUsuarios, obtenerUltimosValores
}