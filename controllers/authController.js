const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const emailSender = require("../utils/emailSender.js");
//const passwordRecuperation =require("../utils/passwordRecuperation.js");
const eSender = new emailSender();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
  console.log("Llega aca con el email "+ email);
    const user = await UserModel.findByEmail(email);
    return res.json({ user });
  } catch (error) {
    return res.error(error);
  }
  /*if (!user) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }
  //nota mental del barryways pasar esto a un SP despues
  if(user.ESTATUS != 1){
    return res.status(403).json({ message: "Usuario no verificado aun, por favor verificar correo" });
  }

  const isValidPassword = true;
  if (!isValidPassword) { 
    return res.status(403).json({ message: "Contraseña incorrecta" });
  }
*/
  
};

const register = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  try {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
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
  const {email} = req.body;
  console.log("Estos son los parametros========");
  console.log(email);
  try {
    console.log(await eSender.sendEmail("temporal", email)); 
    return res.status(202).json({ message: `Contraseña temporal generada` });
  } catch (error) {
    return res.status(500).json({ message: "Error al generar la contraseña temporal" });
  }
}

const accountConfirmation = async (req, res) => {
  const {email} = req.body;
  console.log("Estos son los parametros========");
  console.log(email);
  try {
    console.log("Llega adentro de account confirmation");
    await UserModel.confirmAccount(email);

    return res.status(202).json({ message: `Contraseña temporal generada` });
  } catch (error) {
    return res.status(500).json({ message: "Error al generar la contraseña temporal" });
  }
}
const confirmGeneration = async (req, res) => { 
  const {email} = req.body;
  console.log("Estos son los parametros========");
  console.log(email);
  
  try {
    console.log("Llega adentro de confirm generation");
    await eSender.sendEmail("confirm", email); 
    return res.status(202).json({ message: `Confirmacion generada` });
  } catch (error) {
    return res.status(500).json({ message: "Error al generar la confirmacion " });
  }
}



module.exports = {
  login,
  register,
  passwordRecuperation,
  registerConfirmation,
  temporalPasswordGeneration,
  accountConfirmation,
  confirmGeneration,

};
