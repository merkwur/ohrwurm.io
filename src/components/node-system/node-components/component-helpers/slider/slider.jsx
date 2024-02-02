import React, { useEffect, useRef, useState } from 'react'
import "./slider.scss"
import { colorScheme } from '../../../node-helpers/helperFunctions'
import { clamp } from '../../../node-helpers/helperFunctions'

const Slider = ({
                  id, 
                  type
                }) => {

  const [isDragging, setIsDragging] = useState(false)
  const [value, setValue] = useState({x:18, y:18})
  const [paramsId, setParamsId] = useState(null)
  const [initialX, setInitialX] = useState(0)
  const [achilles, setAchilles] = useState(false)
  const [tortoise, setTortoise] = useState(false)
  const knobRef = useRef()


  const handleMouseDown = (event) => {
    setIsDragging(true)
    setInitialX(event.clientX)
    setParamsId(event.target.id)
  }

  const handleMouseMove = (event) => {
    if (isDragging && event.clientX > 0) {
      const rect = knobRef.current.getBoundingClientRect();
      const x = value.x + clamp(event.clientX - rect.left, -15, 15);
      const y = value.y + clamp(event.clientY - rect.top, -15, 15);
      setValue({ x, y });
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
    const knob = knobRef.current
    if (isDragging && knob) {
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
    <div className='control-knob'
         id={`${id}:knob`}
         style={{
           backgroundColor: '#f00', // Example color
           left: `${value.x}px`, 
           top: `${value.y}px`,
           position: 'absolute', // Ensure this is absolute or fixed
         }}
         onMouseDown={handleMouseDown}
         ref={knobRef}>
    </div>
  );
};

export default Slider;
