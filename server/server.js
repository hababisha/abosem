const express = require("express")
const {v4: uuidv4} = require("uuid")
const app = express()
const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const cors = require("cors")
const io = new Server(server, {
    cors: {
        origin : "*",
        methods: ["GET", "POST"]
    }
})

app.use(cors())

const rooms = {}
io.on("connection", (socket) => {
    console.log('user connected: ', socket.id)

    socket.on("createRoom", () => {
        const roomId = uuidv4()
        rooms[roomId] = {
            players: [socket.id],
            picks : {}
        }
        socket.join(roomId)
        socket.emit("roomCreated", roomId)
        console.log("Room craeted", roomId)
    })

    socket.on("joinRoom", (roomId) =>{
        const room = rooms[roomId]
        if(!room) {
            socket.emit("errorMsg", "room does not exist")
            return
        }

        if (room.players.length >= 2) {
            socket.emit("errorMsg", "room is already full")
            return
        }

        room.players.push(socket.id)
        socket.join(roomIdn)
        socket.emit("roomJoined", roomId)
        io.to(roomId).emit("startGame")
    })

    socket.on("playerChoice", ({ roomId, similarOrDifferent, number }) => {
        const room = rooms[roomId]
        if (!room) return
        room.picks[socket.id] = { similarOrDifferent, number}

        if (Object.keys(room.picks).length === 2) {

            const[p1, p2] = room.players
            const pick1 = room.picks[p1]
            const pick2 = room.picks[p2]

            let winner
            if (pick1.number === pick2.number) {
                if (pick1.similarOrDifferent === "similar") winner = p1
                else winner = p2
            } else {
                if (pick1.similarOrDifferent === "different") winner = p1
                else winner = p2
            }
            io.to(roomId).emit("gameResult", {
                winner,
                details: {[p1]: pick1, [p2]: pick2}
            })
            room.picks = {}
        }
    })

    socket.on("disconnect", () => {
        console.log("disconnnected: ", socket.id)

        for (const roomId in rooms) {
            const room = rooms[roomId]
            room.players = room.players.filter((id) => id !== socket.id)

            if (room.players.length===0) {
                delete rooms[roomId]
            }
        }
    })
})

server.listen(3000, () => {
    console.log('server listening on port 3000')
})