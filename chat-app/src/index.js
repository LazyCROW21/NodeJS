const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New socket connection')
    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user joined')
    socket.on('message', (msg, callback) => {
        console.log('MSG Received:', msg)
        const filter = new Filter()
        if(filter.isProfane(msg)) {
            return callback('Offensive content')
        }
        io.emit('message', msg)
        callback()
    })

    socket.on('sendLocation', (loc, callback) => {
        io.emit('message', loc)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

server.listen(port, () => {
    console.log(`Server running at port: ${port}`)
})