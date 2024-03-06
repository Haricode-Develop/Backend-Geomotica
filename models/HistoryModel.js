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

const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: process.env.GCP_PROJECT_ID,
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

const generateV4ReadSignedUrl = async (bucketName, fileName) => {
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 1 * 60 * 60 * 1000, // 1 hour
    };

    // Obtiene la URL firmada
    const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl(options);
    console.log(`La URL firmada para ${fileName} es ${url}`);
    return url;
};



module.exports = {
    obtenerAnalisisUsuarios,
    generateV4ReadSignedUrl
}