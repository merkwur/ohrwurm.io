import React, { useCallback, useEffect, useRef, useState} from 'react'
import "./node.canvas.scss"
import NodeMenu from '../node-menu/node.menu'
import NodeMaster from '../node-master/node.master'
import { Lines, Nodes, Line } from '../../types/types'
import { addLine, addNode, deleteNode, updateNodePositions } from '../node-helpers/nodeData'
import { positionHandler } from '../node-helpers/node.navigation'
import { throttle } from 'lodash'
import LineCanvas from '../line-canvas/line.canvas'

const NodeCanvas = () => {
  const [snapSize, setSnapSize] = useState<number>(40)
  const [nodePosition, setNodePosition] = useState<{x: number, y:number}>({x: 0, y:0})
  const [nodeData, setNodeData] = useState<Nodes>({})
  const [lineData, setLineData] = useState<Lines>({})
  const [pseudoLine, setPseudoLine] = useState<Line>({sx:0,sy:0,ex:0,ey:0,from:"",to:"pointer"})
  const [isDragging, setIsDragging] = useState<boolean>(false) 
  const [lineDragging, setLineDragging] = useState<boolean>(false)
  const [initialPositions, setInitialPositions] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [currentId, setCurrentId] = useState<string>("")
  const nodeRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    const node = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement
    const dataAttr = node.getAttribute("data-socket")
    if (node && node.id && !dataAttr) {
      setIsDragging(true)
      const x = parseInt(node.style.left) - event.clientX + 70
      const y = parseInt(node.style.top) - event.clientY + 70
      setInitialPositions({x:x,y:y})
      setCurrentId(node.id)
    } else if(node && node.id && dataAttr) {
      console.log("we are draggin a line babeeee!")
      setLineDragging(true)
      const {left, top, right, bottom} = node.getBoundingClientRect() 
      const sx = left + (right-left) / 2
      const sy = top  + (bottom-top) / 2
      const updatedLines = addLine({sx: sx, sy:sy, ex:event.clientX, ey:event.clientY, from: node.id, to: "pointer"}, lineData)
      setLineData(updatedLines)
    }
  }

  const nodePositionHandler = useCallback(
    throttle((event: MouseEvent) => {
      if (isDragging) {
        const tx = event.clientX - initialPositions.x
        const ty = event.clientY - initialPositions.y
        const {x, y} = positionHandler(tx, ty, snapSize)
        const currentNode = document.getElementById(currentId) as HTMLElement
        if (currentNode) {
          currentNode.style.left = `${x}px`
          currentNode.style.top = `${y}px`
          setNodePosition({x: x, y: y})
          const updated = updateNodePositions(currentId, x, y, nodeData)
          setNodeData(updated)
        }
      }
    }, 50), [isDragging, currentId])


  const linePositionHandler = (event: MouseEvent) => {
    setPseudoLine({...pseudoLine, ex: event.clientX, ey: event.clientY})
  } 

  const handleMouseMove = (event: MouseEvent) => {
    if (isDragging) {
      nodePositionHandler(event)
    }
    if (lineDragging) {
      linePositionHandler(event)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setLineDragging(false)
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

  const updateLinePosition = (id: string) => {

  }

  const handleLineDeletion = (id: string) => {  
    console.log(`delete line call for ${id}`)
  }

  // useEffect(() => {console.log(nodeData)},[nodeData])
  useEffect(() => {console.log(lineData)}, [lineData])

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

  return (
    <div 
    className='canvas'
    onContextMenu={handeRightClick}
    onMouseDown={handleMouseDown}
    style={{
        backgroundSize: `${snapSize*2}px ${snapSize*2}px, ${snapSize}px ${snapSize}px`,
      }}
    >
      <LineCanvas 
        lines={lineData} 
        deleteLine={(id) => handleLineDeletion(id)}
       />
      <NodeMenu getNodeInfo={(x, y, name) => handleAddNode(x, y, name)}/>
      {Object.keys(nodeData).map((node, index) => (
        <div 
          key={node+index}
          ref={(ref) => (nodeRef.current[nodeData[node].id] = ref)}
          >
          <NodeMaster 
            node={nodeData[node]}
            deleteNode={(id) => handleDeleteNode(id)}       
          />
        </div>
      ))}
    </div>
  )
}

export default NodeCanvas
