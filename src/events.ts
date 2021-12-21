import { Socket } from "socket.io"

export type EventTypes = "register" | "run"
export type TurtleEventHandlers = Record<EventTypes, (socket: Socket, args: any[]) => void>


const turtleEventHandlers: TurtleEventHandlers = {
	run: (socket: Socket, args) => {
		console.log("got run event with: ", args)
	},
	register: (socket: Socket, args) => {
		console.log("got register event with: ", args)
	}
}



export default turtleEventHandlers