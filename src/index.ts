import { Server } from "socket.io";
import express from "express";
import http from "http";
import turtleEventHandlers, { EventHandler } from "./events";
import _, { isError } from "lodash"
import { get500Response } from "./api";

const PORT = 3000

const app = express()
const server = http.createServer(app)

const io = new Server(server)

const getCatchableHandler = (handler: EventHandler): EventHandler => {
	return (socket, args, callback) => {
		try {
			handler(socket, args, callback)
		} catch (e) {
			console.error(e)
			callback(get500Response(isError(e) ? e.message : JSON.stringify(e)))
		}
		}
	}


io.on("connection", (socket) => {
	console.log(`Client connected: #${socket.id}`)
	socket.broadcast.emit(`Client connected: #${socket.id}`)
	Object.entries(turtleEventHandlers).forEach(([event, handler]) => {
		const curriedHandler = _.curry(getCatchableHandler(handler))(socket)
		socket.addListener(event, curriedHandler)
	})
})

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`)
})
