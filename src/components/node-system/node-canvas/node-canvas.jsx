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
  const [reducedPositionArray, setReducedPositionArray] = useState(Array(Math.floor(cols * rows / 4)).fill(0))  
  const [zeros, setZeros] = useState(Array(cols * rows).fill(0))
  const [reducedZeros, setReducedZeros] = useState(Array(Math.floor(cols * rows / 4)).fill(0))
  const [positionDebug, setPositionDebug] = useState(false)
  const [valids, setValids] = useState([]) 

  const getNodeInfo = (x, y, node) => {
    const hasAlready = Object.keys(nodeData).find(n => nodeData[n].name === "Transport" && node.name === "Transport")
    if (hasAlready) {
      console.log("There is only one Transport object can  be present at a time!")
      return 
    }
    const updatedNodes = addNode(x, y, node.name, node.type, snapSize, nodeData, toneData)
    setNodeData(updatedNodes[0])   
    setToneData(updatedNodes[1])
  }


  useEffect(() => { 

    const arr = [...zeros] 
    const reducedArr = [...reducedZeros]
  
    Object.keys(nodeData).forEach(node => {
      if (nodeData[node].sizeNxM) {
        for (let i = 0; i < nodeData[node].sizeNxM.x; i++) {
          for (let j = 0; j <  nodeData[node].sizeNxM.y; j++) {
            reducedArr[(nodeData[node].positionIndices.x+i) + (nodeData[node].positionIndices.y+j) * (cols/2) ] = 1
          }
        }
      } else {
        reducedArr[nodeData[node].reducedIndex] = 1
      }
      
    })
    
    
    setReducedPositionArray(reducedArr)
  }, [nodeData])


  const nodeRemove = (id) => {
    const updated = deleteNode(id, nodeData, lineData, toneData)
    disposeToneNode(id, toneData, nodeData)
    setNodeData(updated[0])
    setLineData(updated[1])
    setToneData(updated[2]) 
  }
 

  const handleAddLine = (line) => {
    if (line) {
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
  
  
  const handleLinePositionUpdate = (x, y, id) => {
    const updatedLines = updateLinePosition(x, y, id, lineData)    
    setLineData(updatedLines)
  }
  
  const handleTrigger = (notes, durations, probabilities, id, bpm) => {
    const instruments = nodeData[id].connection.map(item => item.split(">")[1].split("=")[0])
    if (!instruments || instruments.length === 0) return
    invokeTriggerEvent(notes, durations, probabilities, instruments, bpm, toneData)
  }
  
  //useEffect(() => {console.log(nodeData)}, [nodeData])
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
                bottom: "35%",
                backgroundColor: "#17171742",
                backgroundSize: "10px",
                backgroundImage: 
                    `radial-gradient(to right, #22dbc027 1px, transparent 1px),
                      radial-gradient(to bottom, #77777717 1px, transparent 1px)`,
                zIndex: 99999
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
                    backgroundColor: item === 0 ? "#17171727" : "#ff4242", // Corrected hex color codes
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
                tone={node.name === "Analyser" || node.type === "Signal" || node.name === "Gain" ? toneData[node.id] : null}
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
