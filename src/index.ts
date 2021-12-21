import { Server, Socket } from "socket.io";
import express from "express";
import http from "http";
import turtleEventHandlers, { EventValidationException, EventHandler } from "./events";
import _ from "lodash"
import { EventErrorResponse } from "./api";

const PORT = 3000

const app = express()
const server = http.createServer(app)

const io = new Server(server)

const catchingListener = (listener: EventHandler, onError: (error: Error, socket: Socket) => void, socket: Socket): ((args: unknown) => void) => {
	return (args: unknown) => {
		try {
			listener(socket, args)
		} catch (e: unknown) {
			// Dirty but works
			onError(e as Error, socket)
		}
	}
}

const handleListenerError = (e: Error, socket: Socket) => {
	console.error(e)

	let errorResponse: EventErrorResponse

	// Switch on the error type
	if (e instanceof EventValidationException) {
		errorResponse = {
			status: 400,
			errorMessage: e.message
		}
	} else {
		errorResponse = {
			status: 500,
			errorMessage: "internal error"
		}
	}

	// Send the response
	socket.emit("error", errorResponse)
}



io.on("connection", (socket) => {
	console.log(`Client connected: #${socket.id}`)
	socket.broadcast.emit(`Client connected: #${socket.id}`)
	Object.entries(turtleEventHandlers).forEach(([event, handler]) => {
		const caughtListener = catchingListener(handler, (e) => handleListenerError(e, socket), socket)
		socket.addListener(event, caughtListener)
	})
})

server.listen(PORT, () => {
	console.log(`Listening on port ${PORT}...`)
})
