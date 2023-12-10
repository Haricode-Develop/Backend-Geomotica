const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const emailSender = require("../utils/emailSender.js");
const temporalPassword = require("../utils/temporalPassword.js");
//const passwordRecuperation =require("../utils/passwordRecuperation.js");
const eSender = new emailSender();
const tPassword = new temporalPassword();

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findByEmail(email);
  if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const isValidPassword = true;
  if (!isValidPassword) {
    return res.status(403).json({ message: "Contraseña incorrecta" });
  }

  return res.json({ user });
};

const register = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

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

const temporalPasswordGeneration = async (req, res) => {
  const email = req.query.email;
  console.log("Estos son los parametros========");
  console.log(email);
  try {
    eSender.sendEmail("temporal", email);
    return res.status(200).json({ message: `Contraseña temporal generada ${TemporalPassword}` });
  } catch (error) {
    return res.status(500).json({ message: "Error al generar la contraseña temporal" });
  }
}




module.exports = {
  login,
  register,
  passwordRecuperation,
  registerConfirmation,
  temporalPasswordGeneration,
};
