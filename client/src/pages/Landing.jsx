import React, {useState} from 'react'
import socket from "../socket"
import { useNavigate } from "react-router-dom"

function Landing() {
  const [roomInput, setRoomInput] = useState("")
  const navigate = useNavigate()

  const handleCreate = () => {
    socket.emit("createRoom")
    socket.on("roomCreated", (roomId) => {
      navigate(`/room/${roomId}`)
    })
  }

  const handleJoin = () => {
    if (!roomInput) return alert("Enter roomId")
    socket.emit("joinRoom", roomInput)
    socket.on("roomJoined", () =>{
      navigate(`/room/${roomInput}`)
    })
    socket.on("errorMsg", (msg) => alert(msg))
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
    <button
      className="px-4 py-2 bg-blue-500 text-white rounded"
      onClick={handleCreate}
    >
      Create Room
    </button>

    <input
      type="text"
      placeholder="Enter Room ID"
      className="border p-2"
      value={roomInput}
      onChange={(e) => setRoomInput(e.target.value)}
    />
    <button
      className="px-4 py-2 bg-green-500 text-white rounded"
      onClick={handleJoin}
    >
      Join Room
    </button>
  </div>
  )
}

export default Landing;
