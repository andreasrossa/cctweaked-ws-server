import { Server } from "socket.io";

let io: Server

const setIo = (i: Server): Server => {
	io = i
	return io
}

const getIo = (): Server => io

const IO = {
	set: setIo, 
	get: getIo
}

export default IO;