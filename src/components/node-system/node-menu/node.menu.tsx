import React, { useEffect, useState } from 'react'
import "./node.menu.scss"
import { positionHandler } from '../node-helpers/node.navigation'

const NodeMenu = () => {
  const nodeList: string[] = ["a", "b", "c", "d"]
  const [isDragging, setIsDragging] = useState<boolean>(false)  


  const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = (event) => {
    const px: number = event.clientX
    const py: number = event.clientY
    const {x, y} = positionHandler(px, py, 40)
    console.log(`clicked on ${x} ${y}`)
    setIsDragging(true)
  }

  const handleMouseMove = (event: MouseEvent) => {
    const px: number = event.clientX
    const py: number = event.clientY
    const {x, y} = positionHandler(px, py, 40)
    console.log(`clicked on ${x} ${y}`)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

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
    <div className='node-menu-wrapper'>
      <div className='node-menu'>
        <div className='node-parent-list'>
          {nodeList.map((node, index) => (
            <div 
              className='node-parents'
              key={node+index}
              style={{height: `${100/nodeList.length}%`}}
            >    
              {node}
            </div>
          ))}
        </div>
        <div className='node-menu-content'>
          <div 
            className='node-snap'
            onMouseDown={handleMouseDown}
          >
              oscillator
          </div>
        </div>
      </div>
    </div>
  )
}

export default NodeMenu
