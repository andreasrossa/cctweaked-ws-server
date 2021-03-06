import { ClientQuerySelector, isMatchType, MetadataSelector } from "./api"

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
			return this.getClientList().filter(client => {
				return clientMatchesMDQuery(clientQuery, client)
			})
		}

		return []
	}
}

const clientsCache = new ClientCache()
export default clientsCache

function clientMatchesMDQuery(metadataQuery: MetadataSelector, client: Client): unknown {

	return Object.entries(metadataQuery.metadata).every(([key, values]) => {
		if (!(key in client.metadata)) return false

		let matchType = "all"
		if (metadataQuery.matchType !== undefined && key in metadataQuery.matchType && isMatchType(metadataQuery.matchType[key]))
			matchType = metadataQuery.matchType[key]

		// The following if statement was generated by copilot - wtf 🤯
		// Like it understood that "all" means every value has to match and "some" means at least one value has to match 
		// i love this context aware stuff
		if (matchType === "all") {
			return values.every(value => client.metadata[key].includes(value))
		} else if (matchType === "any") {
			return values.some(value => client.metadata[key].includes(value))
		}
	})
}
