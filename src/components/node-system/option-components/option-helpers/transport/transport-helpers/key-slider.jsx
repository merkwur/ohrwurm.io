import React, { useEffect, useState } from 'react'
import "./key-slider.scss"
import { clamp } from 'three/src/math/MathUtils'

const KeySlider = ({currentHeightValue, currentWidthValue, index, getParameter, getWidthParameter}) => {

  
  const [isDragging, setIsDragging] = useState(false)
  const [heightValue, setHeightValue] = useState(currentHeightValue)
  const [widthValue, setWidthValue] = useState(currentWidthValue)
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [achilles, setAchilles] = useState(false)
  const [tortoise, setTortoise] = useState(false)
  const [unit, setUnit] = useState(.01)
  const centered = false
  const height = 25
  const width = 80



  const handleMouseDown = (event) => {
    setIsDragging(true)
    
    setInitialX(event.clientX)  
    setInitialY(event.clientY)  
  }

  const handleMouseMove = (event) => {
    if (isDragging && event.clientY > 0) {
      if (achilles) {
        const val = heightValue + ((event.clientY - initialY) * 10)
        setHeightValue(clamp(val, 0, 1))
        const valY = widthValue + ((event.clientX - initialX) * 10)
        setWidthValue(clamp(val, 0, 1))
      } else if (tortoise) {
        const val = heightValue + Math.floor(((event.clientY - initialY)) * unit)
        setHeightValue(clamp(val, 0, 1))
        const valY = widthValue + ((event.clientX - initialX) * 10)
        setWidthValue(clamp(val, 0, 1))
      } else{
        const val = heightValue + (1 - (event.clientY - initialY)) / 2
        setHeightValue(clamp(val, 0, 100))
        const valY = widthValue + Math.floor((event.clientX - initialX)/10)
        setWidthValue(clamp(valY, 0, 8))
        
      }
    }
  }


  useEffect(() => {
    getParameter(heightValue)
  }, [heightValue])

  useEffect(() => {getWidthParameter(widthValue)}, [widthValue])

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
      className='key-wrapper'
      onMouseDown={handleMouseDown}
      >

      <div 
        className='keys'
        style={{
          height: `${currentHeightValue}%`,
          width: `${currentWidthValue*12.5}%`
        }}
        >
          
      </div>
    </div>    
  )
}

export default KeySlider
