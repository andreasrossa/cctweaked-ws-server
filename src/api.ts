export type APIResponse = {
	status: number,
	message?: string
}

export type APIMessageResponse = APIResponse & { message: string }

export type BadRequestErrorResponse = APIResponse & { status: 400 }

export const get200Response = (message?: string) => ({
	status: 200,
	message
})
	
export const get400Response = (message: string): BadRequestErrorResponse => ({
	status: 400,
	message,
})

export const get500Response = (message: string): APIResponse => ({
	status: 500,
	message,
})