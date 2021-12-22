import { EventHandlerMap } from "../events";
import handleRegister from "./registerEvent";
import handleRun from "./runEvent";

export default {
	register: handleRegister,
	run: handleRun
} as EventHandlerMap
