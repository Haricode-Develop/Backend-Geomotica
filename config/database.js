// config/database.js

const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const uri = process.env.MONGO_URI;
let client;

const connectDB = async () => {
    if (!client) {
        client = new MongoClient(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    try {
        if (!client.isConnected()) {
            await client.connect();
            console.log('MongoDB connected successfully.');
        }
        return client;
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
