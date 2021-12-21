import { Socket } from "socket.io"

export type EventTypes = "register" | "run"
export type EventHandler = (socket: Socket, args: unknown) => void

export type TurtleEventHandlers = Record<EventTypes, EventHandler>

export class EventValidationException extends Error {
	constructor(msg: string) { super(msg) }
}

export class EventGenericException extends Error {
	constructor(msg: string) { super(msg) }
}

export type HasCommand = { command: string }

export function hasCommand(x: any): x is HasCommand {
	return "command" in x && typeof x.command === "string"
}

const turtleEventHandlers: TurtleEventHandlers = {
	run: (socket: Socket, args) => {
		if(!hasCommand(args)) {
			throw new EventValidationException(`expected { command: string }, was ${typeof args} (${JSON.stringify(args)})`)
		}
		
		console.log("got run event with: ", JSON.stringify(args))
	},
	register: (socket: Socket, args) => {
		console.log("got register event with: ", args)
	}
}



export default turtleEventHandlers