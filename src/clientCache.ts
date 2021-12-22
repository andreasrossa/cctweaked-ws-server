import { ClientQuerySelector } from "./event/events"

export type ClientMetadata = Record<string, string[]>

export type Client = {
	id: string,
	metadata: ClientMetadata,
	socketId: string
}

export class ClientCache {
	private clients: Map<string, Client> = new Map()

	public addClient(client: Client): void {
		this.clients.set(client.id, client)
	}

	public removeClient(clientId: string): void {
		this.clients.delete(clientId)
	}

	public getClient(clientId: string): Client | undefined {
		return this.clients.get(clientId)
	}

	public getClients(ids: string[]): Client[] {
		return ids.map(id => this.getClient(id)).filter(it => it !== undefined) as Client[]
	}

	public hasClient(clientId: string): boolean {
		return this.clients.has(clientId)
	}

	public isEmpty(): boolean {
		return this.clients.size > 0
	}

	public getClientList(): Client[] {
		return Array.from(this.clients.values())
	}

	public clear(): void {
		this.clients.clear()
	}

	public query(clientQuery: ClientQuerySelector): Client[] {
		if("ids"in clientQuery) {
			return this.getClients(clientQuery.ids)
		}

		if("metadata"in clientQuery) {
			const queryMD = clientQuery.metadata
			return this.getClientList().filter(client => {
				return Object.entries(queryMD).every(([key, values]) => {
					return client.metadata.hasOwnProperty(key) && values.every(value => client.metadata[key].includes(value))
				})
			})
		}

		return []
	}
}

const clientsCache = new ClientCache()
export default clientsCache;