const DashboardIndicadores = require('../models/dashboardIndicadoresModel');
const { MongoClient } = require('mongodb');
const connectDB = require('../config/database');

const grafica1 = async(req, res) => {
    try {
        const client = await connectDB();
        const db = client.db('nombreBaseDeDatos');
        const collection = db.collection('nombreDeLaColeccion');

        const indicadores = await collection.find({}).toArray();
        res.status(200).json(indicadores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    grafica1
}