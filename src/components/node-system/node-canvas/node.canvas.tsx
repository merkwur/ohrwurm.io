import React, { useCallback, useEffect, useRef, useState} from 'react'
import "./node.canvas.scss"
import NodeMenu from '../node-menu/node.menu'
import NodeMaster from '../node-master/node.master'
import { Nodes } from '../../types/types'
import { addNode, deleteNode, updateNodePositions } from '../node-helpers/nodeData'
import { positionHandler } from '../node-helpers/node.navigation'
import { throttle } from 'lodash'

const NodeCanvas = () => {
  const [snapSize, setSnapSize] = useState<number>(40)
  const [nodePosition, setNodePosition] = useState<{x: number, y:number}>({x: 0, y:0})
  const [nodeData, setNodeData] = useState<Nodes>({})
  const [isDragging, setIsDragging] = useState<boolean>(false) 
  const [initialPositions, setInitialPositions] = useState<{x: number, y: number}>({x: 0, y: 0})
  const [currentId, setCurrentId] = useState<string>("")
  const nodeRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    const node = document.elementFromPoint(event.clientX, event.clientY) as HTMLElement
    if (node && node.id && !node.getAttribute("data-socket")) {
      setIsDragging(true)
      const x = parseInt(node.style.left) - event.clientX + 40
      const y = parseInt(node.style.top) - event.clientY + 40
      setInitialPositions({x:x,y:y})
      setCurrentId(node.id)
    }
  }

  const handleMouseMove = useCallback(
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
    }, 50), [isDragging, currentId] );

  const handleMouseUp = () => {
    setIsDragging(false)
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

  // useEffect(() => {console.log(nodeData)},[nodeData])

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
