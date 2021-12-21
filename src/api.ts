export type APIResponse = {
	status: number
}

export type EventErrorResponse = APIResponse & {
	errorMessage: string
}

export type EventValidationErrorResponse = EventErrorResponse & { status: 400 }