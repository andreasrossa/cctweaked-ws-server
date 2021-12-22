import { Server } from "socket.io";
import express from "express";
import http from "http";
import _ from "lodash"
import { addListeners } from "./utils";
import eventHandlers from "./event/handlers"
import IO from "./ioContainer";

const PORT = 3000

const app = express()
const server = http.createServer(app)

const io = IO.set(new Server(server))

io.on("connection", (socket) => {
	console.log(`Client connected: #${socket.id}`)
	socket.broadcast.emit(`Client connected: #${socket.id}`)
	addListeners(eventHandlers, socket);
})

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`)
})



