import { Server } from "socket.io";

let io: Server

export const getIo = (): Server => io
export const setIo = (i: Server): Server => {
	io = i
	return io
}