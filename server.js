const express = require('express')
const app = express()
const http = require('http');
const { Server } = require('socket.io')
const cors = require('cors')
const origins = ['https://react-pictochat.netlify.app', 'localhost:5173']

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: ['https://react-pictochat.netlify.app', 'localhost:5173'],
        methods:["GET", "POST"]
    },
})

io.on('connection', socket => {
    socket.on('send-message', message => {
        socket.broadcast.emit('new-message', message)
        socket.emit('new-message', message)
    })
    // socket.on('user-joined', name => {
    //     socket.broadcast.emit('user-joined', `${name} joined the server`)
    //     socket.emit('user-joined', `${name} joined the server`)
    // })
})

server.listen('8000', () => {
    console.log('server is running on port 8000')
})