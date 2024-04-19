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
            CASE
                WHEN a.TIPO_ANALISIS = 'cosecha_mecanica' THEN GROUP_CONCAT(DISTINCT cm.NOMBRE_FINCA ORDER BY cm.NOMBRE_FINCA ASC)
                WHEN a.TIPO_ANALISIS = 'aps' THEN GROUP_CONCAT(DISTINCT aps.NOMBRE_FINCA ORDER BY aps.NOMBRE_FINCA ASC)
                WHEN a.TIPO_ANALISIS = 'fertilizacion' THEN GROUP_CONCAT(DISTINCT f.NOMBRE_FINCA ORDER BY f.NOMBRE_FINCA ASC)
                WHEN a.TIPO_ANALISIS = 'herbicidas' THEN GROUP_CONCAT(DISTINCT h.NOMBRE_FINCA ORDER BY h.NOMBRE_FINCA ASC)
                END AS NOMBRES_FINCA
        FROM
            analisis a
                LEFT JOIN cosecha_mecanica cm ON a.ID_ANALISIS = cm.ID_ANALISIS AND a.TIPO_ANALISIS = 'cosecha_mecanica'
                LEFT JOIN aps ON a.ID_ANALISIS = aps.ID_ANALISIS AND a.TIPO_ANALISIS = 'aps'
                LEFT JOIN fertilizacion f ON a.ID_ANALISIS = f.ID_ANALISIS AND a.TIPO_ANALISIS = 'fertilizacion'
                LEFT JOIN herbicidas h ON a.ID_ANALISIS = h.ID_ANALISIS AND a.TIPO_ANALISIS = 'herbicidas'
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
WHERE ID_ANALISIS = ?;    
    `;

    console.log("ESTE ES EL ID DEL ANALISIS", idAnalisis);
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows;
}


module.exports = {
    obtenerAnalisisUsuarios, obtenerUltimosValores
}