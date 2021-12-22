import { ClientCache } from "../../src/clientCache";

describe("client cache", () => {
	let clientsCache: ClientCache;

	beforeEach(() => {
		clientsCache = new ClientCache();
	});

	it("initialized with 0 clients", () => {
		expect(clientsCache.getClients().length).toBe(0);
	})

	it("correctly adds and removes clients", () => {
		clientsCache.addClient("client1");
		clientsCache.addClient("client2");
		expect(clientsCache.getClients()).toStrictEqual(["client1", "client2"]);

		clientsCache.removeClient("client1");
		expect(clientsCache.getClients()).toContain("client2");
	})

	it("contains no more clients after being cleared", () => {
		clientsCache.addClient("client1");
		clientsCache.addClient("client2");
		expect(clientsCache.getClients()).toStrictEqual(["client1", "client2"]);

		clientsCache.clear();
		expect(clientsCache.getClients().length).toBe(0);
	})

	it("correctly checks if a client is in the cache", () => {
		clientsCache.addClient("client1");
		clientsCache.addClient("client2");
		expect(clientsCache.hasClient("client1")).toBe(true);
		expect(clientsCache.hasClient("client2")).toBe(true);
		expect(clientsCache.hasClient("client3")).toBe(false);
	})

	it("correctly checks if there are clients in the cache", () => {
		expect(clientsCache.hasClients()).toBe(false);
		clientsCache.addClient("client1");
		expect(clientsCache.hasClients()).toBe(true);
	})

})