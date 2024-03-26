import React, { useCallback, useEffect, useRef, useState} from 'react'
import "./node.canvas.scss"
import NodeMenu from '../node-menu/node.menu'
import NodeMaster from '../node-master/node.master'
import { Lines, Nodes } from '../../types/types'
import { addLine, addNode, deleteNode, updateNodePositions, updatePointerPosition } from '../node-helpers/nodeData'
import { positionHandler } from '../node-helpers/node.navigation'
import { throttle } from 'lodash'
import LineCanvas from '../line-canvas/line.canvas'


const NodeCanvas = () => {
  const snapSize = 40
  const [nodeData, setNodeData] = useState<Nodes>({})
  const [lineData, setLineData] = useState<Lines>({})
  const [isNodeDragging, setIsNodeDragging] = useState<boolean>(false) 
  const [isLineDragging, setIsLineDragging] = useState<boolean>(false)
  const [initialPositions, setInitialPositions] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [currentId, setCurrentId] = useState<string>("")
  const nodeRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [yOffset, setYOffset] = useState<number>(window.innerHeight * .1)

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    const node = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement
    const dataAttr = node.getAttribute("data-socket")
    if (node && node.id && !dataAttr) {
      setIsNodeDragging(true)
      const x = parseInt(node.style.left) - event.clientX + 70
      const y = parseInt(node.style.top) - event.clientY + 70
      setInitialPositions({x:x,y:y})
      setCurrentId(node.id)
    } else if(node && node.id && dataAttr) {
      console.log("we are draggin a line babeeee!")
      setIsLineDragging(true)
      const {left, top, right, bottom} = node.getBoundingClientRect() 
      const sx = left + (right-left) / 2
      const sy = top + (bottom-top) / 2 - yOffset
      console.log(sx, sy, event.clientX, event.clientY)
      const updatedLines = addLine({id: "pointer",sx: sx, sy:sy, ex:event.clientX, ey:event.clientY - yOffset, from: node.id, to: "pointer"}, lineData)
      setLineData(updatedLines)
    }
  }

  useEffect(() => {
    setYOffset(window.innerHeight * .1)
  }, [window.innerHeight])

  const nodePositionHandler = useCallback(
    throttle((event: MouseEvent) => {
      if (isNodeDragging) {
        const tx = event.clientX - initialPositions.x
        const ty = event.clientY - initialPositions.y
        const {x, y} = positionHandler(tx, ty, snapSize)
        const currentNode = document.getElementById(currentId) as HTMLElement
        if (currentNode) {
          currentNode.style.left = `${x}px`
          currentNode.style.top = `${y}px`
          const updated = updateNodePositions(currentId, x, y, nodeData)
          setNodeData(updated)
        }
      }
    }, 50), [isNodeDragging, currentId])


  const linePositionHandler = (event: MouseEvent) => {
    const updatedLines = updatePointerPosition(event.clientX, event.clientY-yOffset, lineData)
    setLineData(updatedLines)
  } 

  const handleMouseMove = (event: MouseEvent) => {
    if (isNodeDragging) {
      nodePositionHandler(event)
    } else if (isLineDragging) {
      linePositionHandler(event)
    }
  }

  const handleMouseUp = (event: MouseEvent) => {
    setIsNodeDragging(false)
    if (isLineDragging) {
      const dragEndElement = document.elementFromPoint(event.clientX, event.clientY)
      if (dragEndElement && dragEndElement.getAttribute("data-socket")) {
        const line = {...lineData.pointer}
        const {left, top, right, bottom} = dragEndElement.getBoundingClientRect() 
        const ex = left + (right-left) / 2
        const ey = top + (bottom-top) / 2 - yOffset
        line.ex = ex
        line.ey = ey
        line.to = dragEndElement.id
        const updatedLine = addLine(line, lineData)
        setLineData(updatedLine)
      }
    }
    setIsLineDragging(false)
  }

  const handeRightClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
  }



  const handleAddNode = (x: number, y: number, name:string) => {
    console.log(x, y, name)
    const nodes = addNode(x, y, name, snapSize, nodeData)
    setNodeData(nodes)
  }

  const handleDeleteNode = (id: string) => {
    console.log(`delete call for ${id}`)
    const nodes = deleteNode(id, nodeData)
    if (nodes) setNodeData(nodes)
  }

  const handleLineDeletion = (id: string) => {  
    console.log(`delete line call for ${id}`)
  }

  // useEffect(() => {console.log(nodeData)},[nodeData])
  useEffect(() => {console.log(lineData)}, [lineData])

  useEffect(() => {
    if (isNodeDragging || isLineDragging) {
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
  }, [isNodeDragging, isLineDragging]);

  const handleAddRed = (ref: any, node: string) => {
    nodeRef.current[nodeData[node].id] = ref
  }

  return (
    <div 
    className='canvas'
    onContextMenu={handeRightClick}
    onMouseDown={handleMouseDown}
    style={{
        backgroundSize: `${snapSize*2}px ${snapSize*2}px, ${snapSize}px ${snapSize}px`,
      }}
    >
      <NodeMenu getNodeInfo={(x, y, name) => handleAddNode(x, y, name)}/>
      <LineCanvas 
        lines={lineData} 
        deleteLine={(id) => handleLineDeletion(id)}
        isLineDragging={isLineDragging}
       />
      {Object.keys(nodeData).map((node, index) => (
        <React.Fragment 
          key={node+index}
          >
          <NodeMaster 
            node={nodeData[node]}
            deleteNode={(id) => handleDeleteNode(id)}       
            getRef={(ref) => handleAddRed(ref, node)}
          />
        </React.Fragment>
      ))}
    </div>
  )
}

export default NodeCanvas
