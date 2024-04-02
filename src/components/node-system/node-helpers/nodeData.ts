import {v4 as uuid4} from "uuid"
import { Nodes, Node, Line, Lines } from "../../types/types"
import { getSockets } from "./IO"

interface Size {
  x: number,
  y: number
}

export const addNode = (x:number, y:number, name:string, snap: number, nodes: Nodes): Nodes => {
  const id: string = name + ":" + uuid4().split("-").pop()
  const {input, output} = getSockets(name)
  const newNode: Node = {
    id, 
    name, 
    input,
    output,
    position: {x, y}, 
    size: getNodeSize(name, snap)
  }

  const updatedNodes: Nodes = {...nodes}
  updatedNodes[id] = newNode
  return updatedNodes
}

export const deleteNode = (id: string, nodes: Nodes): Nodes | undefined => {
  if (!nodes[id]) return undefined
  const { [id]: __, ...updatedNodes} = nodes
  return updatedNodes
}

const getNodeSize = (name: string, snap: number): Size => {
  const nodeSizes: {[key: string]: Size} = {
    osc: {x: snap * 2 - 10, y: snap * 2 - 10}
  }
  return nodeSizes[name] || {x: snap * 2 - 10, y: snap * 2 - 10}
}

export const updateNodePositions = (id: string, x: number, y: number, nodes: Nodes): Nodes => {
  const updatedNodes = JSON.parse(JSON.stringify(nodes))
  updatedNodes[id].position.x = x
  updatedNodes[id].position.y = y
  return updatedNodes
}

export const addLine = (line: Line, lines: Lines, nodes: Nodes): [Lines, Nodes]=> {
  
  if(
      !line    || !lines   || !line.id ||
      !line.sx || !line.sy || !line.ex  || !line.ey ||
      !line.to || !line.from || line.which
    ) { throw new Error("Invalid line properties") }
  
  if (line.from === line.to) return [lines, nodes]

  let id: string
  if (line.to === "pointer") {
    id = "pointer"
  } else {
    id = line.from + ">" + line.to
  }

  const updatedNodes = JSON.parse(JSON.stringify(nodes))



  line.id = id
  const updatedLines: Lines = {...lines}
  updatedLines[id] = line


  return [updatedLines, updatedNodes]
}

export const deleteLine = (id: string, lines: Lines, nodes: Nodes): Lines => {
  
  if (!lines[id]) return lines
  const [from, to, which] = id.split(/>|:/)

  const updatedNodes = JSON.parse(JSON.stringify(nodes))

  updatedNodes[from].output.node.filter((n: string) => n !== to)
  updatedNodes[to].input[which] = null

  const {[id]: _, ...updatedLines}: Lines = lines

  return updatedLines
}

export const updatePointerPosition = (x: number, y: number, lines: Lines): Lines => {
  const newLines = JSON.parse(JSON.stringify(lines));
  newLines["pointer"].ex = x
  newLines["pointer"].ey = y
  return newLines
}

export const updateLinePosition = (line: Line, lines: Lines): Lines => {
  if (line) {
    
  }
  return lines
}