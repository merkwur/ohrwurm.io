import React, { useEffect, useState } from 'react'
import "./frequency.scss"
import { clamp, colorScheme } from '../../../../node-helpers/helperFunctions'


const Frequency = ({id, name, type}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [value, setValue] = useState(440/8192*100)
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [achilles, setAchilles] = useState(false)
  const [tortoise, setTortoise] = useState(false)
  const [unit, setUnit] = useState(100/8192)
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
        const val = value + ((event.clientX - initialX) * unit * 100)
        setValue(clamp(val, 0.1, 100))
      } else if (tortoise) {
        const val = value + (event.clientX - initialX) * unit / 10
        setValue(clamp( val, 0.1, 100))
      } else{
        const val = value + (event.clientX - initialX) * unit * 10
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
        <svg width={width} height={`${height}`} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
        <linearGradient id="freq-grad" >
          <stop offset={`${100-value}%`} stopColor="#ffaaaa22" />
          <stop offset={`${150-value}%`} stopColor="#aaaaff22" />
        </linearGradient>
          <path d={`M 0 ${height} C ${value-10} ${height}, ${value-22} ${0-(value/8)-(value/10)}, ${width-2} ${height}`}  fill="url(#freq-grad)" stroke='#77777777' strokeWidth={2.5}/>
        </svg>
      <div className='value'> 
        {parseInt(value/unit)} Hz
      </div>
      </div>
    </div>
  )
}

export default Frequency
