const express = require('express');
const app = express();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { generateAccessToken } = require('../utils/auth/generateToken');

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
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE EMAIL = ?', [email]);
  
      if (rows.length === 0) {
        return null; 
      }
      return rows[0];
    } catch (error) {
      throw error; 
    }
  };
  

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
    await pool.query('CALL sp_insertar_registro(?,?,?,?)', [nombre, apellido, email, hashedPassword]);
}

const insertTemporalPassword = async(email, temporalPassword)=>{
    try {
        const hashedPassword = await bcrypt.hash(temporalPassword, 10);
        await pool.query('CALL sp_insertar_clave_temporal(?, ?)', [email, hashedPassword]);
    } catch (error) {
        throw error;
    }

}
const confirmAccount = async (email) => {
    try {
        await pool.query('CALL sp_update_confirmar_cuenta(?)', [email]);
    } catch (error) {
        throw error;
    }
}

const getUserInfo = async (user) =>{
    return {
      email: user.EMAIL,
      name: user.NOMBRE,
      id: user.ID_USUARIO,
    };
  }


const createAccessToken = async (user) => {
    const payload = await getUserInfo(user);
    return generateAccessToken(payload);
}
const createRefreshToken = async (user) => {
    const payload = await getUserInfo(user);
    return generateRefreshToken(payload);
}


app.use(errorHandler);

module.exports = {
    findByEmail,
    verifyPassword,
    createUser,
    insertTemporalPassword,
    confirmAccount,
    createAccessToken,
    createRefreshToken
};
