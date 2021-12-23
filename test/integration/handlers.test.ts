import { createServer } from "http"
import { AddressInfo } from "net"
import { Server, Socket as ServerSocket } from "socket.io"
import Client, { Socket as ClientSocket } from "socket.io-client"
import { get200Response } from "../../src/api";
import { EventHandlerMap } from "../../src/event/events";
import { addListeners } from "../../src/utils";
import { createTestingSetup } from "./utils";

const errorMsg = "bruh"

const testHandlers: EventHandlerMap = {
	success: (socket: ServerSocket, args, callback) => {
		callback(get200Response())
	},
	throwing: (socket: ServerSocket, args, callback) => {
		throw new Error(errorMsg)
	}
}

describe("event handlers", () => {
	let io: Server, serverSocket: ServerSocket, clientSocket: ClientSocket;

	beforeAll((done) => {
		createTestingSetup((s) => {
			addListeners(testHandlers, s);
		}).then(r => {
			[io, serverSocket, clientSocket] = r;
			done();
		})
	});

	afterAll(() => {
		io.close();
		clientSocket.close();
	});

	it("returns 200 for success callback", (done) => {
		clientSocket.emit("success", {}, (response: any) => {
			expect(response).toEqual(get200Response());
			done();
		});
	});

	it("returns 500 for throwing callback", (done) => {
		clientSocket.emit("throwing", {}, (response: any) => {
			expect(response).toEqual({
				status: 500,
				message: errorMsg
			});
			done();
		});
	})

});
