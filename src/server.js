require('dotenv').config()

const express    = require("express")
const app        = express()
const http       = require("http")
const { Server } = require("socket.io")
const cors       = require("cors")
const axios      = require("axios")
const moment     = require("moment")
app.use(cors())
const server     = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"]
  }
})

io.on("connection", async (socket) => {
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

  socket.on("checkin", async (data) => {
    const checkin = await axios.post(process.env.API+process.env.CHECKIN, data)
    socket.emit("checkin_msg", checkin.data.message)
    const data_checkin = await axios.post(process.env.API+process.env.CHECKIN_SELECT, { email: data.email, dayCheckin: data.dayCheckin })
    socket.emit("data_checkin", data_checkin.data)
  })

  socket.on("checkout", async (data) => {
    const checkout = await axios.post(process.env.API+process.env.CHECKOUT, data)
    socket.emit("checkout_msg", checkout.data.message)
    const data_checkout = await axios.post(process.env.API+process.env.CHECKOUT_SELECT, {email: data.email, dayCheckOut: data.dayCheckOut})
    socket.emit("data_checkout", data_checkout.data)
  })
})

server.listen(5300, () => {
  console.log(`Server running on ${process.env.URL+process.env.PORT}`)
})