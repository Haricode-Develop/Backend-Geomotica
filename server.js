const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const PORT = 3001;
require('dotenv').config();

const socket = require('./socket');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const socketRoutes = require('./routes/webSocket');
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(express.urlencoded({ extended: true })); // Para parsear application/x-www-form-urlencoded


app.use(express.json());

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/socket', socketRoutes);

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

const server = http.createServer(app);

// Inicializar Socket.io utilizando el módulo 'socket.js'
socket.init(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
