const UserModel = require("../models/user");
const jwt = require("jsonwebtoken");
const emailSender = require("../utils/emailSender.js");
const eSender = new emailSender();

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isValidPassword = await UserModel.isValidPassword(password, email);
    if (!isValidPassword) {
      return res.status(403).json({ message: "Contraseña incorrecta" });
    }

    if (user.ESTATUS !== 1) {
      return res.status(403).json({ message: "Usuario no verificado aún, por favor verificar correo" });
    }

    const token = jwt.sign(
        { userId: user._id, email: user.EMAIL },
        process.env.JWT_SECRET || "tu_clave_secreta",
        { expiresIn: "1h" }
    );

    return res.json({ user, token });
  } catch (error) {
    console.error("Error en el proceso de inicio de sesión:", error);
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

    const userCreated = await UserModel.createUser(nombre, apellido, email, password);
    if (userCreated) {
      eSender.sendEmail("registry", email);
      res.json({ success: true });
    }
  } catch (err) {
    console.error("Error al registrar el usuario:", err);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

const passwordRecuperation = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    eSender.sendEmail("recovery", user.EMAIL);
    return res.status(200).json({ message: "Usuario encontrado" });
  } catch (error) {
    console.error("Error en la recuperación de contraseña:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

const registerConfirmation = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    eSender.sendEmail("registry", user.EMAIL);
    return res.status(200).json({ message: "Usuario encontrado" });
  } catch (error) {
    console.error("Error en la confirmación del registro:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

const temporalPasswordGeneration = async (req, res) => {
  const { email } = req.body;
  try {
    eSender.sendEmail("temporal", email);
    return res.status(202).json({ message: `Contraseña temporal generada` });
  } catch (error) {
    console.error("Error al generar la contraseña temporal:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

const accountConfirmation = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await UserModel.confirmAccount(email);
    return res.status(202).json({ message: `Cuenta confirmada` });
  } catch (error) {
    console.error("Error al confirmar la cuenta:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

const confirmGeneration = async (req, res) => {
  const { email } = req.body;
  try {
    eSender.sendEmail("confirm", email);
    return res.status(202).json({ message: `Confirmación generada` });
  } catch (error) {
    console.error("Error al generar la confirmación:", error);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

module.exports = {
  login,
  register,
  passwordRecuperation,
  registerConfirmation,
  temporalPasswordGeneration,
  accountConfirmation,
  confirmGeneration,
};
