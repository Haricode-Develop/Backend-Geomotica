const express = require('express');
const cors = require('cors');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const winston = require('winston');
const expressWinston = require('express-winston');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

const socket = require('./socket');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const socketRoutes = require('./routes/webSocket');
const historialRoutes = require('./routes/historyRoutes');
const dashboardIndicadores = require('./routes/dashboardIndicadoresRoute');

// Configuración de CORS para permitir solicitudes desde cualquier origen
app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Content-Type, Authorization'
}));

app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

// Configuración de Winston para registrar logs
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

app.use(expressWinston.logger({
    transports: [
        new winston.transports.File({ filename: 'logs/requests.log' }),
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
    ),
    meta: true,
    expressFormat: true,
    colorize: false,
}));

app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.File({ filename: 'logs/error.log' }),
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
    ),
}));

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/socket', socketRoutes);
app.use('/historial', historialRoutes);
app.use('/dashboardIndicadores', dashboardIndicadores);

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal Server Error' });
});

// Conectar a la base de datos y luego iniciar el servidor
connectDB().then((client) => {
    const server = http.createServer(app);
    server.timeout = 300000;

    socket.init(server);

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error('Failed to start server due to database connection error:', err);
});