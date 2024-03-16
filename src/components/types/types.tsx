export interface Node {
  id: string,
  name: string, 
  input: {} | undefined, 
  output: {} | undefined,
  position: {x: number, y: number},
  size: {x: number, y: number}
}

export interface Nodes {
  [key: string]: Node
}