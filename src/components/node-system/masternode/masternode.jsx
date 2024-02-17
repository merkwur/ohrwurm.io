import React, { useEffect, useRef, useState } from 'react'
import "./masternode.scss"
import Core from '../node-components/core/core'
import Source from '../node-components/source/source'
import Instrument from '../node-components/instruments/instruments'
import { colorScheme } from '../node-helpers/helperFunctions'
import Effect from '../node-components/effects/effect'
import Component from '../node-components/component/component'
import Signal from '../node-components/signal/signal'
import ComponentAnalyser from '../node-components/component-analyser/component-analyser'




const MasterNode =  ({node, 
                      snapSize,
                      updateNodePosition, 
                      removeNode, 
                      addLine, 
                      updateLinePosition,                     
                      getValidMoves,
                      validMoves,
                      tone
                    }) => {

  const [isDragging, setIsDragging] = useState(false)
  const [isNodeDragging, setIsNodeDragging] = useState(false)
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
  const [isNodeSelected, setIsNodeSelected] = useState(false)
    

  



  const handleMouseDown = (event) => {
    setLineMode(false)
    event.preventDefault()
    const x = event.clientX
    const y = event.clientY
    const topElement = document.elementFromPoint(x, y)
    
    setInitialX(x - parseInt(topElement.parentElement.style.left)-70)
    setInitialY(y - parseInt(topElement.parentElement.style.top)-70)

    setIsDragging(true)      
    console.log(topElement.class) 
    if (topElement.className && typeof topElement.className === "string" && topElement.className.includes("container")) {
      setIsNodeDragging(true)
      const grabbedNode = nodeRef.current[node.id]
      nodeRef.current[node.id].style.zIndex = 99 
      nodeRef.current[node.id].style.boxShadow = `0 0 3px 2px ${colorScheme[node.type]}42`
      setDraggedNode(grabbedNode)
      if (grabbedNode) {
      }
    }
    if (topElement.getAttribute("sockettype")) {
      
      
      const {left, top} = topElement.getBoundingClientRect()
      setLine({ from: topElement.id, 
                fromType: topElement.getAttribute("whichparent"),               
                sx: Math.floor(left) + 5,
                sy: Math.floor(top) + 5 
              })
      setLineMode(true)      
    }
  }


  const handleMouseMove = (event) => {
    if (isDragging && !lineMode && isNodeDragging) {
      const handler = setTimeout(() => {
        const mx = event.clientX
        const my = event.clientY
        const x = mx - initialX
        const y = my - initialY

        const sx = Math.floor(x/snapSize)*snapSize-snapSize + 5
        const sy = Math.floor(y/snapSize)*snapSize-snapSize + 5

        setSnapsX(sx)
        setSnapsY(sy)
      }, 20)
      return () => clearTimeout(handler)
    }
  }



  useEffect(() => {
    if (isDragging && !lineMode && isNodeDragging) {
      const currentNode = nodeRef.current[node.id]
      const diffX = (parseInt(currentNode.style.left) - snapX)
      const diffY = (parseInt(currentNode.style.top) - snapY) 
      currentNode.style.left = `${snapX}px`
      currentNode.style.top =  `${snapY}px`
      updateNodePosition(draggedNode.id, parseInt(draggedNode.style.left), 
                                           parseInt(draggedNode.style.top))

      // this update line position method is somewhat a garbage but works ok.                                      
      updateLinePosition(-diffX, -diffY, currentNode.id)
    }
  }, [snapX, snapY])


  
  const handleMouseUp = (event) => {
    setIsDragging(false)
    setIsNodeDragging(false)
    if (lineMode) {
      const dragEndElement = document.elementFromPoint( event.clientX, event.clientY)
      
      if (dragEndElement.id !== line.from) {

        if (dragEndElement.getAttribute("sockettype")) {
          const {left, top} = dragEndElement.getBoundingClientRect()
          setLine(l => ({...l,  ex: Math.floor(left) + 5, 
                                ey: Math.floor(top) + 5, 
                                to: dragEndElement.id,
                                toType: dragEndElement.getAttribute("whichparent"),
                                which: dragEndElement.getAttribute("sockettype")
  
                                }))
        setIsConnectionValid(true)                            
        console.log("ladhs")
        }
      }
    }
    nodeRef.current[node.id].style.boxShadow = null
    setIsNodeSelected(false)
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
      className={`masternode-container ${isNodeSelected ? "selected" : ""}`}
      id={node.id}
      style={{left: node.position.x, top: node.position.y, zIndex: "1"}}
      ref={(ref) => (nodeRef.current[node.id] = ref)}
      onMouseDown={(event) => handleMouseDown(event)}
      onContextMenu={(id) => handleRemoveNode(node.id)}
      
    >
     {
      node.type === "Core" ? (
            <Core
              node={node}
            />
        
      ) : node.type === "Source" ? (
        <Source node={node}/> 
      ) : node.type === "Instrument" ? (
        <Instrument node={node}/>
      ) : node.type === "Effect"? (
        <Effect node={node}/>
      ) : node.type === "Component" ? (
        <>
          {node.name === "Analyser" ? (
            <ComponentAnalyser node={node} tone={tone}/>
          ) : (
            <Component node={node}/>
          )}
        </>
      ) : node.type === "Signal" ? (
        <Signal node={node} />
      ): null 
     }

    </div>
  )
}

export default MasterNode
