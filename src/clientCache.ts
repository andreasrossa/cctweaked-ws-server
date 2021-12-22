export class ClientCache {
	private clients: Set<string> = new Set()

	public addClient(client: string): void {
		this.clients.add(client)
	}

	public removeClient(client: string): void {
		this.clients.delete(client)
	}

	public hasClient(client: string): boolean {
		return this.clients.has(client)
	}

	public hasClients(): boolean {
		return this.clients.size > 0
	}

	public getClients(): string[] {
		return Array.from(this.clients)
	}

	public clear(): void {
		this.clients.clear()
	}
}

const clientsCache = new ClientCache()
export default clientsCache;