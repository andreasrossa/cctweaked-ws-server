import { isError } from "lodash"
import { Socket } from "socket.io"
import { APIResponse, get500Response } from "../api"
import { ClientMetadata } from "../clientCache"

export type EventHandler = (socket: Socket, args: unknown, callback: (response: APIResponse) => void) => void

export type EventHandlerMap = Record<string, EventHandler>

export type ClientQuerySelector = { metadata: ClientMetadata } | { ids: string[] } | { ids: string[], metadata: ClientMetadata }
export const hasClientQuery = (x: any): x is ClientQuerySelector => ("ids" in x && x.ids instanceof Array) || ("metadata" in x && x.metadata instanceof Object)

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
