require('dotenv').config()

const express    = require("express")
const app        = express()
const http       = require("http")
const { Server } = require("socket.io")
const cors       = require("cors")
const axios      = require("axios")
app.use(cors())
const server     = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"]
  }
})

io.on("connection", (socket) => {
  console.log(`User connected from: ${socket.id}`)

  socket.on("new_applicant", (data) => {
    console.log(data)
    socket.broadcast.emit("applicant", data)
  })

  socket.on("me", (data) => {
    axios.get(process.env.ZORM+process.env.SELECT_TRANSACTION)
      .then((res) => {
        if (res.data) {
          const dataT = res.data
          socket.emit("data_transactions", dataT)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  
    axios.get(process.env.ZORM+process.env.SELECT_ALL)
      .then((res) => {
        if (res.data) {
          const arr  = res.data
          const me   = data.me
          const rows = []
          for (let i = 0; i < arr.length; i++) {
            let rand1      = Math.round(Math.random()*100)
            let rand2      = Math.round(Math.random()*10)
            let obj        = {
              id: arr[i]._id,
              name: arr[i].name,
              email: arr[i].email,
              age: rand1,
              hours: rand2,
              status: "online"
            }
            if (arr[i].email !== me) {
              rows.push(obj)
            }
          }
          socket.emit("data_workers", rows)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  })
})

server.listen(5300, () => {
  console.log("Server running on http://localhost:5300")
})