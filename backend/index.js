require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

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

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Get username and room from session
    socket.on("joinRoom", (userName) => {
        socket.join(userName);
    });

    // Handle message sending
    socket.on('sendMessage', ({ receiver, message }) => {
        // Save the message to the database or perform any other necessary operations
        // Emit the message to the sender
        socket.emit('messageReceived', { sender: socket.userId, message });
        
        // console.log(receiver);
        // Emit the message to the receiver
        socket.broadcast
            .to(receiver).emit('messageReceived', { sender: socket.userId, message });
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const LISTENINGPORT = 3001;
// Change the app.listen line to use the server instance
server.listen(LISTENINGPORT, () => {
    console.log(`Server Started at ${LISTENINGPORT}`);
});