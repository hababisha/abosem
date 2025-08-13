const express = require("express")
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)


// app.get("/", (req,res) => {
//     console.log("hello")
// })
io.on("connection", (socket) => {
    console.log('user connected: ', socket.id)
})

server.listen(3000, () => {
    console.log('server listening on port 3000')
})