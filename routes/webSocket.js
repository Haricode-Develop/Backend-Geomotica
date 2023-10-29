const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');
    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });
});

server.listen(3000, () => {
    console.log('Servidor escuchando en puerto 3000');
});