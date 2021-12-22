import { isError } from "lodash"
import { Socket } from "socket.io"
import { APIResponse, get500Response } from "../api"

export type EventHandler = (socket: Socket, args: unknown, callback: (response: APIResponse) => void) => void

export type EventHandlerMap = Record<string, EventHandler>

export const getCatchableHandler = (handler: EventHandler): EventHandler => {
	return (socket, args, callback) => {
		try {
			handler(socket, args, callback)
		} catch (e) {
			console.error(e)
			callback(get500Response(isError(e) ? e.message : JSON.stringify(e)))
		}
	}
}
