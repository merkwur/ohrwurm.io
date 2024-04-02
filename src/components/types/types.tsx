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


export interface Line {
  id: string, 
  sx: number,
  sy: number, 
  ex: number, 
  ey: number,
  from: string, 
  to: string
  which: string | null
}

export interface Lines {
  [key: string]: Line
}

export interface Bezier {
  mx: number, 
  my: number, 
  x1: number,
  y1: number,
  x2: number, 
  y2: number,
  x:  number,
  y:  number
} 

