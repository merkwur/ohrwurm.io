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
  console.log(line)
  if(
      !line    || !lines   || !line.id ||
      !line.sx || !line.sy || !line.ex  || !line.ey ||
      !line.to || !line.from || !line.which
    ) { throw new Error("Invalid line properties") }
  
  if (line.from === line.to) return [lines, nodes]

  let id: string
  if (line.to === "pointer") {
    id = "pointer"
    
  } else {
    id = line.from + ">" + line.to + "=" + line.which
  }



  if (id !== "pointer") {
    console.log("do we even execute this line/")
    const updatedNodes = JSON.parse(JSON.stringify(nodes))
    const fromNode = Object.keys(nodes).find((node: string) => nodes[node].id === line.from)  
    const toNode = Object.keys(nodes).find((node: string) => nodes[node].id === line.to)  
    updatedNodes[fromNode!].output.node.push(toNode)
    if (Array.isArray(updatedNodes[toNode!].input[line.which])) {
      updatedNodes[toNode!].input[line.which].push(fromNode)
    } else {
      updatedNodes[toNode!].input[line.which] = fromNode
    }

    line.id = id
    const updatedLines: Lines = {...lines} 
    updatedLines[id] = line
    
    return [updatedLines, updatedNodes]
  } else {

    line.id = id
    const updatedLines: Lines = {...lines} 
    updatedLines[id] = line
  
  
    return [updatedLines, nodes]
  }

}

export const deleteLine = (id: string, lines: Lines, nodes: Nodes): Lines => {
  
  if (!lines[id]) return lines
  const [from, to, which] = id.split(/>|=/)
  const updatedNodes = JSON.parse(JSON.stringify(nodes))

  //updatedNodes[from].output.node.filter((n: string) => n !== to)
  //updatedNodes[to].input[which] = null

  const {[id]: _, ...updatedLines}: Lines = lines

  return updatedLines
}

export const updatePointerPosition = (x: number, y: number, lines: Lines): Lines => {
  const newLines = JSON.parse(JSON.stringify(lines));
  newLines["pointer"].ex = x
  newLines["pointer"].ey = y
  return newLines
}

export const updateLinePosition = (id: string, xOff: number, yOff: number, lines: Lines): Lines => {
  const updatedLines = Object.keys(lines).reduce((acc, line) => {
    const [from, to] = line.split(/>|=/);
    let whichLine = lines[line];
    if (id === from) {
      whichLine = { ...whichLine, sx: xOff + 70, sy: yOff-60};
    } else if (id === to) {
      whichLine = { ...whichLine, ex: xOff , ey: yOff - 60 };
    }
    return { ...acc, [line]: whichLine };
  }, {});
  return updatedLines;
}