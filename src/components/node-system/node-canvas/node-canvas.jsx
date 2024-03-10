import React, { useEffect, useState } from 'react'
import "./node-canvas.scss"
import Navbar from '../../nav-bar/navbar'
import {addNode, 
        updateNodePositions,
        addLine,
        deleteLine,
        deleteNode,
        updateLinePosition,      
      } from '../node-helpers/nodeData'

import LineCanvas from '../node-helpers/lineCanvas'
import { connectToneObjects, disconnectToneNode, disposeToneNode, invokeTriggerEvent} from '../node-helpers/toneData'
import MasterNode from '../masternode/masternode'
import NodeConfigurationHub from '../node-configuration-hub/node-configuration-hub'
import { isConnectionValid } from '../node-helpers/connectionData'


const NodeCanvas = () => {
  const [nodeData, setNodeData] = useState({})
  const [lineData, setLineData] = useState({})
  const [toneData, setToneData] = useState({})
  const [snapSize, setSnapSize] = useState(40)
  const [valids, setValids] = useState([]) 

  // gets the node name from navabr drag'n drop gestures and creates the node
  const getNodeInfo = (x, y, node) => {
    const hasAlready = Object.keys(nodeData).find(n => 
      nodeData[n].name === "Transport" && node.name === "Transport" 
      || nodeData[n].name === "Destination" && node.name === "Destination")
    if (hasAlready) {
      console.log(`There is only one ${node.name} object can  be present at a time!`)
      return 
    }
    const updatedNodes = addNode(x, y, node.name, node.type, snapSize, nodeData, toneData)
    setNodeData(updatedNodes[0])   
    setToneData(updatedNodes[1])
  }

  const nodeRemove = (id) => {
    const updated = deleteNode(id, nodeData, lineData, toneData)
    disposeToneNode(id, toneData, nodeData)
    setNodeData(updated[0])
    setLineData(updated[1])
    setToneData(updated[2]) 
  }
 
  // if the connection type and the connection is possible creates a line between the nodes
  const handleAddLine = (line) => {
    console.log(line)
    if (line && isConnectionValid(line.from.split(":")[0], line.which, line.to.split(":")[0], line.fromType)) {
      const updated = addLine(line, lineData, nodeData)
      const connected = connectToneObjects(line.from, line.to, line.which, toneData)  
      setLineData(updated[0])
      setNodeData(updated[1])
      if (connected) {
        setToneData(connected)
      }
    }
  }
  
  const handleDeleteLine = (id) => {
    const updates = deleteLine(id, lineData, nodeData)
    disconnectToneNode(lineData[id].from, lineData[id].to, lineData[id].which, toneData)
    setLineData(updates[0])
    setNodeData(updates[1])
  }
  
  // if line exists, updates the position when the node position changes
  const handleLinePositionUpdate = (x, y, id) => {
    const updatedLines = updateLinePosition(x, y, id, lineData)    
    setLineData(updatedLines)
  }
  
  // this is a bridge function between transport object and the tone.triggerEvent()
  const handleTrigger = (notes, durations, probabilities, id, bpm) => {
    const instruments = nodeData[id].connection.map(item => item.split(">")[1].split("=")[0])
    if (!instruments || instruments.length === 0) return
    invokeTriggerEvent(notes, durations, probabilities, instruments, bpm, toneData)
  }
  
  const handeLeftClick = (event) => {
    event.preventDefault()
  }
  const handleMouseDown = (event) => {
    event.preventDefault()
  }
  
  const updateNodePosition = (currentNodeId, x, y) => {
    const updatedNodes = updateNodePositions(currentNodeId, x, y, nodeData)
    setNodeData(updatedNodes)  
  }

  useEffect(() => {console.log(toneData)}, [toneData])

  return (
    <div 
    className='canvas'
    onContextMenu={(event) => handeLeftClick(event)}
    onMouseDown={(event) => handleMouseDown(event)}
    
    style={{
        backgroundSize: `${snapSize*2}px ${snapSize*2}px, ${snapSize}px ${snapSize}px`
      }}
    >

      <Navbar 
        getNodeInfo={(x, y, node) => getNodeInfo(x, y, node)}
        snapSize={snapSize}
        />    
        {Object.keys(nodeData).map(nodeId => {        
          const node = nodeData[nodeId];
          return (
            <React.Fragment key={node.id}>
              <MasterNode 
                key={node.id} 
                node={node}
                snapSize={snapSize}      
                updateNodePosition={(currentNodeId, x, y) => updateNodePosition(currentNodeId, x, y)}
                removeNode={(id) => nodeRemove(id)}
                addLine={(line) => handleAddLine(line)}
                updateLinePosition={(x, y, id) => handleLinePositionUpdate(x, y, id)}
                isLineExist={lineData ? lineData.length > 0 : false}
                notesToTrigger={(arr, ids, bpm) => handleNotesToTrigger(arr, ids, bpm)}
                getValidMoves={(x, y, id) => handleValidMoves(x, y, id)}
                validMoves={valids}
                tone={node.name === "Analyser" || node.type === "Signal" || node.name === "Gain"  ? toneData[node.id] : null}
                />
            </React.Fragment>
          );  
        })}
      
      <NodeConfigurationHub 
        tone={toneData} 
        trigger={(notes, durations, probabilities, id, bpm) => handleTrigger(notes, durations, probabilities, id, bpm)}
        />
      <LineCanvas 
        lines={lineData} 
        deleteLine={id => handleDeleteLine(id)}
        />
    </div>
  )
}

export default NodeCanvas
