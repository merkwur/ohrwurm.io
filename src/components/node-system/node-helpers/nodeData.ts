import {v4 as uuid4} from "uuid"
import { Nodes, Node } from "../../types/types"

interface Size {
  x: number,
  y: number
}

export const addNode = (x:number, y:number, name:string, nodes: Nodes): Nodes => {
  const id: string = name + ":" + uuid4().split("-").pop()
  const newNode: Node = {
    id, 
    name, 
    position: {x, y}, 
    size: getNodeSize(name)
  }

  const updatedNodes: Nodes = {...nodes}
  updatedNodes[id] = newNode
  return updatedNodes
}

const getNodeSize = (name: string): Size => {
  const nodeSizes: {[key: string]: Size} = {
    osc: {x: 70, y: 70}
  }
  return nodeSizes[name] || {x: 70, y: 70}
}