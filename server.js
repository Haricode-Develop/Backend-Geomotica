const express = require('express');
const cors = require('cors');
const http = require('http');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3001;
const connectDB = require('./config/database');
require('dotenv').config();

connectDB();

const socket = require('./socket');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const socketRoutes = require('./routes/webSocket');
const historialRoutes = require('./routes/historyRoutes');
const dashboardIndicadores = require('./routes/dashboardIndicadoresRoute');


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/socket', socketRoutes);
app.use('/historial', historialRoutes);
app.use('/dashboardIndicadores', dashboardIndicadores);


app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});

const server = http.createServer(app);

server.timeout = 300000;

socket.init(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});