import React from 'react'
import { Node } from '../../types/types'
import "./node.master.scss"

interface NodeMasterProps {
  node: Node
}

const NodeMaster: React.FC<NodeMasterProps> = ({node}) => {

  return (
    <div 
      className='node-container'
      style={{
        width: `${node.size.x}px`, 
        height: `${node.size.y}px`,
        left: `${node.position.x}px`,
        top: `${node.position.y}px`
      }}
    >
      <div className='node-haeder'>
        {node.name}
      </div>      
    </div>
  )
}

export default NodeMaster
