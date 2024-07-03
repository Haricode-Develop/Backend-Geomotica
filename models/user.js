const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/database');

const getCollection = async () => {
  const client = await connectDB();
  return client.db('GeomoticaProduccion').collection('usuarios');
};

const renameIdField = (doc, newFieldName) => {
  if (doc && doc._id) {
    doc[newFieldName] = doc._id;
    delete doc._id;
  }
  return doc;
};

const findByEmail = async (email) => {
  const collection = await getCollection();
  const user = await collection.findOne({ EMAIL: email }, { projection: { _id: 1, NOMBRE: 1, APELLIDO: 1, EMAIL: 1, PASSWORD: 1, ID_Rol: 1, ESTATUS: 1, FECHA_CREACION: 1, FOTO_PERFIL: 1 } });
  return renameIdField(user, 'ID_USUARIO');
};

const createUser = async (nombre, apellido, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const collection = await getCollection();
  const result = await collection.insertOne({
    NOMBRE: nombre,
    APELLIDO: apellido,
    EMAIL: email,
    PASSWORD: hashedPassword,
    ID_Rol: 3, // Asignación de rol por defecto
    ESTATUS: 0, // Initial status as unverified
    FECHA_CREACION: new Date(),
    FOTO_PERFIL: '' // Asignación de campo vacío por defecto
  });
  return renameIdField(result.ops[0], 'ID_USUARIO');
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