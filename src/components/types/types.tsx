export interface Node {
  id: string,
  name: string, 
  position: {x: number, y: number},
  size: {x: number, y: number}
}

export interface Nodes {
  [key: string]: Node
}