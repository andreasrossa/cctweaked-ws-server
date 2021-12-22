import { ClientMetadata } from "./clientCache"

export type APIResponse = {
	status: number,
	message?: string
}

export type APIMessageResponse = APIResponse & { message: string }

export type BadRequestErrorResponse = APIResponse & { status: 400 }

export type QueryMatchType = "all" | "any"

export const isMatchType = (x: any): x is QueryMatchType => x === "all" || x === "any"

export type MetadataSelector<T extends ClientMetadata = ClientMetadata> = {
	metadata: T
	matchType?: {
		[key in keyof T]: QueryMatchType
	}
}

export type ClientQuerySelector = MetadataSelector| { ids: string[] }
	
export type ClientQuery = {
	query: ClientQuerySelector
}

export const hasClientQuery = (x: unknown): x is ClientQuery => {
	const cast = x as ClientQuery
	return cast.query !== undefined &&
		((cast.query as { ids: string[] }).ids !== undefined || 
		(cast.query as { metadata: ClientMetadata }).metadata !== undefined)
}

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