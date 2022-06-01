const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New socket connection')
    socket.emit('message', generateMessage('Welcome!'))

    socket.on('join', ({username, room}) => {
        socket.join(room)
        socket.broadcast
        .to(room)
        .emit('message', generateMessage(`${username} has joined!`))
    })

    socket.on('message', (msg, callback) => {
        console.log('MSG Received:', msg)
        const filter = new Filter()
        if(filter.isProfane(msg)) {
            return callback('Offensive content')
        }
        io.to(room).emit('message', generateMessage(msg))
        callback()
    })

    socket.on('sendLocation', (loc, callback) => {
        io.emit('locationMessage', generateMessage(loc))
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})

server.listen(port, () => {
    console.log(`Server running at port: ${port}`)
})