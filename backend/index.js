require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// const http = require('http');
// const socketIO = require('socket.io');

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const socket = require("socket.io");
// const server = http.createServer(app);
// const io = socketIO(server);
// const server = require('http').Server(app);
// const io = require('socket.io')(server);

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
    key: 'userId',
    secret: 'this site is unsecure',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 1000 * 60 * 60 * 24 * 1, // milliseconds/second seconds/minute minutes/hour hours/day days 
    }
}));

const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString, { useNewUrlParser: true, useUnifiedTopology: true });
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const routes = require('./routes/routes');

app.use('/api', routes)

app.use('/uploads', express.static('uploads'));

// // Handle socket connection
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     // Handle message event
//     socket.on('message', (data) => {
//         // Broadcast the message to all connected clients
//         io.emit('message', data);
//     });

//     // Handle disconnect event
//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });

// Initialize Socket.io
// io.on('connection', (socket) => {
//     console.log('A user connected');

//     // Handle new message event
//     socket.on('newMessage', (message) => {
//         // Broadcast the message to the specified receiver user
//         // socket.broadcast.emit('newMessage', message);
//         // Broadcast the message to all connected clients
//         socket.emit('newMessage', message);
//         // io.emit('newMessage', message);
//     });

//     // Handle disconnection
//     socket.on('disconnect', () => {
//         console.log('A user disconnected');
//     });
// });

const LISTENINGPORT = 3001;
const server = app.listen(LISTENINGPORT, () => {
    console.log(`Server Started at ${LISTENINGPORT}`)
})

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});
//store all online users inside this map
global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieved", data.message);
        }
    });
});