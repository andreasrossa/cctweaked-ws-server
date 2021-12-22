import { createServer } from "http"
import { AddressInfo } from "net"
import { Server, Socket as ServerSocket } from "socket.io"
import Client, { Socket as ClientSocket } from "socket.io-client"
import { get200Response } from "../../src/api";
import { TurtleEventHandlers } from "../../src/events";
import { addListeners } from "../../src/utils";

const errorMsg = "bruh"

const testHandlers: TurtleEventHandlers = {
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
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = (httpServer.address() as AddressInfo | null)?.port ?? 0;
      clientSocket = Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
				addListeners(testHandlers, socket);
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
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
