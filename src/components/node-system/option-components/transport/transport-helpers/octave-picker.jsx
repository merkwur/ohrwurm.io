import React, { useEffect, useState } from 'react'
import { clamp } from 'three/src/math/MathUtils'
import "./octave-picker.scss"

const OctavePicker = ({getParameter, currentKey, currentValue}) => {
  const [octave, setOctave] = useState(currentValue)
  const [isDragging, setIsDragging] = useState(false)
  const [initialX, setInitialX] = useState(0) 


  const handleMouseDown = (event) => {    
    setIsDragging(true)
    setInitialX(event.clientX)
  }


  const handleMouseMove = (event) => {
    const val = octave + -Math.floor((initialX - event.clientX)/5)
    const assing = clamp(val, 1, 8)
    setOctave(assing)
  }

  useEffect(() => {getParameter(octave)}, [octave])

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
    <div 
      className='octave-picker-wrapper'
      onMouseDown={handleMouseDown}
    > 
      <div className='key-octave-pair'>
        {`<${currentKey+octave}>`}
      </div>
    </div>
  )
}

export default OctavePicker
