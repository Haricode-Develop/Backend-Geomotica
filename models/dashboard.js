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
const promedioVelocidadQuery = async (nombreTabla)=>{
    const query = `SELECT ROUND(AVG(VELOCIDAD_Km_H), 2) AS Promedio_Velocidad_Km_H, ROUND(AVG(VELOCIDAD_Km_H / 3.6),2) AS Promedio_Velocidad_m_s FROM ${nombreTabla}`;
    const [rows] = await pool.query(query);
    return rows[0];
}
const promedioFertilizacionDosisQuery = async() =>{
    const query = `SELECT ROUND(AVG(DOSIS_REAL_Kg_ha), 2) AS Promedio_Dosis_Real_Kg_Ha FROM fertilizacion`;
    const [rows]  = await pool.query(query);
    return rows[0];
}
const promedioAlturaGpsQuery = async() =>{
    const query = `SELECT ROUND(AVG(ALTURA_GPS_m), 2) AS Promedio_Altura_m FROM fertilizacion`;
    const [rows] = await pool.query(query);
    return rows[0];
}
const tiempoTotalActividadQuery = async(nombreTabla) =>{
    const query =`SELECT SUM(TIMESTAMPDIFF(HOUR, CONCAT(FECHA_INICIO, ' ', HORA_INICIO), CONCAT(FECHA_FINAL, ' ', HORA_FINAL))) AS Tiempo_Total_Horas FROM ${nombreTabla}`;
    const [rows] = await pool.query(query);
    return rows[0];
}
const eficienciaQuery = async(nombreTabla) =>{
    const query =`SELECT ROUND((SUM(TIMESTAMPDIFF(HOUR, CONCAT(FECHA_INICIO, ' ', HORA_INICIO), CONCAT(FECHA_FINAL, ' ', HORA_FINAL))) / SUM(AREA_NETA_Ha)),2) AS Eficiencia FROM ${nombreTabla}`;
    const [rows] = await pool.query(query);
    return rows[0];
}
const presionContadorBaseQuery = async() =>{
    const query = `SELECT  ROUND(AVG(PRESION_DE_CORTADOR_BASE), 2) AS Promedio_Presion_Cortador_Base_Bar FROM cosecha_mecanica`;
    const[rows] = await pool.query(query);
    return rows[0];
}
const promedioTchQuery = async(nombreTabla) =>{
    const query = `SELECT ROUND(AVG(TCH), 2) as 'Promedio_TCH_herbicidas' FROM ${nombreTabla}`;
    const[rows] =  await pool.query(query);
    return rows[0];
}
const operadorQuery = async(nombreTabla) =>{
    const query = `SELECT DISTINCT OPERADOR as 'Operadores_${nombreTabla}' FROM ${nombreTabla}`;
    const [rows] = await pool.query(query);
    return rows[0];
}
const fechaActividadQuery = async(nombreTabla) =>{
    const query = `
        SELECT
            DATE_FORMAT(FECHA_INICIO, '%Y-%m-%d') as 'Fecha_Inicio_${nombreTabla}',
                DATE_FORMAT(FECHA_FINAL, '%Y-%m-%d') as 'Fecha_Final_${nombreTabla}'
        FROM (
                 SELECT DISTINCT FECHA_INICIO, FECHA_FINAL
                 FROM ${nombreTabla}
             ) AS subquery;
    `;
    const [rows] = await pool.query(query);
    return rows[0];
}


module.exports = {
    promedioVelocidadQuery,
    promedioFertilizacionDosisQuery,
    promedioAlturaGpsQuery,
    tiempoTotalActividadQuery,
    eficienciaQuery,
    presionContadorBaseQuery ,
    promedioTchQuery,
    operadorQuery,
    fechaActividadQuery
};
