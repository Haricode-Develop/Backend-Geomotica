const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promedioVelocidadQuery = async (nombreTabla, idAnalisis) => {
    const query = `
        SELECT 
            ROUND(AVG(VELOCIDAD_Km_H), 2) AS Promedio_Velocidad_Km_H,
            ROUND(AVG(VELOCIDAD_Km_H / 3.6), 2) AS Promedio_Velocidad_m_s 
        FROM ${nombreTabla} WHERE ID_ANALISIS = ${idAnalisis}
    `;
    const [rows] = await pool.query(query);
    return rows[0];
}

const promedioFertilizacionDosisQuery = async (idAnalisis) => {
    const query = `
        SELECT 
            ROUND(AVG(DOSIS_REAL_Kg_ha), 2) AS Promedio_Dosis_Real_Kg_Ha 
        FROM fertilizacion WHERE ID_ANALISIS = ${idAnalisis}
    `;
    console.log(query);
    const [rows] = await pool.query(query);
    return rows[0];
}

const promedioAlturaGpsQuery = async (idAnalisis) => {
    const query = `
        SELECT 
            ROUND(AVG(ALTURA_GPS_m), 2) AS Promedio_Altura_m 
        FROM fertilizacion WHERE ID_ANALISIS = ${idAnalisis}
    `;
    const [rows] = await pool.query(query);
    return rows[0];
}

const tiempoTotalActividadQuery = async (nombreTabla, idAnalisis) => {
    const query = `
        SELECT 
            SUM(TIMESTAMPDIFF(HOUR, CONCAT(FECHA_INICIO, ' ', HORA_INICIO), CONCAT(FECHA_FINAL, ' ', HORA_FINAL))) AS Tiempo_Total_Horas 
        FROM ${nombreTabla} WHERE ID_ANALISIS = ${idAnalisis}
    `;
    const [rows] = await pool.query(query);
    return rows[0];
}

const eficienciaQuery = async (nombreTabla, idAnalisis) => {
    const query = `
        SELECT 
            ROUND((SUM(TIMESTAMPDIFF(HOUR, CONCAT(FECHA_INICIO, ' ', HORA_INICIO), CONCAT(FECHA_FINAL, ' ', HORA_FINAL))) / SUM(AREA_NETA)), 2) AS Eficiencia 
        FROM ${nombreTabla} WHERE ID_ANALISIS = ${idAnalisis}
    `;
    const [rows] = await pool.query(query);
    return rows[0];
}

const presionContadorBaseQuery = async (idAnalisis) => {
    const query = `
        SELECT 
            ROUND(AVG(PRESION_DE_CORTADOR_BASE), 2) AS Promedio_Presion_Cortador_Base_Bar 
        FROM cosecha_mecanica WHERE ID_ANALISIS = ${idAnalisis}
    `;
    const [rows] = await pool.query(query);
    return rows[0];
}

const promedioTchQuery = async (nombreTabla, idAnalisis) => {
    const query = `
        SELECT 
            ROUND(AVG(TCH), 2) AS Promedio_TCH_herbicidas 
        FROM ${nombreTabla} WHERE ID_ANALISIS = ${idAnalisis}
    `;
    const [rows] = await pool.query(query);
    return rows[0];
}

const operadorQuery = async (nombreTabla, idAnalisis) => {
    const query = `
        SELECT DISTINCT 
            OPERADOR AS 'Operadores' 
        FROM ${nombreTabla} WHERE ID_ANALISIS = ${idAnalisis}
    `;
    console.log(operadorQuery);
    const [rows] = await pool.query(query);
    return rows[0];
}
const obtenerUltimoAnalisisQuery = async (tipoAnalisis, usuario) =>{
    const query = `
        SELECT 
            MAX(ID_ANALISIS) AS ID_ANALISIS
        FROM analisis 
        WHERE TIPO_ANALISIS = '${tipoAnalisis}'
        AND ID_USUARIO = ${usuario}; 
    `;
    console.log(query);
    const [rows] = await pool.query(query);
    console.log(rows[0]);
    return rows[0];
}
const fechaActividadQuery = async (nombreTabla, idAnalisis) => {
    const query = `
        SELECT 
            DATE_FORMAT(FECHA_INICIO, '%Y-%m-%d') AS 'Fecha_Inicio',
            DATE_FORMAT(FECHA_FINAL, '%Y-%m-%d') AS 'Fecha_Final' 
        FROM (
            SELECT DISTINCT FECHA_INICIO, FECHA_FINAL 
            FROM ${nombreTabla} WHERE ID_ANALISIS = ${idAnalisis}
        ) AS subquery;
    `;
    console.log(query);
    const [rows] = await pool.query(query);
    return rows[0];
}

module.exports = {
    promedioVelocidadQuery,
    promedioFertilizacionDosisQuery,
    promedioAlturaGpsQuery,
    tiempoTotalActividadQuery,
    eficienciaQuery,
    presionContadorBaseQuery,
    promedioTchQuery,
    operadorQuery,
    fechaActividadQuery,
    obtenerUltimoAnalisisQuery
};