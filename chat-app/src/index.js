const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateUserMsg, generateSysMsg, generateUserLocMsg } = require('./utils/messages')
const {
    addUser,
    getUser,
    getUsersByRoom,
    removeUser
} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicPath = path.join(__dirname, '../public')

app.use(express.static(publicPath))

io.on('connection', (socket) => {
    console.log('New socket connection')

    socket.on('join', ({username, room}, callback) => {
        const { error, user } = addUser({
            id: socket.id,
            username,
            room
        })
        if(error) {
            return callback(error)
        }
        socket.emit('sysMsg', generateSysMsg('Welcome!'))
        socket.join(user.room)
        socket.broadcast
        .to(user.room)
        .emit('sysMsg', generateSysMsg(`${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersByRoom(user.room)
        })
        callback()
    })

    socket.on('sendMsg', (msg, callback) => {
        const filter = new Filter()
        if(filter.isProfane(msg)) {
            return callback('Offensive content')
        }
        const user = getUser(socket.id)
        if(!user) {
            return callback('Error: User not registered in any room')
        }
        io.to(user.room).emit('userMsg', generateUserMsg(user.username, msg))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        if(!user) {
            return callback('Error: User not registered in any room')
        }
        io.emit('userLocMsg', generateUserLocMsg(user.username, coords))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user) {
            io.to(user.room).emit('sysMsg', generateSysMsg(`${user.username} has left!`))

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersByRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server running at port: ${port}`)
})