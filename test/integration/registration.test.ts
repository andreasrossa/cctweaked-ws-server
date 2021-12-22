import { Server } from "socket.io";
import * as socketIo from "socket.io"
import { Socket as ClientSocket } from "socket.io-client" 
import { addListeners } from "../../src/utils";
import eventHandlers from "../../src/event/handlers"
import clientCache from "../../src/clientCache";
import { get200Response, get500Response } from "../../src/api";
import { createTestingSetup } from "./utils";


describe("Registration event", () => {
	let io: Server, serverSocket: socketIo.Socket, clientSocket: ClientSocket;

	beforeAll((done) => {
		createTestingSetup((s) => {
			addListeners(eventHandlers, s);
		}).then(r => {
			[io, serverSocket, clientSocket] = r;
			done();
		})
	});

	afterAll(() => {
		io.close();
		clientSocket.close();
	});

	beforeEach(() => {
		clientCache.clear();
		clientSocket.removeAllListeners()
	})

		
	it("adds a new client with the correct socket", (done) => {
		const registerArgs = {
			id: "cool",
			metadata: {
				group: ["coolgroup"]
			}
		}

		clientSocket.emit("register", registerArgs, (res: any) => {
			expect(res.status).toEqual(get200Response().status);
			const client = clientCache.getClient("cool")
			expect(clientCache.getClientList()).toEqual([client])
			expect(client?.id).toBe("cool")
			expect(client?.socketId).toBe(clientSocket.id)
			expect(client?.metadata).toStrictEqual(registerArgs.metadata)
			done()
		})
	})

	it("returns 500 if client already exists", (done) => {
		const registerArgs = {
			id: "cool",
			metadata: {
				group: ["coolgroup"]
			}
		}

		clientSocket.emit("register", registerArgs, (res1: any) => {
			expect(res1.status).toEqual(get200Response().status);
			clientSocket.emit("register", registerArgs, (res2: any) => {
				expect(res2.status).toEqual(get500Response("").status);
				done()
			})
		})
	})
})