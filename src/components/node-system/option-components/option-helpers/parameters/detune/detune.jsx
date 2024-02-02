import React, { useEffect, useState } from 'react'
import Slider from '../param-helpers/slider'
import { clamp } from 'three/src/math/MathUtils'
import "./detune.scss"
const Detune = ({id, name, type}) => {

  const [isDragging, setIsDragging] = useState(false)
  const [value, setValue] = useState(0/1200*100)
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [achilles, setAchilles] = useState(false)
  const [tortoise, setTortoise] = useState(false)
  const [unit, setUnit] = useState(100/1200)
  const centered = false
  const height = 40

  const handleMouseDown = (event) => {
    setIsDragging(true)
    setInitialX(event.clientX)
    
  }


  const handleMouseMove = (event) => {
    if (isDragging && event.clientX > 0) {
      if (achilles) {
        const val = value + ((event.clientX - initialX) * unit * 100)
        setValue(clamp(val, -100, 100))
      } else if (tortoise) {
        const val = value + (event.clientX - initialX) * unit / 10
        setValue(clamp( val, -100, 100))
      } else{
        const val = value + (event.clientX - initialX) * unit * 10
        setValue(clamp(val, -100, 100))
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
      className='detune-wrapper'
      >
      <div
        className='header'
        > {`< ${name} >`}
      </div>
      <div 
        className='detune-slider'
        onMouseDown={handleMouseDown}
        >
        <svg width="100" height={height} viewBox={`0 0 100 ${height}`} xmlns="http://www.w3.org/2000/svg">
          <path d={`M ${0-Math.abs(value)} 20 Q ${(value)+12.5} 0, ${(value)+25} 20 T ${(value)+50} 20 T ${(value)+75} 20 T ${100+Math.abs(value)} 20`} stroke="#ff4242" fill="transparent"/>
        </svg>
      <div className='value'>
        {parseInt(value/unit)}
      </div>
      </div>

    </div>
  )
}

export default Detune
