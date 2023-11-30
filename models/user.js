const express = require('express');
const app = express();
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

const findByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE EMAIL = ?', [email]);
    return rows[0];
}

const verifyPassword = async (inputPassword, hash) => {
    return await bcrypt.compare(inputPassword, hash);
}

// Middleware para manejo de errores
function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Algo salió mal');
}

const createUser = async (nombre, apellido, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
    await pool.query('INSERT INTO usuarios (NOMBRE, APELLIDO, EMAIL, PASSWORD, FOTO_PERFIL) VALUES (?, ?, ?, ?, "")', [nombre, apellido, email, hashedPassword]);
}

const createTemporalPassword = async()=>{
    
}

app.use(errorHandler);

module.exports = {
    findByEmail,
    verifyPassword,
    createUser
};
