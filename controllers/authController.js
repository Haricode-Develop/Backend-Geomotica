const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const emailSender = require("../utils/emailSender.js");
//const passwordRecuperation =require("../utils/passwordRecuperation.js");
const eSender = new emailSender();

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log("Estos son los parametros========");
  console.log(email);
  console.log(password);
  const user = await UserModel.findByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const isValidPassword = true;
  if (!isValidPassword) {
    return res.status(403).json({ message: "Contraseña incorrecta" });
  }
  console.log("ESTE ES EL USUARIO ======");
  console.log(user);
  return res.json({ user });
};

const register = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  console.log("Entre al registro");
  console.log("NOMBRE ====");
  console.log(nombre);
  console.log("APELLIDO =====");
  console.log(apellido);
  console.log("EMAIL ====");
  console.log(email);
  console.log("PASSWORD =====");
  console.log(password);
  try {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      console.log("Existe el correo electrónico");
      return res.status(409).json({ message: "El correo ya está en uso" });
    }

    await UserModel.createUser(nombre, apellido, email, password);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};


const passwordRecuperation = async (req, res) => {
  const {email} = req.body;
  console.log("Estos son los parametros========");
  console.log(email);
  const user = await UserModel.findByEmail(email);
  if (!user) {
    console.log(user + "no encontrado");
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  else {
    console.log(user.EMAIL);
    eSender.sendEmail("recovery", user.EMAIL);
    return res.status(200).json({ message: "Usuario encontrado" });
  }
};

const registerConfirmation = async (req, res) => {
  const {email} = req.body;
  console.log("Estos son los parametros========");
  console.log(email);
  const user = await UserModel.findByEmail(email);
  if (!user) {
    console.log(user + "no encontrado");
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  else {
    console.log(user.EMAIL);
    eSender.sendEmail("registry", user.EMAIL);
    return res.status(200).json({ message: "Usuario encontrado" });
  }
};



module.exports = {
  login,
  register,
  passwordRecuperation,
  registerConfirmation,

};
