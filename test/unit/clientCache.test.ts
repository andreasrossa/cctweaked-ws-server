import { Client, ClientCache } from "../../src/clientCache";
import crypto from "crypto";

describe("client cache", () => {
	let clientsCache: ClientCache;

	beforeEach(() => {
		clientsCache = new ClientCache();
	});

	it("initialized with 0 clients", () => {
		expect(clientsCache.getClientList().length).toBe(0);
	})

	it("correctly adds and removes clients", () => {
		const client = getClients(1)[0]; 

		clientsCache.addClient(client);
		expect(clientsCache.hasClient(client.id)).toBe(true);
		expect(clientsCache.getClientList().length).toBe(1);

		clientsCache.removeClient(client.id);
		expect(clientsCache.hasClient(client.id)).toBe(false);
		expect(clientsCache.getClientList().length).toBe(0);
	})

	it("contains no more clients after being cleared", () => {
		const clients = getClients(5)

		clients.forEach(client => clientsCache.addClient(client));
		expect(clientsCache.getClientList().length).toBe(5);
		clientsCache.clear();
		expect(clientsCache.getClientList().length).toBe(0);
	})

	it("correctly checks if a client is in the cache", () => {
		const client = getClients(1)[0];

		clientsCache.addClient(client);
		expect(clientsCache.hasClient(client.id)).toBe(true);
	})

	it("correctly checks if there are clients in the cache", () => {
		expect(clientsCache.isEmpty()).toBe(false);
		clientsCache.addClient(getClients(1)[0]);
		expect(clientsCache.isEmpty()).toBe(true);
	})

	it("queries clients correctly by ids", () => {
		const clients = getClients(5)

		clients.forEach(client => clientsCache.addClient(client));
		const queryIds = clients.map(client => client.id).slice(0, 3);

		const query = {
			ids: queryIds
		};

		const queriedClients = clientsCache.query(query);
		expect(queriedClients.length).toBe(3);
	})

	it("queries clients correctly by metadata", () => {
		const clients = getClients(5)

		const uniqueMetadata = {"cool": ["true"]}

		clients[0].metadata = uniqueMetadata

		clients.forEach(client => clientsCache.addClient(client));

		const query = {
			metadata: {
				"key1": ["value1"],
				"key2": ["value2"]
			}
		};

		const queriedClients = clientsCache.query(query);
		expect(queriedClients.length).toBe(4);

		expect(clientsCache.query({ metadata: uniqueMetadata })).toStrictEqual([clients[0]]);
	})

	it("prioritizes ids in the query over metadata", () => {
		const clients = getClients(5)

		const uniqueMetadata = {"cool": ["true"]}

		clients[0].metadata = uniqueMetadata

		clients.forEach(client => clientsCache.addClient(client));

		const query = {
			ids: [clients[0].id],
			metadata: {
				"key1": ["value1"],
				"key2": ["value2"]
			}
		};

		const queriedClients = clientsCache.query(query);
		expect(queriedClients.length).toBe(1);
		expect(queriedClients[0]).toStrictEqual(clients[0]);
	})

})

function getClients(n: number): Client[] {
	return Array(n).fill(0).map((_, i) => {
		return {
			id: `client${i}`,
			metadata: {
				"key1": ["value1"],
				"key2": ["value2"]
			},
			socketId: crypto.randomBytes(16).toString("hex")
		};
	});
}
