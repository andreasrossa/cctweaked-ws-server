import { ClientQuery, get200Response, get500Response, hasClientQuery } from "../../api"
import clientCache from "../../clientCache"
import IO from "../../ioContainer"
import clientEventFactories from "../clientEvents"
import { EventHandler } from "../events"

export type HasCommand = { command: string }

export function hasCommand(x: any): x is HasCommand {
	return "command" in x && typeof x.command === "string"
}

export type RunEventArgs = HasCommand & ClientQuery

const isRunEventArgs = (x: any): x is RunEventArgs => hasCommand(x) && hasClientQuery(x)

const handleRun: EventHandler = (socket, args, callback) => {
	if(!isRunEventArgs(args)) {
		callback(get500Response("Invalid arguments"))
		return
	}

	const { command, ...clientQuery } = args
	
	const clients = clientCache.query(clientQuery.query)

	console.log("Queried clients:", clients, clientQuery, clientCache.getClientList())

	clients.forEach(client => {
		console.log(`Trying to run "${command}" on ${JSON.stringify(client)}`)
		IO.get().to(client.socketId).emit("runlua", clientEventFactories.sendCommand(command))
	})

	callback(Object.assign(get200Response(), { clients: clients.map(c => c.id) }))
}

export default handleRun