export type TurtleMD = Record<string, string[]>

export type TurtleType = 
	"turtle" |
	"computer"

export type Turtle = {
	id: string,
	metadata: TurtleMD,
	type: TurtleType
}