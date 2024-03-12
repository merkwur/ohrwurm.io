import React, { useState } from 'react'
import "./node.canvas.scss"
import NodeMenu from '../node-menu/node.menu'

const NodeCanvas = () => {
  const [snapSize, setSnapSize] = useState<number>(40)

  const handeRightClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
  }

  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
  }
  

  return (
    <div 
    className='canvas'
    onContextMenu={handeRightClick}
    onMouseDown={handleMouseDown}
    style={{
        backgroundSize: `${snapSize*2}px ${snapSize*2}px, ${snapSize}px ${snapSize}px`
      }}
    >
      <NodeMenu />

    </div>
  )
}

export default NodeCanvas
