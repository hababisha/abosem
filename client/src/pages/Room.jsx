import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom"
import socket from "../socket"

function Room() {
  const {roomId} = useParams()
  const [gameStarted, setGameStarted] = useState(false)
  const [similarOrDifferent, setSimilarOrDifferent] = useState("")
  const [number, setNumber] = useState("")
  const [result, setResult] = useState(null)

  useEffect(() => {
    socket.on("startGame", () => {
      setGameStarted(true)
    })

    socket.on("gameResult", (data) => {
      setResult(data)
    })
  }, [])

  const sendChoice = () => {
    if(!similarOrDifferent || !number) return alert("complete both chocies")
    socket.emit("playerChoice", {
      roomId,
      similarOrDifferent,
      number,
    })
  }
  return (
    <div className='min-h-screen p-6'>
      <h1 className='text-2xl font-bold'>RoomId : {roomId}</h1>
      {!gameStarted && (
        <p className='my-6 text-gray-600'> waiting for second player to join.. </p>

      )}
      {gameStarted && !result && (
        <div className="flex flex-col gap-4 mt-10">
          <div>
            <label className="mr-2">Choose:</label>
            <select
              value={similarOrDifferent}
              onChange={(e) => setSimilarOrDifferent(e.target.value)}
              className="border p-2"
            >
              <option value="">--Select--</option>
              <option value="similar">Similar</option>
              <option value="different">Different</option>
            </select>
          </div>

          <div>
            <label className="mr-2">Pick a number (1 or 2):</label>
            <select
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="border p-2"
            >
              <option value="">--Select--</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>

          <button
            onClick={sendChoice}
            className="px-4 py-2 bg-purple-600 text-white rounded"
          >
            Submit
          </button>
        </div>
      )}

      {result && (
        <div className="mt-10">
          <h2 className="text-xl font-bold">Result:</h2>
          <p className="mt-2">
            Winner socket id: <strong>{result.winner}</strong>
          </p>
          <pre className="mt-4 bg-gray-100 p-4 rounded">
            {JSON.stringify(result.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

export default Room;