// config/database.js

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGO_URI;
let client; // Mantén la conexión global aquí
let db;     // Mantenemos la referencia a la base de datos

const connectDB = async () => {
    if (!client || !client.isConnected()) {
        client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        try {
            await client.connect();
            console.log('MongoDB connected successfully.');
            db = client.db('GeomoticaProduccion'); // Conecta a la base de datos específica
        } catch (err) {
            console.error('Failed to connect to MongoDB', err);
            process.exit(1);
        }
    }

    return db;
};

module.exports = connectDB;
