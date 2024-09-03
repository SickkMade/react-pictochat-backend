const express = require('express')
const app = express()
const http = require('http');
const { Server } = require('socket.io')
const cors = require('cors')

app.use(cors({
    origin: '*', //CHANGE FOR PROD
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

const server = http.createServer(app)

const io = new Server(server, {
    cors:{
        origin: '*', //IMPORTANT <-------------------------------------------------------- CHANGE FOR PROD
        methods:["GET", "POST"]
    },
})

io.on('connection', socket => {
    socket.on('send-message', message => {
        socket.broadcast.emit('new-message', message)
        socket.emit('new-message', message)
    })
    socket.on('user-joined', name => {
        socket.broadcast.emit('new-message', `${name} joined the server`)
        socket.emit('new-message', `${name} joined the server`)
    })
})

server.listen('8000', () => {
    console.log('server is running on port 8000')
})