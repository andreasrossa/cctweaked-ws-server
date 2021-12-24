# cctweaked-ws-server 
[![Build](https://github.com/andreasrossa/cctweaked-ws-server/actions/workflows/build-dockerize.yml/badge.svg)](https://github.com/andreasrossa/cctweaked-ws-server/actions/workflows/build-dockerize.yml)

WebSocket server using Socket.IO.

## Server Events
- ### _register_ - Add a new client
	The socket id of the client firing the event
	will be used to direct requests to that client.  
	There is currently no way to reassign that connection
	(we're working on that)

	Event shape:
	```typescript
	{
		id: string,
		metadata: Record<string, string[]>
	}
	```

	id's have to be unique.  
	metadata can later be used to query clients.

- ### _run_ - Run a command on one or multiple clients
	Event shape:
	```typescript
	{
		command: string,
		query: {
			ids: string[] | undefined,
			metadata: Record<string, string[]> | undefined
		} | undefined,
		matchTypes: Record<string, 'any' | 'all'> | undefined
	}	
	```

	`query` can be used to direct the event to one or multiple clients.  
	`ids` get priority in the query if the field is defined.  
	`metadata` matches clients by their metadata.  
	By default clients have to include all of the tags to match. This behaviour can be overriden using the matchTypes field.

## Client Events
- ### _runlua_ - Run a lua command
	Triggered by the `run` server-event.

	Event shape:
	```typescript 
	{
		command: string
	}
	```



