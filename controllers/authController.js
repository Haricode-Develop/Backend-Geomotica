const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const isValidPassword = await UserModel.verifyPassword(password, user.Contraseña);
    if (!isValidPassword) {
        return res.status(403).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ userId: user.UserID }, '', { expiresIn: '1h' });
    return res.json({ token, userId: user.UserID });
};

module.exports = {
    login
};
