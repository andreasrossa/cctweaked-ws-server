import { Server, Socket } from "socket.io";
import express from "express";
import http from "http";
import _ from "lodash"
import turtleEventHandlers, { getCatchableHandler, TurtleEventHandlers } from "./events";
import { addListeners } from "./utils";

const PORT = 3000

const app = express()
const server = http.createServer(app)

const io = new Server(server)

io.on("connection", (socket) => {
	console.log(`Client connected: #${socket.id}`)
	socket.broadcast.emit(`Client connected: #${socket.id}`)
	addListeners(turtleEventHandlers, socket);
})

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`)
})



