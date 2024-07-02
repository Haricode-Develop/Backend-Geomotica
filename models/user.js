const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');

const getCollection = async () => {
  const client = await connectDB();
  return client.db('geomoticaapp').collection('usuarios');
};

const findByEmail = async (email) => {
  const collection = await getCollection();
  return collection.findOne({ EMAIL: email });
};

const createUser = async (nombre, apellido, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const collection = await getCollection();
  const result = await collection.insertOne({
    NOMBRE: nombre,
    APELLIDO: apellido,
    EMAIL: email,
    PASSWORD: hashedPassword,
    ID_Rol: ObjectId(),
    ESTATUS: 0, // Initial status as unverified
    FECHA_CREACION: new Date()
  });
  return result.ops[0];
};

const isValidPassword = async (password, email) => {
  const user = await findByEmail(email);
  if (!user) return false;
  return bcrypt.compare(password, user.PASSWORD);
};

const confirmAccount = async (email) => {
  const collection = await getCollection();
  const result = await collection.updateOne(
      { EMAIL: email },
      { $set: { ESTATUS: 1 } }
  );
  return result.matchedCount > 0;
};

module.exports = {
  findByEmail,
  createUser,
  isValidPassword,
  confirmAccount,
};
