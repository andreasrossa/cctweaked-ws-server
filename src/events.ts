import { Socket } from "socket.io"
import { APIResponse, get200Response, get400Response } from "./api"

export type EventTypes = "register" | "run"
export type EventHandler = (socket: Socket, args: unknown, callback: (response: APIResponse) => void) => void

export type TurtleEventHandlers = Record<EventTypes, EventHandler>

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



export default turtleEventHandlers