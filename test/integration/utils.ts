import { Server, Socket as ServerSocket } from "socket.io";
import Client, { Socket as ClientSocket } from "socket.io-client"
import { AddressInfo } from "net"
import { createServer } from "http"
import { addListeners } from "../../src/utils";

export const createTestingServer = (onInit: (s: Server, address: AddressInfo) => void): Server => {
	let io: Server;
	const httpServer = createServer();
	io = new Server(httpServer);
	httpServer.listen(() => {
		onInit(io, httpServer.address() as AddressInfo);
	});
	return io;
}

export const createTestingClient = (url: string, onConnect: () => void): ClientSocket => {
	const clientSocket = Client(url);
	clientSocket.on("connect", () => {
		onConnect();
	});
	return clientSocket;
}

export const createTestingSetup = (onConnection: (s: ServerSocket) => void) => new Promise<[Server, ServerSocket, ClientSocket]>((resolve, reject) => {
	let clientSocket: ClientSocket, serverSocket: ServerSocket;
	const io = createTestingServer((s, address) => {
		io.on("connection", (socket) => {
			serverSocket = socket
			onConnection(socket)
		})
		clientSocket = createTestingClient(`http://localhost:${address.port}`, () => resolve([io, serverSocket, clientSocket]));
	});
})