import React, { useEffect, useState } from 'react'
import "./node-canvas.scss"
import Navbar from '../../nav-bar/navbar'
import {addNode, 
        updateNodePositions,
        addLine,
        deleteLine,
        deleteNode,
        updateLinePosition,      
        checkPositionValid,
        
      } from '../node-helpers/nodeData'

import LineCanvas from '../node-helpers/lineCanvas'
import { handleToneBackend, invokeTriggerEvent} from '../node-helpers/toneData'
import MasterNode from '../masternode/masternode'
import NodeConfigurationHub from '../node-configuration-hub/node-configuration-hub'


const height = window.innerHeight - (window.innerHeight * .25)
const width = 1920
const rows = Math.floor((height ) / (40 * 2)) * 2
const cols = Math.floor((width ) / (40 * 2))  * 2

const NodeCanvas = () => {
  const [nodeData, setNodeData] = useState({})
  const [lineData, setLineData] = useState([])
  const [triggerData, setTriggerData] = useState({})
  const [globalTime, setGlobalTime] = useState(0)
  const [snapSize, setSnapSize] = useState(40)
  const [positionArray, setPositionArray] = useState(Array(cols * rows).fill(0))  
  const [x, setX] = useState()
  const [y, setY] = useState()



  const getNodeInfo = (x, y, node) => {
    setX(x)
    setY(y)
    const updatedNodes = addNode(x, y, node.name, node.type, snapSize, nodeData)

    setNodeData(updatedNodes)    
  }


  useEffect(() => { 
    const arr = [...positionArray] 

    const snappedX = (Math.floor(x / snapSize) * snapSize) + 5
    const snappedY = (Math.floor(y / snapSize) * snapSize) + 5
    console.log("y: ", Math.floor((snappedY-5) / (80)), 
                "x: ", Math.floor((snappedX-5) / (80) ))
    const normX = Math.floor((snappedX-5) / 40)
    const normY = Math.floor((snappedY-5) / 40)

    console.log(normX, normY, cols*normY + normX)
    arr[cols*normY + normX] = 1

    setPositionArray(arr)
  }, [nodeData])


  const nodeRemove = (id) => {
    const updated = deleteNode(id, nodeData, lineData)
    setNodeData(updated[0])
    setLineData(updated[1])
    
  }
 
  useEffect(() => {console.log("x: ", )}, [])

  const handleAddLine = (line) => {
    if (line) {
      const updated = addLine(line, lineData, nodeData)
      
      setLineData(updated[0])
      setNodeData(updated[1])
    }
  }
  
  const handleDeleteLine = (id) => {
    const updates = deleteLine(id, lineData, nodeData)
    setLineData(updates[0])
    setNodeData(updates[1])
  }
  
  const handlePositionData = (x, y) => {
    // check if is possition valid
    const isPositionValid = checkPositionValid(x, y)

  }

  const handleLinePositionUpdate = (x, y, id) => {
    const updatedLines = updateLinePosition(x, y, id, lineData)    
    setLineData(updatedLines)
  }

  const handleNotesToTrigger = (arr, ids, bpm) => {
    // some issue about the recursion 
    setTriggerData({notes: arr, instruments: ids, bpm: bpm})
  }

   useEffect(() => {console.log(nodeData)}, [nodeData])
  // useEffect(() => {console.log(lineData)}, [lineData])
  

  const handleGlobalTime = (time) => {
    setGlobalTime(time)
  }
  useEffect(() => {
    invokeTriggerEvent(triggerData, nodeData)
  }, [globalTime])  


  const handleToneConnection = (from, to, type) => {
    handleToneBackend(from, to, type, nodeData)
  }

  const handeLeftClick = (event) => {
    const targetNode = document.elementFromPoint(event.clientX, event.clientY)
    event.preventDefault()
    if (targetNode.id) {
      const updatedNodes = nodeRemove(event.target.id)
      return updatedNodes
    }
  }
  const handleMouseDown = (event) => {
    event.preventDefault()
  }

  const updateNodePosition = (currentNodeId, x, y) => {
    const arr = [...positionArray]
    const normX = (Math.floor(x / snapSize) * snapSize) / snapSize 
    const normY = (Math.floor(y / snapSize) * snapSize) / snapSize 
    arr[normY * cols + normX] = 1
    setPositionArray(arr)
    
    const updatedNodes = updateNodePositions(currentNodeId, x, y, nodeData)
    
    setNodeData(updatedNodes)

  }


  return (
    <div 
      className='canvas'
      onContextMenu={(event) => handeLeftClick(event)}
      onMouseDown={(event) => handleMouseDown(event)}
      
      style={{
        backgroundSize: `${snapSize*2}px ${snapSize*2}px, ${snapSize}px ${snapSize}px`
      }}
    >
        <div 
          className='position-map'
          style={{
              width: "384px",
              height: "144px",
              position: "absolute",
              right: "0",
              bottom: "40%",
              backgroundColor: "#171717",
              backgroundSize: "10px",
              backgroundImage: 
                  `radial-gradient(to right, #22dbc027 1px, transparent 1px),
                    radial-gradient(to bottom, #77777717 1px, transparent 1px)`
          }}
          >
          {
            positionArray.map((item, index) => (
            <div 
                className='cells'
                key={index}
                style={{
                  position: "absolute",
                  left: `${(index % 48) * 8}px`, // Assuming each cell + border is 9px wide
                  top: `${Math.floor(index / 48) * 8}px`, // Assuming each cell + border is 9px high
                  backgroundColor: item === 0 ? "#171717" : "#ff4242", // Corrected hex color codes
                  width: "8px",
                  height: "8px",
                  border: ".01rem solid #77777717" // Corrected border color
                }}
              >
              </div>
            ))}
        </div>
      <Navbar getNodeInfo={(x, y, node) => getNodeInfo(x, y, node)}/>    
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
                addToneConnection={(from, to, type) => handleToneConnection(from, to, type)}
                addLine={(line) => handleAddLine(line)}
                updateLinePosition={(x, y, id) => handleLinePositionUpdate(x, y, id)}
                isLineExist={lineData ? lineData.length > 0 : false}
                notesToTrigger={(arr, ids, bpm) => handleNotesToTrigger(arr, ids, bpm)}
                getGlobalTime={(time) => handleGlobalTime(time)}
                isPositionValid={(x, y) => handlePositionData(x, y)}
              />
            </React.Fragment>
          );  
        })}
      <NodeConfigurationHub />
      <LineCanvas 
        lines={lineData} 
        deleteLine={id => handleDeleteLine(id)}
      />
    </div>
  )
}

export default NodeCanvas
