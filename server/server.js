const express = require('express')
const cors = require('cors')
const path = require('path')
// Init express
const app = express()

app.use(cors())
app.use(express.static(`${path.dirname(__dirname)}/public`))

const server = app.listen(3000, (err) => {
    console.clear()
    console.log('Port: 3000')
})

// Init socket
const io = require('socket.io')(server)


app.get('/', (req, res) => {
    res.sendFile(`${path.dirname(__dirname)}/public/index.html`)
})

io.on('connection', (socket) => {
    console.log('Socket connected: ', socket.id)

    socket.on('disconnect', () => {
        console.log('Disconnecting user id: ', socket.id)
    })

    socket.on('message', (data) => {
        console.log(data)
        socket.broadcast.emit('message', data)
    })

    socket.on('typing', (data) => {
        console.log(`${data.userId} is typing...`)
        socket.broadcast.emit('typing', data)
    })
})