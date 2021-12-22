import _ from "lodash";
import { Socket } from "socket.io";
import { getCatchableHandler, EventHandlerMap } from "./event/events";

export function addListeners(handlers: EventHandlerMap, socket: Socket) {
	Object.entries(handlers).forEach(([event, handler]) => {
		const curriedHandler = _.curry(getCatchableHandler(handler))(socket);
		socket.addListener(event, curriedHandler);
	});
}
