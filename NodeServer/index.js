// Node server - Handle socket.io connection

// const server = require('https').createServer();

// const io = require('socket.io')(server.address().port, {
//     cors: {
//         origin: 'https://mychatroom.vercel.app',
//         methods: ['GET', 'POST'],
//         allowedHeaders: ['Content-Type'],
//         credentials: true,
//     },
// });


const https = require('https');
const io = require('socket.io')(https.createServer());

const server = https.createServer((req, res) => {
  // Handle any HTTPS requests if needed
});

io.attach(server, {
  cors: {
    origin: 'https://mychatroom.vercel.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  },
});




server.listen(0, () => {
    const port = server.address().port;
    console.log(`Server listening on port ${port}`);
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

