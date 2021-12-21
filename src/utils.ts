import _ from "lodash";
import { Socket } from "socket.io";
import { getCatchableHandler, TurtleEventHandlers } from "./events";

export function addListeners(handlers: TurtleEventHandlers, socket: Socket) {
	Object.entries(handlers).forEach(([event, handler]) => {
		const curriedHandler = _.curry(getCatchableHandler(handler))(socket);
		socket.addListener(event, curriedHandler);
	});
}
