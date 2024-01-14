// socket.js
const socketIO = require('socket.io');

let io;

module.exports = {
    init: (server) => {
        io = socketIO(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                allowedHeaders: ["my-custom-header"],
                credentials: true
            }
        });

        io.on('connection', (socket) => {
            console.log('Un cliente se ha conectado');
            socket.on('disconnect', () => {
                console.log('Un cliente se ha desconectado');
            });
        });

        return io;
    },
    getIo: () => {
        if (!io) {
            throw new Error('Socket.io not initialized!');
        }
        return io;
    }
};
