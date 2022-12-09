const express    = require("express")
const app        = express()
const http       = require("http")
const { Server } = require("socket.io")
const cors       = require("cors")
app.use(cors())
const server     = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["POST", "GET"]
  }
})

io.on("connection", socket => {
  console.log(socket.id)

})

server.listen(5300, () => {
  console.log("Server running on http://localhost:5300")
})