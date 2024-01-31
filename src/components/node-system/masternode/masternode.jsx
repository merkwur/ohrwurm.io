import React, { useEffect, useRef, useState } from 'react'
import "./masternode.scss"
import Core from '../node-components/core/core'
import Source from '../node-components/source/source'



const MasterNode =  ({node, 
                      snapSize,
                      updateNodePosition, 
                      removeNode, 
                      addLine, 
                      updateLinePosition,
                      isPositionValid,
                      positionState


                    }) => {

  const [isDragging, setIsDragging] = useState(false)
  const [offset, setOffset] = useState({x: 0, y: 0})
  const [draggedNode, setDraggedNode] = useState()
  const nodeRef = useRef({})
  const [lineMode, setLineMode] = useState(false)
  const [fromNode, setFromNode] = useState({id: "", type: "", class: ""})
  const [isConnectionValid, setIsConnectionValid] = useState(false)
  const [line, setLine] = useState({})
  const [initialX, setInitialX] = useState(0);
  const [initialY, setInitialY] = useState(0);
  const [reversed, setReversed] = useState(false)
  const [snapX, setSnapsX] = useState(0)
  const [snapY, setSnapsY] = useState(0)
  const [previousPosition, setPreviousPosition] = useState({x: 0, y: 0})



  const handleMouseDown = (event) => {
        
    setLineMode(false)
    event.preventDefault()
    const x = event.clientX
    const y = event.clientY
    const topElement = document.elementFromPoint(x, y)
    setInitialX(topElement.style.left - snapSize / 4)
    setInitialY(topElement.style.top  - snapSize / 4)
    setIsDragging(true)      
    
    if (topElement.className.includes("container")) {
      const grabbedNode = nodeRef.current[node.id]
      nodeRef.current[node.id].style.zIndex = 99 
      setDraggedNode(grabbedNode)
      if (grabbedNode) {
      }
    }
    if (topElement.getAttribute("sockettype")) {
      
      console.log("we have a socket: ", topElement.getAttribute("sockettype"))
      setFromNode({ id: topElement.id, 
                    type: topElement.getAttribute("whichparent"), 
                    class: topElement.className
                  })
      setLineMode(true)      
    }
  }


  const handleMouseMove = (event) => {
    if (isDragging && !lineMode) {
      const mx = event.clientX
      const my = event.clientY
      const x = mx - initialX
      const y = my - initialY
      const sX = Math.floor(x/snapSize)*snapSize-snapSize + 5
      const sY = Math.floor(y/snapSize)*snapSize-snapSize + 5
      setSnapsX(sX)
      setSnapsY(sY)
      
    }
  }


  useEffect(() => {
    if (isDragging && !lineMode) {
      const currentNode = nodeRef.current[node.id]
      const diffX = (parseInt(currentNode.style.left) - snapX) / 40
      const diffY = (parseInt(currentNode.style.top) - snapY) / 40
      isPositionValid(snapX, snapY, node.id)
      
      currentNode.style.left = `${snapX}px`
      currentNode.style.top =  `${snapY}px`

      updateNodePosition(draggedNode.id, parseInt(draggedNode.style.left),  
                                         parseInt(draggedNode.style.top))
      updateLinePosition(diffX * 40, diffY * 40, currentNode.id)
      setPreviousPosition({x: snapX, y: snapY})
    }
  }, [snapX, snapY])


  
  const handleMouseUp = (event) => {
    if (isDragging  && !lineMode) {
      updateNodePosition(draggedNode.id, parseInt(draggedNode.style.left),  
                                         parseInt(draggedNode.style.top))
    } else {
      console.log("we have an end node: ", fromNode)
      nodeRef.current[node.id].style.zIndex = 1 
    }
    setIsDragging(false)
  }


  useEffect(() => {
    if (isConnectionValid) {
      addLine(line, reversed)
      setIsConnectionValid(false)
    }
    setLine({})
  }, [isConnectionValid])



  const handleRemoveNode = (id) => {
    removeNode(id)
  }


  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);



  useEffect(() => {
  }, [node])



  return (
    <div 
      className='masternode-container'
      id={node.id}
      style={{left: node.position.x, top: node.position.y, zIndex: "1"}}
      onMouseDown={(event) => handleMouseDown(event)}
      ref={(ref) => (nodeRef.current[node.id] = ref)}
      onContextMenu={(id) => handleRemoveNode(node.id)}
    >
     {
      node.type === "Core" ? (
        <>
          {
            node.name !== "Tramsport" ? (
              <Core
                node={node}
              />
            ) : (
              <div>
                here will be destination component
              </div>
            )
          }
        </>
        
      ) : node.type === "Source" ? (
        <Source node={node}/> 
      ) : null 
     }

    </div>
  )
}

export default MasterNode
