// Node server - Handle socket.io connection

const io = require('socket.io')(8000, {
    cors: {
        origin: 'http://127.0.0.1:5500',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
        credentials: true,
    },
});

const users = {};


io.on('connection', socket => {
    socket.on('new-user-joined', userName => {
        console.log(`New user ${userName} connected.`);
        users[socket.id] = userName;
        socket.broadcast.emit('user-joined', userName);
    });

    socket.on('chat', message => {
        console.log("Sender: ", users[socket.id]);
        console.log("ID: ", socket.id);
        socket.broadcast.emit('receive', { userName: users[socket.id], mess: message, userID: socket.id })
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('leave', users[socket.id]);
        delete users[socket.id];
    })
});