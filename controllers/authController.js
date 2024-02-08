const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const emailSender = require("../utils/emailSender.js");
const eSender = new emailSender();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    console.log(user);
    console.log(user.EMAIL);
    console.log(user.PASSWORD);
    const isValidPassword = await UserModel.isValidPassword(password, user.EMAIL);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    console.log("Este es el resultado de isvalidpassword "+ isValidPassword);
    if(!isValidPassword){
      return res.status(403).json({ message: "Contraseña incorrecta" });
    }
    // Reemplaza con tu lógica real
    // Verificar el estatus del usuario (por ejemplo, si está verificado)
    if (user.ESTATUS !== 1) {
      return res.status(403).json({ message: "Usuario no verificado aún, por favor verificar correo" });
    }

    // Generar un token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, 'tu_clave_secreta', { expiresIn: '1h' });

    // Enviar el token al cliente
    return res.json({ user, token });
  } catch (error) {
    console.error('Error en el proceso de inicio de sesión:', error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
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
