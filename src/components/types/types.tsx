export interface Node {
  id: string,
  name: string, 
  input: {} | string | undefined, 
  output: {} | undefined,
  position: {x: number, y: number},
  size: {x: number, y: number},
  connection: [] | undefined
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

export interface Channel {
  id: number, 
  input: undefined | string, 
  pan: undefined | number, 
  volume: undefined | number, 
}

export interface Mixer {
  0 : Channel, 
  1 : Channel, 
  2 : Channel, 
  3 : Channel, 
  4 : Channel, 
  5 : Channel, 
  6 : Channel, 
  7 : Channel, 
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
