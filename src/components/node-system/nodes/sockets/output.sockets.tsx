import React from 'react'
import "./socket.scss"

interface OutputProps {
  id: string, 
}

const OutputSocket: React.FC<OutputProps> = ({id}) => {
  return (
    <div 
      className='output-socket'
      id={id}
      data-socket="output"
      style={{
        backgroundColor: `#070707`,
        top: `calc(50% - 7.5px)`,
        right: `${0}%`,
      }}
      >
      
    </div>
  )
}

export default OutputSocket
