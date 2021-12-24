import { Socket } from "socket.io";
import { APIResponse } from "../../src/api";
import { EventHandler, getCatchableHandler } from "../../src/event/events";

describe("getCatchableHandler", () => {
	it("catches errors and returns a 500 status code", () => {
		const errorMsg = "bruh";
		const handler: EventHandler = () => {
			throw new Error(errorMsg);
		};
		const catchableHandler = getCatchableHandler(handler);
		catchableHandler(undefined as unknown as Socket, {}, (response: APIResponse) => {
			expect(response).toEqual({
				status: 500,
				message: errorMsg
			});
		});
	}); 
})