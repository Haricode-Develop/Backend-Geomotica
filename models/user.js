const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
    host: '',
    user: '',
    database: '',
    password: '',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const findByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM Usuarios WHERE CorreoElectronico = ?', [email]);
    return rows[0];
}

const verifyPassword = async (inputPassword, hash) => {
    return await bcrypt.compare(inputPassword, hash);
}

module.exports = {
    findByEmail,
    verifyPassword
};
