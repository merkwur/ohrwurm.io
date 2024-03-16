import React from 'react'
import { Node } from '../../../types/types'
import "./oscillator.node.scss"
import OutputSocket from '../sockets/output.sockets'

interface OscillatorNodeProps {
  node: Node
}

const OscillatorNode: React.FC<OscillatorNodeProps> = ({node}) => {


  return (
    <>
      <div className='node-header'> 
        {node.name}
      </div>    
      <div>
        {node.output && Object.keys(node.output).map((n, i) => (
          <React.Fragment key={n+i}>
            <OutputSocket id={node.id}/>
          </React.Fragment>
        ))}
      </div>
    </>
  )
}

export default OscillatorNode
