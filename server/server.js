const express = require('express')
const cors = require('cors')
const path = require('path')
// Init chat server
const chatServer = express()

chatServer.use(cors())
chatServer.use(express.static(`${path.dirname(__dirname)}/public`))

/*
// Init regular server
const app = express();

app.use(cors())
app.use(express.static(`${path.dirname(__dirname)}/public`))

// Regular routes

app.get('/', (req, res) => {
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    console.log('Working /')
    res.json({msg: 'Login'})
})

app.listen(5000, () => {
    console.log(`Server live at http://localhost:5000`)
})
*/

// Socket Stuff
const server = chatServer.listen(3000, (err) => {
    // console.clear()
    console.log('Socket at port: 3000')
})

// Init socket
const io = require('socket.io')(server)

chatServer.get('/', (req, res) => {
    console.log('Working chatroom')
    res.sendFile(`${path.dirname(__dirname)}/public/index.html`)
})

io.on('connection', (socket) => {
    // console.log('Socket connected: ', socket.id)

    socket.on('disconnect', (data) => {
        console.log(`Disconnecting user ${data}`);
        io.emit('disconnected', data);
    })

    socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('message', data)
    })

    socket.on('typing', (data) => {
        console.log(`${data.name} is typing...`)
        socket.broadcast.emit('typing', data)
    })

    socket.on('connected', (data) => {
        console.log(`User ${data.name} is online.`)
        socket.broadcast.emit('connected', data);
    })
})

// io.on('disconnect', (socket) => {
//     socket.on('disconnected', (data) => {
//         console.log(`User ${data.name} is offline.`)
//         socket.broadcast.emit('disconnected', data);
//     })
// })