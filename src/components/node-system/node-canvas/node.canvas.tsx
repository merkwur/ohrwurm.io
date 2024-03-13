import React, { useEffect, useState } from 'react'
import "./node.canvas.scss"
import NodeMenu from '../node-menu/node.menu'
import { Nodes } from '../../types/types'
import { addNode } from '../node-helpers/nodeData'
import NodeMaster from '../node-master/node.master'

const NodeCanvas = () => {
  const [snapSize, setSnapSize] = useState<number>(40)
  const [nodeData, setNodeData] = useState<Nodes>({})

  
  const handeRightClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
  }

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
  }

  const handleAddNode = (x: number, y: number, name:string) => {
    console.log(x, y, name)
    const nodes = addNode(x, y, name, nodeData)
    setNodeData(nodes)
  }

  useEffect(() => {console.log(nodeData)},[nodeData])

  return (
    <div 
    className='canvas'
    onContextMenu={handeRightClick}
    onMouseDown={handleMouseDown}
    style={{
        backgroundSize: `${snapSize*2}px ${snapSize*2}px, ${snapSize}px ${snapSize}px`
      }}
    >
      <NodeMenu getNodeInfo={(x, y, name) => handleAddNode(x, y, name)}/>
      
      {Object.keys(nodeData).map((node, index) => (
        <React.Fragment key={node+index}>
          <NodeMaster node={nodeData[node]}/>
        </React.Fragment>
      ))}

    </div>
  )
}

export default NodeCanvas
