import React, { useEffect, useState } from 'react'
import "./horizontal-slider.scss"
import { clamp, colorScheme } from '../../../../node-helpers/helperFunctions'
import { initialStates } from '../../../../node-helpers/toneData'




const HorizontalSlider = ({
                            id, 
                            name, 
                            type,
                            param
                          }) => {

  
  const [isDragging, setIsDragging] = useState(false)
  const [value, setValue] = useState(param.value)
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [achilles, setAchilles] = useState(false)
  const [tortoise, setTortoise] = useState(false)
  const [unit, setUnit] = useState(param.multiplier)
  const centered = false
  const height = 25
  const width = 80
  const handleMouseDown = (event) => {
    setIsDragging(true)
    setInitialX(event.clientX)
    
  }


  const handleMouseMove = (event) => {
    if (isDragging && event.clientX > 0) {
      if (achilles) {
        const val = value + ((event.clientX - initialX) * unit * 10)
        setValue(clamp(val, param.min, param.max))
      } else if (tortoise) {
        const val = value + Math.floor(((event.clientX - initialX) * unit) / 20)
        setValue(clamp( val, param.min, param.max))
      } else{
        const val = value + (event.clientX - initialX) * unit
        setValue(clamp(val, param.min, param.max))
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
  }, []); 


  return (
    <div 
      className='frequency-wrapper'
      >
      <div className='header' 
        >
          {`< ${name} >`}
      </div>
      <div 
        className='frequency-slider'
        onMouseDown={handleMouseDown}
        >
      <div className='value'> 
        {param.float ? (value).toFixed(2) : parseInt(value/unit)} {param.unit}
      </div>
      </div>
    </div>
  )
}

export default HorizontalSlider 
