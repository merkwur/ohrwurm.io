import React from 'react'
import { Node } from '../../../types/types'
import InputSocket from '../sockets/input.socket'

interface CoreProps {
  node: Node
}

const MixerInput: React.FC<CoreProps> = ({node}) => {
  return (
    <>
      <div className='node-header'>
        {node.name}
      </div>
        <div>
        {node.input && Object.keys(node.input).map((n, i) => (
          <React.Fragment key={n+i}>
            <InputSocket id={node.id} inputType='node'/>
          </React.Fragment>
        ))}
      </div>
    </>

  )
}

export default MixerInput
