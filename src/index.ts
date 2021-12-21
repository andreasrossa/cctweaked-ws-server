import { Server } from "socket.io";
import express from "express";
import http from "http";
import turtleEventHandlers from "./events";
import _ from "lodash"

const PORT = 3000

const app = express()
const server = http.createServer(app)

const io = new Server(server)

io.on("connection", (socket) => {
	console.log(`Client connected: #${socket.id}`)
	socket.broadcast.emit(`Client connected: #${socket.id}`)
	Object.entries(turtleEventHandlers).forEach(([event, handler]) => {
		const curriedHandler = _.curry(handler)(socket)
		socket.addListener(event, curriedHandler)
	})
})

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`)
})
