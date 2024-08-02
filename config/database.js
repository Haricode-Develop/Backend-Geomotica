// config/database.js

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGO_URI;
let client;
let db;

const connectDB = async () => {
    if (!client || !client.topology || !client.topology.isConnected()) {
        // Create a new MongoClient instance
        client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        try {
            // Connect to MongoDB
            await client.connect();
            console.log('MongoDB connected successfully.');
            // Select the specific database
            db = client.db('GeomoticaProduccion');
        } catch (err) {
            console.error('Failed to connect to MongoDB', err);
            // Exit the process on failure
            process.exit(1);
        }
    }

    return db;
};

module.exports = connectDB;
