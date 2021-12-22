import { get200Response, get500Response } from "../../api"
import clientCache from "../../clientCache"
import { getIo } from "../../ioContainer"
import clientEventFactories from "../clientEvents"
import { ClientQuerySelector, EventHandler, hasClientQuery } from "../events"

export type HasCommand = { command: string }

export function hasCommand(x: any): x is HasCommand {
	return "command" in x && typeof x.command === "string"
}

export type RunEventArgs = HasCommand & ClientQuerySelector

const isRunEventArgs = (x: any): x is RunEventArgs => hasCommand(x) && hasClientQuery(x)

const handleRun: EventHandler = (socket, args, callback) => {
	if(!isRunEventArgs(args)) {
		callback(get500Response("Invalid arguments"))
		return
	}

	const { command, ...clientQuery } = args
	
	const clients = clientCache.query(clientQuery)

	console.log("Queried clients:", clients, clientQuery, clientCache.getClientList())

	clients.forEach(client => {
		console.log(`Trying to run "${command}" on ${JSON.stringify(client)}`)
		getIo().to(client.socketId).emit("runlua", JSON.stringify(clientEventFactories.sendCommand(command)))
	})

	callback(get200Response())
}

export default handleRun