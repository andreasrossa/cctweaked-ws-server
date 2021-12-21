import { Server, Socket } from "socket.io";
import express from "express";
import http from "http";
import turtleEventHandlers, { EventHandler, getCatchableHandler } from "./events";
import _, { isError } from "lodash"
import { get500Response } from "./api";

const PORT = 3000

const app = express()
const server = http.createServer(app)

const io = new Server(server)

io.on("connection", (socket) => {
	console.log(`Client connected: #${socket.id}`)
	socket.broadcast.emit(`Client connected: #${socket.id}`)
	addListeners(socket);
})

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`)
})


function addListeners(socket: Socket) {
	Object.entries(turtleEventHandlers).forEach(([event, handler]) => {
		const curriedHandler = _.curry(getCatchableHandler(handler))(socket);
		socket.addListener(event, curriedHandler);
	});
}

