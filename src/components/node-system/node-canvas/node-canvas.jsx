import React, { useEffect, useState } from 'react'
import "./node-canvas.scss"
import Navbar from '../../nav-bar/navbar'
import {addNode, 
        updateNodePositions,
        addLine,
        deleteLine,
        deleteNode,
        updateLinePosition,      
        getValidMoves,
        
      } from '../node-helpers/nodeData'

import LineCanvas from '../node-helpers/lineCanvas'
import { addToneObject, connectToneObjects, disconnectToneNode, disposeToneNode, invokeTriggerEvent} from '../node-helpers/toneData'
import MasterNode from '../masternode/masternode'
import NodeConfigurationHub from '../node-configuration-hub/node-configuration-hub'


const height = window.innerHeight - (window.innerHeight * .25)
const width = 1920
const rows = Math.floor((height ) / (40 * 2)) * 2
const cols = Math.floor((width ) / (40 * 2))  * 2

const NodeCanvas = () => {
  const [nodeData, setNodeData] = useState({})
  const [lineData, setLineData] = useState({})
  const [toneData, setToneData] = useState({})
  const [triggerData, setTriggerData] = useState({})
  const [globalTime, setGlobalTime] = useState(0)
  const [snapSize, setSnapSize] = useState(40)
  const [positionArray, setPositionArray] = useState(Array(cols * rows).fill(0))  
  const [reducedPositionArray, setReducedPositioniArray] = useState(Array(Math.floor(cols * rows / 4)).fill(0))  
  const [zeros, setZeros] = useState(Array(cols * rows).fill(0))
  const [reducedZeros, setReducedZeros] = useState(Array(Math.floor(cols * rows / 4)).fill(0))
  const [positionDebug, setPositionDebug] = useState(false)
  const [valids, setValids] = useState([]) 

  const getNodeInfo = (x, y, node) => {
    const updatedNodes = addNode(x, y, node.name, node.type, snapSize, nodeData, toneData)
    setNodeData(updatedNodes[0])   
    setToneData(updatedNodes[1])
  }


  useEffect(() => { 
    // this is an extremely basic and slow approach
    // can be solved by using simple svg canvas and rects.
    // however, it is good for stress testing. 
    const arr = [...zeros] 
    const reducedArr = [...reducedZeros]
    const posArr = []
    Object.keys(nodeData).forEach(node => {
      arr[nodeData[node].cellIndex] = 1
      if (nodeData[node].size.y > 70){
        reducedArr[nodeData[node].reducedIndex + 24] = 1
        arr[nodeData[node].cellIndex+48] = 1
        arr[nodeData[node].cellIndex+(48*2)] = 1
      }
      reducedArr[nodeData[node].reducedIndex] = 1
      posArr.push(nodeData[node].id, nodeData[node].positionIndices)
    })
    
    setPositionArray(arr)
    setReducedPositioniArray(reducedArr)
  }, [nodeData])


  const nodeRemove = (id) => {
    const updated = deleteNode(id, nodeData, lineData, toneData)
    disposeToneNode(id, toneData)
    setNodeData(updated[0])
    setLineData(updated[1])
    setToneData(updated[2]) 
  }
 

  const handleAddLine = (line) => {
    if (line) {
      const updated = addLine(line, lineData, nodeData)
      connectToneObjects(line.from, line.to, line.which, toneData)  
      setLineData(updated[0])
      setNodeData(updated[1])
    }
  }
  
  const handleDeleteLine = (id) => {
    const updates = deleteLine(id, lineData, nodeData)
    disconnectToneNode(lineData[id].from, lineData[id].to, lineData[id].which, toneData)
    setLineData(updates[0])
    setNodeData(updates[1])
  }
  
  
  const handleLinePositionUpdate = (x, y, id) => {
    const updatedLines = updateLinePosition(x, y, id, lineData)    
    setLineData(updatedLines)
  }
  
  const handleNotesToTrigger = (notes, probabilities, durations, bpm) => {
    const ids = nodeData["Transport"].connection.map(e => e.split(">")[1].split("=")[0])
    setTriggerData({notes: notes, 
                    instruments: ids, 
                    probabilities: probabilities, 
                    durations: durations, 
                    bpm: bpm})
  }
  
  // useEffect(() => {console.log(nodeData)}, [nodeData])
  // useEffect(() => {console.log(lineData)}, [lineData])
  useEffect(() => {console.log(toneData)}, [toneData])


  
  
  const handleGlobalTime = (time) => {
    setGlobalTime(time)
  }
  useEffect(() => {
    invokeTriggerEvent(triggerData, toneData, nodeData)
  }, [globalTime])  
  
  
  
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

  const handleValidMoves = (x, y, id) => {
    const validMoves = getValidMoves(x, y, id, nodeData)
    
    setValids(validMoves)
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
        className='position-debug'
        style={{
          position: "absolute", 
          right: "5%",
          bottom: "30%",
          width: "50px", height: "30px", 
          backgroundColor: "#171717", borderRadius: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#777",
          fontSize: "8pt"

        }}
        onClick={() => setPositionDebug(!positionDebug)}
      > pDebug
      </div>
      <div>
      { positionDebug ? (
        <>
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
        <div 
            className='position-map'
            style={{
                width: "384px",
                height: "144px",
                position: "absolute",
                right: "0",
                bottom: "60%",
                backgroundColor: "#171717",
                backgroundSize: "10px",
                backgroundImage: 
                    `radial-gradient(to right, #22dbc027 1px, transparent 1px),
                      radial-gradient(to bottom, #77777717 1px, transparent 1px)`
            }}
            >
            {
              reducedPositionArray.map((item, index) => (
              <div 
                  className='cells'
                  key={index}
                  style={{
                    position: "absolute",
                    left: `${(index % 24) * 16}px`, // Assuming each cell + border is 9px wide
                    top: `${Math.floor(index / 24) * 16}px`, // Assuming each cell + border is 9px high
                    backgroundColor: item === 0 ? "#171717" : "#ff4242", // Corrected hex color codes
                    width: "16px",
                    height: "16px",
                    border: ".01rem solid #77777717" // Corrected border color
                  }}
                >
                </div>
              ))}
        </div>
        </>
      ) : null}
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
                addLine={(line) => handleAddLine(line)}
                updateLinePosition={(x, y, id) => handleLinePositionUpdate(x, y, id)}
                isLineExist={lineData ? lineData.length > 0 : false}
                notesToTrigger={(arr, ids, bpm) => handleNotesToTrigger(arr, ids, bpm)}
                getValidMoves={(x, y, id) => handleValidMoves(x, y, id)}
                validMoves={valids}
                />
            </React.Fragment>
          );  
        })}
      <NodeConfigurationHub 
        tone={toneData} 
        notesToTrigger={(notes, probabilities, durations, bpm) => handleNotesToTrigger(notes, probabilities, durations, bpm)}
        getGlobalTime={(time) => handleGlobalTime(time)}
        />
        <LineCanvas 
          lines={lineData} 
          deleteLine={id => handleDeleteLine(id)}
        />
    </div>
  )
}

export default NodeCanvas
