import { get200Response, get500Response } from "../../api";
import clientCache, { Client, ClientMetadata } from "../../clientCache";
import { EventHandler } from "../events";

export type RegisterEventArgs = {
	id: string,
	metadata?: ClientMetadata,
}

export const isRegisterEventArg = (x: any): x is RegisterEventArgs => x.id && typeof x.id === "string"

/**
 * Registers a new client.
 * Responds with 500 if the client already exists
 */
const handleRegister: EventHandler = (socket, args, callback) => {
	if(!isRegisterEventArg(args)) {
		callback(get500Response("Invalid arguments"))
		return
	}
	
	if(clientCache.hasClient(args.id)) {
		callback(get500Response("Client already exists"))
		return
	}

	const newClient: Client = {
		id: args.id,
		metadata: args.metadata ?? {},
		socketId: socket.id
	};

	clientCache.addClient(newClient)

	console.log(`Added client. Cache: ${JSON.stringify(clientCache.getClientList())}`)

	callback(get200Response(JSON.stringify(newClient)))
}

export default handleRegister