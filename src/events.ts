import { isError } from "lodash"
import { Socket } from "socket.io"
import { APIResponse, get200Response, get400Response, get500Response } from "./api"

export type EventHandler = (socket: Socket, args: unknown, callback: (response: APIResponse) => void) => void

export type TurtleEventHandlers = Record<string, EventHandler>

export type HasCommand = { command: string }

export function hasCommand(x: any): x is HasCommand {
	return "command" in x && typeof x.command === "string"
}

const turtleEventHandlers: TurtleEventHandlers = {
	run: (socket: Socket, args, callback) => {
		if(!hasCommand(args)) {
			callback(get400Response("missing command key"))
		}
		
		console.log("got run event with: ", JSON.stringify(args))
		callback(get200Response())
	},
	register: (socket: Socket, args, callback) => {
		console.log("got register event with: ", args)
		throw new Error("bruh")
	}
}


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


export default turtleEventHandlers