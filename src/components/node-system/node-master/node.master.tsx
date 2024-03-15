import React, { useEffect, useState } from 'react'
import { Node } from '../../types/types'
import "./node.master.scss"

interface NodeMasterProps {
  node: Node
  deleteNode: (
    id: string
  ) => void
}



const NodeMaster: React.FC<NodeMasterProps> = ({node, deleteNode}) => {


  return (
    <div 
      className='node-container'
      onContextMenu={() => deleteNode(node.id)}
      id={node.id}
      style={{
        width: `${node.size.x}px`, 
        height: `${node.size.y}px`,
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
      }}
    >
      <div className='node-haeder'>
        {node.name}
      </div>      
    </div>
  )
}

export default NodeMaster
