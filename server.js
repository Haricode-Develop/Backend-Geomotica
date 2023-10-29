const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const PORT = 3001;
require('dotenv').config();

const socket = require('./socket');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

const server = http.createServer(app);
const ioOptions = {
    cors: {
        origin: "*", // Permite todas las conexiones. En producción, deberías especificar el origen permitido.
        methods: ["GET", "POST"],
        credentials: true
    }
};

const io = require('socket.io')(server, ioOptions); // Aquí inicializamos socket.io usando el módulo que proporcionaste.

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
