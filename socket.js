let io;

module.exports = {
    init: (server) => {
        const ioOptions = {
            cors: {
                origin: "*",
                methods: ["GET", "POST"],
                credentials: true
            }
        };
        io = require('socket.io')(server, ioOptions);

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
