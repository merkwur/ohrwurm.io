import React from 'react'
import "./socket.scss"

interface OutputProps {
  id: string, 
}

const OutputSocket: React.FC<OutputProps> = ({id}) => {
  return (
    <div 
      className='socket'
      id={id}
      data-socket="output"
      style={{
        backgroundColor: `#${7777777}`,
        top: `calc(50% - 7.5px)`,
        right: `${3}%`,
        background: `radial-gradient(circle at 50%, #272727, #272727 40%, #${777} 55%, #272727 100%)`,
        
      }}
      >
      
    </div>
  )
}

export default OutputSocket
