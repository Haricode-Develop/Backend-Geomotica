let io;

module.exports = {
    init: (server) => {
        io = require('socket.io')(server);

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