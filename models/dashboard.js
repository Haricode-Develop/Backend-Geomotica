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

const insertarAnalisis = async (usuario, tipoAnalisis) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Insertar en la tabla análisis
        const insertQuery = `INSERT INTO analisis (id_usuario, tipo_analisis) VALUES (?, ?)`;
        console.log("ESTA ES LA QUERY SE INSERT ======");
        console.log(insertQuery);
        await connection.execute(insertQuery, [usuario, tipoAnalisis]);

        // Obtener el ID máximo para el tipo de análisis especificado
        const selectQuery = `SELECT MAX(ID_ANALISIS) FROM analisis WHERE TIPO_ANALISIS = ?`;
        console.log("ESTA ES LA QUERY DE SELECT ======");
        console.log(selectQuery);
        const [rows] = await connection.execute(selectQuery, [tipoAnalisis]);
        console.log("ESTE ES EL REULTADO QUE NECESITO VER =======");
        console.log(rows);
        await connection.commit();
        return rows[0]['MAX(ID_ANALYSIS)'];
    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('Error al insertar en la tabla análisis:', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
};
const obtenerUltimoAnalisisQuery = async (tipoAnalisis, usuario) =>{
    console.log("OBTENIENDO EL ULTIMO ANALISIS =========");
    console.log("TIPO ANALISIS:");
    console.log(tipoAnalisis);
    console.log("USUARIO:");
    console.log(usuario);
    console.log("=========");

    const query = `
        SELECT 
            MAX(ID_ANALISIS) AS ID_ANALISIS
        FROM analisis 
        WHERE TIPO_ANALISIS = '${tipoAnalisis}'
        AND ID_USUARIO = ${usuario}; 
    `;
    console.log("ULTIMO ANALISIS QUERY ========");
    console.log(query);
    const [rows] = await pool.query(query);
    console.log(rows);
    return rows[0];
}

/*==============================================
* ENDPOINTS INFORME APS
* =============================================*/

const obtenerNombreResponsableAps = async (idAnalisis) =>{
    const query =`
    SELECT DISTINCT RESPONSABLE AS responsable
        FROM aps
        WHERE ID_ANALISIS = ${idAnalisis};
    `;
    const [rows] = await pool.query(query);
    return rows[0];

};
const obtenerFechaInicioCosechaAps = async (idAnalisis) =>{

    const query =  `SELECT DISTINCT FECHA_INICIO FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query,[idAnalisis] );

    return rows.map(row => row.FECHA_INICIO);

}
const obtenerFechaFinalCosechaAps = async (idAnalisis) => {
    const query = `SELECT DISTINCT FECHA_FINAL FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.FECHA_FINAL);
};

const obtenerNombreFincaAps = async (idAnalisis) => {
    const query = `SELECT NOMBRE_FINCA FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.NOMBRE_FINCA);
};

const obtenerCodigoParcelasResponsableAps = async (idAnalisis) => {
    const query = `SELECT DISTINCT PARCELA FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.PARCELA);
};

const obtenerNombreOperadorAps = async (idAnalisis) => {
    const query = `SELECT DISTINCT OPERADOR FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.OPERADOR);
};

const obtenerEquipoAps = async (idAnalisis) => {
    const query = `SELECT DISTINCT EQUIPO FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.EQUIPO);
};

const obtenerActividadAps = async (idAnalisis) => {
    const query = `SELECT DISTINCT ACTIVIDAD FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.ACTIVIDAD);
};

const obtenerAreaNetaAps = async (idAnalisis) => {
    const query = `SELECT DISTINCT AREA_NETA FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.AREA_NETA);
};

const obtenerAreaBrutaAps = async (idAnalisis) => {
    const query = `SELECT DISTINCT AREA_BRUTA FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.AREA_BRUTA);
};

const obtenerDiferenciaEntreAreasAps = async (idAnalisis) => {
    const query = `SELECT DISTINCT DIFERENCIA_DE_AREA FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.DIFERENCIA_DE_AREA);
};

const obtenerHoraInicioAps = async (idAnalisis) => {
    const query = `SELECT DISTINCT HORA_INICIO FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.HORA_INICIO);
};

const obtenerHoraFinalAps = async (idAnalisis) => {
    const query = `SELECT DISTINCT HORA_FINAL FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.HORA_FINAL);
};

const obtenerTiempoTotalActividadAps = async (idAnalisis) => {
    const query = `SELECT DISTINCT TIEMPO_TOTAL FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.TIEMPO_TOTAL);
};

const obtenerEficienciaAps = async (idAnalisis) => {
    const query = `SELECT DISTINCT EFICIENCIA FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.EFICIENCIA);
};

const obtenerPromedioVelocidadAps = async (idAnalisis) => {
    const query = `SELECT ROUND(AVG(VELOCIDAD_Km_H), 2) AS promedioVelocidad FROM aps WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows[0].promedioVelocidad;
};

/*==============================================
* ENDPOINTS INFORME COSECHA_MECANICA
* =============================================*/


const obtenerNombreResponsableCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT RESPONSABLE FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.RESPONSABLE);
};


const obtenerFechaInicioCosechaCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT FECHA_INICIO FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.FECHA_INICIO);
};

const obtenerFechaFinCosechaCm = async(idAnalisis) =>{
    const query = `SELECT DISTINCT FECHA_FINAL FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.FECHA_FINAL);
}

const obtenerNombreFincaCm = async (idAnalisis) => {
    const query = `SELECT NOMBRE_FINCA FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.NOMBRE_FINCA);
};

const obtenerCodigoParcelasResponsableCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT PARCELA FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.PARCELA);
};

const obtenerNombreOperadorCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT OPERADOR FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.OPERADOR);
};

const obtenerNombreMaquinaCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT CODIGO_DE_MAQUINA FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.CODIGO_DE_MAQUINA);
};

const obtenerActividadCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT ACTIVIDAD FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.ACTIVIDAD);
};

const obtenerAreaNetaCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT AREA_NETA FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.AREA_NETA);
};

const obtenerAreaBrutaCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT AREA_BRUTA FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.AREA_BRUTA);
};

const obtenerDiferenciaDeAreaCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT DIFERENCIA_DE_AREA FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.DIFERENCIA_DE_AREA);
};

const obtenerHoraInicioCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT HORA_INICIO FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.HORA_INICIO);
};

const obtenerHoraFinalCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT HORA_FINAL FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.HORA_FINAL);
};

const obtenerTiempoTotalActividadCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT TIEMPO_TOTAL FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.TIEMPO_TOTAL);
};

const obtenerEficienciaCm = async (idAnalisis) => {
    const query = `SELECT DISTINCT EFICIENCIA FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.EFICIENCIA);
};

const obtenerPromedioVelocidadCm = async (idAnalisis) => {
    const query = `SELECT ROUND(AVG(VELOCIDAD_Km_H), 2) AS promedioVelocidad FROM cosecha_mecanica WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows[0].promedioVelocidad;
};

const obtenerPorcentajeAreaPilotoCm = async () => {
    const query = `
    SELECT SUM(CASE WHEN PILOTO_AUTOMATICO = 'SI' THEN AREA_NETA ELSE 0 END) / SUM(AREA_NETA) * 100 AS "PILOTO_AUTOMATICO"
    FROM cosecha_mecanica;
  `;
    const [rows] = await pool.query(query);
    return rows[0]["PILOTO_AUTOMATICO"];
};

const obtenerPorcentajeAreaAutotrackerCm = async () => {
    const query = `
    SELECT SUM(CASE WHEN AUTO_TRACKET  = 'SI' THEN AREA_NETA ELSE 0 END) / SUM(AREA_NETA) * 100 AS "AUTOTRACKER"
    FROM cosecha_mecanica;
  `;
    const [rows] = await pool.query(query);
    return rows[0]["% De area con Piloto automatico activo"];
};

/*==============================================
* ENDPOINTS INFORME FERTILIZACIÓN
* =============================================*/

const obtenerResponsableFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT RESPONSABLE FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.RESPONSABLE);
};

const obtenerFechaInicioFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT FECHA_INICIO FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.FECHA_INICIO);
};
const obtenerFechaFinalFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT FECHA_FINAL FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.FECHA_FINAL);
};

const obtenerNombreFincaFertilizacion = async (idAnalisis) => {
    const query = `SELECT NOMBRE_FINCA FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.NOMBRE_FINCA);
};

const obtenerParcelaFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT PARCELA FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.PARCELA);
};

const obtenerOperadorFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT OPERADOR FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.OPERADOR);
};

const obtenerEquipoFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT EQUIPO FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.EQUIPO);
};

const obtenerActividadFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT ACTIVIDAD FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.ACTIVIDAD);
};

const obtenerAreaNetaFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT AREA_NETA FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.AREA_NETA);
};

const obtenerAreaBrutaFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT AREA_BRUTA FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.AREA_BRUTA);
};

const obtenerDiferenciaAreaFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT DIFERENCIA_DE_AREA_Ha FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.DIFERENCIA_DE_AREA_Ha);
};

const obtenerHoraInicioFertilizacion = async (idAnalisis) => {
    // Nota: La columna parece ser DIFERENCIA_DE_AREA_Ha, confirma si es correcto o debería ser HORA_INICIO
    const query = `SELECT DISTINCT HORA_INICIO FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.HORA_INICIO);
};

const obtenerHoraFinalFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT HORA_FINAL FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.HORA_FINAL);
};

const obtenerTiempoTotalFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT TIEMPO_TOTAL_H FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.TIEMPO_TOTAL_H);
};

const obtenerEficienciaFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT EFICIENCIA_Hora_Ha FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.EFICIENCIA_Hora_Ha);
};

const obtenerPromedioVelocidadFertilizacion = async (idAnalisis) => {
    const query = `SELECT ROUND(AVG(VELOCIDAD_Km_H), 2) AS promedioVelocidad FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows[0]?.promedioVelocidad || null; // Retorna null si no hay resultados
};

const obtenerPromedioDosisRealFertilizacion = async (idAnalisis) => {
    const query = `SELECT ROUND(AVG(DOSIS_REAL_Kg_ha),2) AS promedioDosisReal FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows[0]?.promedioDosisReal || null; // Retorna null si no hay resultados
};

const obtenerDosisTeoricaFertilizacion = async (idAnalisis) => {
    const query = `SELECT DISTINCT DOSIS_TEORICA_Kg_ha FROM fertilizacion WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.DOSIS_TEORICA_Kg_ha);
};

/*==============================================
* ENDPOINTS INFORME HERBICIDAS
* =============================================*/
const obtenerResponsableHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT RESPONSABLE FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.RESPONSABLE);
};

const obtenerFechaHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT FECHA_FINAL FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.FECHA_FINAL);
};

const obtenerNombreFincaHerbicidas = async (idAnalisis) => {
    const query = `SELECT NOMBRE_FINCA FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.NOMBRE_FINCA);
};

const obtenerParcelaHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT PARCELA FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.PARCELA);
};

const obtenerOperadorHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT OPERADOR FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.OPERADOR);
};

const obtenerEquipoHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT EQUIPO FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.EQUIPO);
};

const obtenerActividadHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT ACTIVIDAD FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.ACTIVIDAD);
};

const obtenerAreaNetaHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT AREA_NETA FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.AREA_NETA);
};

const obtenerAreaBrutaHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT AREA_BRUTA FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.AREA_BRUTA);
};

const obtenerDiferenciaDeAreaHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT DIFERENCIA_DE_AREA_Ha FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.DIFERENCIA_DE_AREA_Ha);
};

// Nota: Esta consulta parece tener un error. Debería ser HORA_INICIO en lugar de DIFERENCIA_DE_AREA_Ha.
const obtenerHoraInicioHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT HORA_INICIO FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.HORA_INICIO);
};

const obtenerHoraFinalHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT HORA_FINAL FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.HORA_FINAL);
};

const obtenerTiempoTotalHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT TIEMPO_TOTAL_H FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.TIEMPO_TOTAL_H);
};

const obtenerEficienciaHerbicidas = async (idAnalisis) => {
    const query = `SELECT DISTINCT EFICIENCIA_Hora_Ha FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows.map(row => row.EFICIENCIA_Hora_Ha);
};

const obtenerPromedioVelocidadHerbicidas = async (idAnalisis) => {
    const query = `SELECT ROUND(AVG(VELOCIDAD_Km_H), 2) AS promedioVelocidad FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows[0]?.promedioVelocidad || null;
};

// Nota: Esta consulta necesita la columna adecuada para calcular la AVG(). Asegúrate de reemplazar 'COLUMN_NAME' con el nombre correcto de la columna.
const obtenerPromedioDosisRealAplicadaHerbicidas = async (idAnalisis) => {
    const query = `SELECT ROUND(AVG(COLUMN_NAME), 2) AS promedioDosisReal FROM herbicidas WHERE ID_ANALISIS = ?;`;
    const [rows] = await pool.query(query, [idAnalisis]);
    return rows[0]?.promedioDosisReal || null;
};

module.exports = {
    insertarAnalisis,
    // ===== APS ======
    obtenerUltimoAnalisisQuery,
    obtenerNombreResponsableAps,
    obtenerFechaInicioCosechaAps,
    obtenerFechaFinalCosechaAps,
    obtenerNombreFincaAps,
    obtenerCodigoParcelasResponsableAps,
    obtenerNombreOperadorAps,
    obtenerEquipoAps,
    obtenerActividadAps,
    obtenerAreaNetaAps,
    obtenerAreaBrutaAps,
    obtenerDiferenciaEntreAreasAps,
    obtenerHoraInicioAps,
    obtenerHoraFinalAps,
    obtenerTiempoTotalActividadAps,
    obtenerEficienciaAps,
    obtenerPromedioVelocidadAps,

    // ===== COSECHA MECÁNICA ======
    obtenerNombreResponsableCm,
    obtenerFechaInicioCosechaCm,
    obtenerFechaFinCosechaCm,
    obtenerNombreFincaCm,
    obtenerCodigoParcelasResponsableCm,
    obtenerNombreOperadorCm,
    obtenerNombreMaquinaCm,
    obtenerActividadCm,
    obtenerAreaNetaCm,
    obtenerAreaBrutaCm,
    obtenerDiferenciaDeAreaCm,
    obtenerHoraInicioCm,
    obtenerHoraFinalCm,
    obtenerTiempoTotalActividadCm,
    obtenerEficienciaCm,
    obtenerPromedioVelocidadCm,
    obtenerPorcentajeAreaPilotoCm,
    obtenerPorcentajeAreaAutotrackerCm,
    // ===== FERTILIZACIÓN ======
    obtenerResponsableFertilizacion,
    obtenerFechaInicioFertilizacion,
    obtenerFechaFinalFertilizacion,
    obtenerNombreFincaFertilizacion,
    obtenerParcelaFertilizacion,
    obtenerOperadorFertilizacion,
    obtenerEquipoFertilizacion,
    obtenerActividadFertilizacion,
    obtenerAreaNetaFertilizacion,
    obtenerAreaBrutaFertilizacion,
    obtenerDiferenciaAreaFertilizacion,
    obtenerHoraInicioFertilizacion,
    obtenerHoraFinalFertilizacion,
    obtenerTiempoTotalFertilizacion,
    obtenerEficienciaFertilizacion,
    obtenerPromedioVelocidadFertilizacion,
    obtenerPromedioDosisRealFertilizacion,
    obtenerDosisTeoricaFertilizacion,
    // ======= Herbicidas =======
    obtenerResponsableHerbicidas,
    obtenerFechaHerbicidas,
    obtenerNombreFincaHerbicidas,
    obtenerParcelaHerbicidas,
    obtenerOperadorHerbicidas,
    obtenerEquipoHerbicidas,
    obtenerActividadHerbicidas,
    obtenerAreaNetaHerbicidas,
    obtenerAreaBrutaHerbicidas,
    obtenerDiferenciaDeAreaHerbicidas,
    obtenerHoraInicioHerbicidas,
    obtenerHoraFinalHerbicidas,
    obtenerTiempoTotalHerbicidas,
    obtenerEficienciaHerbicidas,
    obtenerPromedioVelocidadHerbicidas,

};
