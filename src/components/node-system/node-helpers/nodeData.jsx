import {v4 as uuidv4} from "uuid"
import { getToneObject, getNodeParameters, disposeToneNode, stopEvents } from "./toneData"



export const addNode = (x, y, name, type, snapSize, nodes) => {
  const id = name + ":" + uuidv4().split("-")[0]
  const snappedX = (Math.floor(x / snapSize) * snapSize) + 5
  const snappedY = (Math.floor(y / snapSize) * snapSize) + 5
  const normX = Math.floor((snappedX-5) / 40)
  const normY = Math.floor((snappedY-5) / 40)
  const cellIndex = 48 * normY + normX 
  const reducedIndex = 24 * Math.floor(normY / 2) + Math.floor(normX / 2)
  const newNode = {
    id, 
    name, 
    size: getSize(name, type, snapSize*2 - 10),
    input: getInputs(name,type),  
    position: {x: snappedX, y: snappedY},
    cellIndices: {x: normX, y: normY},
    reducedIndex: reducedIndex,
    positionIndices: {x: Math.floor(normX/2), y: Math.floor(normY/2)},
    connection: [],
    cellIndex: cellIndex,
    type, 
  }

  const updatedNodes = {...nodes, [id]: newNode}
  return updatedNodes
}

// make the position object and store all the pos data there, and by that 
// I can prevent node overlap => no node overlaps 
// data can be store an array of zeros and ones where the nodes are lies is ones empty places are 0




export const deleteNode = (id, nodes, lines) => {
  if (!nodes[id]) {
    throw new Error('Node ID not found');
  }
  
  const node = nodes[id];
  
  // Use reduce to iterate over connections and accumulate updates
  const [updatedNodes, updatedLines] = node.connection.reduce(
    ([currentNodes, currentLines], connectionId) => {
      const [newLines, newNodes] = deleteLine(connectionId, currentLines, currentNodes);
      return [newNodes, newLines];
    },
    [nodes, lines] // Initial values
    );
    
    // Now remove the node itself
    const { [id]: _, ...finalNodes } = updatedNodes;
    
    return [finalNodes, updatedLines];
    
    
  }
  
  
  
  
  export const addLine = (lineProps, lines, nodes) => {

    console.log("here we are adding a line")
    // Validate input
    if (
      !lines || 
      !nodes ||
      !lineProps || 
      !lineProps.to || 
      !lineProps.from || 
      !lineProps.which 
      ) {
        throw new Error('Invalid line properties');
      }
      
      const fromId = lineProps.from;
      const toId = lineProps.to;
      const which = lineProps.which;
      
      // Generate a unique identifier for the line
      const id = `${fromId}>${toId}=${which}`;
      
      // Check if the line already exists to avoid duplication
      if (lines[id]) {
        return [lines, nodes];
      }
      
      // Clone the nodes object to maintain immutability
      const newNodes = JSON.parse(JSON.stringify(nodes));
      
      // Ensure the node ids exist in the nodes object
      if (!newNodes[fromId] || !newNodes[toId]) {
        throw new Error('Node ID not found');
      }
      
      
      newNodes[fromId].connection.push(id);
      newNodes[toId].connection.push(id);
      
      if (which !== "node") {
        newNodes[toId].input[which] = fromId;
      } else {
        if (!Array.isArray(newNodes[toId].input[which])) {
      newNodes[toId].input[which] = [];
    }
    newNodes[toId].input[which].push(fromId);
  }
  
  // Clone the lines object to maintain immutability
  const newLines = { ...lines, [id]: lineProps };
  
  return [newLines, newNodes];
}




export const deleteLine = (id, lines, nodes) => {
  if (!lines[id]) {
    throw new Error('Line ID not found');
  }
  
  const line = lines[id];
  const { [id]: _, ...updatedLines } = lines;
  
  // Ensure nodes for the line exist
  if (!nodes[line.from] || !nodes[line.to]) {
    throw new Error('Node ID not found');
  }
  
  // Clone the nodes object to maintain immutability
  const updatedNodes = JSON.parse(JSON.stringify(nodes));
  
  // Update connections for both 'from' and 'to' nodes
  
  updatedNodes[line.from].connection = updatedNodes[line.from].connection.filter(c => c !== id)
  updatedNodes[line.to  ].connection = updatedNodes[line.to  ].connection.filter(c => c !== id)
  
  if (line.which === "node")  {
    console.log(updatedNodes[line.to].input.node, id)
    updatedNodes[line.to].input.node = updatedNodes[line.to].input.node.filter(i => i !== line.from)
  } else {
    updatedNodes[line.to].input[line.which] = null
  }
  
  return [updatedLines, updatedNodes];
}




export const updateNodePositions = (id, x, y, nodes) => {

  const normX = (Math.floor(x / 40)) 
  const normY = (Math.floor(y / 40)) 
  const cellIndex = 48 * normY + normX
  const rx = Math.floor(normX/2)  
  const ry = Math.floor(normY/2)
  const reducedIndex = 24 * ry + rx

  const updatedNodes = JSON.parse(JSON.stringify(nodes))
  updatedNodes[id].position.x = x
  updatedNodes[id].position.y = y
  updatedNodes[id].cellIndex = cellIndex
  updatedNodes[id].reducedIndex = reducedIndex
  updatedNodes[id].cellIndices.x = normX
  updatedNodes[id].cellIndices.y = normY
  updatedNodes[id].positionIndices.x = rx
  updatedNodes[id].positionIndices.y = ry
  
  return updatedNodes
}

export const checkIfPositionIsValid = (x, y, id, nodes) => {
  let nx = x;
  let ny = y;
  
  for (const nodeKey of Object.keys(nodes)) {
    const node = nodes[nodeKey]; 
    if (node.id !== id) {
      if (Math.abs(nx - node.positionIndices.x) < 1) {return [1, 0]}
      if (Math.abs(ny - node.positionIndices.y) < 1) {return [0, 1]}
    }
  }

  return [1, 1];
};



export const updateLinePosition = (x, y, id, lines) => {
  
  const updateLines = JSON.parse(JSON.stringify(lines))
  Object.keys(updateLines).forEach(line => {
    
    if (line.includes(id)) {
      if (updateLines[line].from === id) {
        updateLines[line].sx += x;
        updateLines[line].sy += y;
      } else {
        updateLines[line].ex += x;
        updateLines[line].ey += y; // Corrected from ex to ey
      }
      
    }
  })
  return updateLines
}




const getSize = (name, type, snap) => {
  const nodeSizeData = {
    Core: {
      Destination: {x: snap, y: snap},
      Gain: {x: snap, y: snap},
      Transport: {x: snap, y: snap},
    },
    Source: {
      Oscillator: {x: snap, y: snap},
      FatOscillator: {x: snap, y: snap},
      PulseOscillator: {x: snap, y: snap},
      PWMOascillator: {x: snap, y: snap},
      Noise: {x: snap, y: snap},
      AMOscillator: {x: snap, y: snap * 2}, 
      FMOscillator: {x: snap, y: snap * 2},
    }
  }

  return nodeSizeData[type][name]
}




const getInputs = (name, type) => {
  const nodeInputData = {
    Core: {
      Destination: {
        node: [],
      }, 
      Gain: {
        gain: null, 
        node: [] 
      },
      Transport: null, 
    },
    Source: {
      AMOscillator: {
        harmonicity: true,
        frequency: true, 
        detune: true
      }, 
      Oscillator: {
        frequency: null, 
        detune: null, 

      }
    }
  }

  return nodeInputData[type][name]
}

