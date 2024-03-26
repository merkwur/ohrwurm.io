import React, { } from 'react'
import { Node } from '../../types/types'
import "./node.master.scss"
import OscillatorNode from '../nodes/oscillator-node/oscillator.node'
import CoreNodes from '../nodes/core-nodes/core.nodes'

interface NodeMasterProps {
  node: Node
  deleteNode: (
    id: string
  ) => void
  getRef: (ref: HTMLElement | null) => void
}



const NodeMaster: React.FC<NodeMasterProps> = ({node, deleteNode, getRef}) => { 
  //const ref = useRef(null)

  return (
    <div 
      className='node-container'
      onContextMenu={() => deleteNode(node.id)}
      id={node.id}
      ref={(ref) => getRef(ref)}
      style={{
        width: `${node.size.x}px`, 
        height: `${node.size.y}px`,
        left: `${node.position.x}px`,
        top: `${node.position.y}px`,
      }}
    >
      {node.name === "Oscillator" ? (
        <OscillatorNode node={node}/>
      ) : node.name === "Destination" ? (
        <CoreNodes node={node} />
      ) :  null}
    </div>
  )
}

export default NodeMaster
