import React, { useEffect, useState } from 'react'
import { clamp, colorScheme } from '../../../../node-helpers/helperFunctions'
import "./slider.scss"

const Slider = ({id, name, type}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [value, setValue] = useState(440/8192*100)
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [achilles, setAchilles] = useState(false)
  const [tortoise, setTortoise] = useState(false)
  const [unit, setUnit] = useState(100/8192)
  const centered = false

  const handleMouseDown = (event) => {
    setIsDragging(true)
    setInitialX(event.clientX)
    
  }


  const handleMouseMove = (event) => {
    if (isDragging && event.clientX > 0) {
      if (achilles) {
        const val = value + ((event.clientX - initialX) * unit * 10)
        setValue(clamp(val, 0.1, 100))
      } else if (tortoise) {
        const val = value + (event.clientX - initialX) * unit / 10
        setValue(clamp( val, 0.1, 100))
      } else{
        const val = value + (event.clientX - initialX) * unit
        setValue(clamp(val, 0.1, 100))
      }
    }
  }


  const handleMouseUp = () => {
    setIsDragging(false)
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  const handleKeyDown = (event) => {
    if (event.keyCode === 17) {
      setAchilles(true)
    }
    if (event.keyCode === 16) {
      setTortoise(true)
    }
   }

  const handleKeyUp = () => {
    setAchilles(false)
    setTortoise(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);

      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [])

  return (
    <div 
      className='slider-wrapper'>
      <div 
        className='header'>
        {name}
      </div>
      <div  
        className='slider-comp'
        onMouseDown={handleMouseDown}
        style={{
                background: `linear-gradient(270deg, #272727 ${(100 - value)}%, ${colorScheme[type]})`
              }}
        >
        <div 
          id={id}
          className='slider'
          onMouseDown={e => handleMouseDown(e)}
          style={{
            color: colorScheme["natural"],
          }}
          >
        </div> 
      </div>
        <div 
          className='value'
          >
          {parseInt(value/unit)} Hz
        </div>
    </div> 
  )
}

export default Slider
