import React, { useEffect, useState } from 'react'
import "./knob.scss"
import { clamp } from 'three/src/math/MathUtils'


const Knob = ({id, name, parameterValue, param}) => {

  const [isDragging, setIsDragging] = useState(false)
  const [value, setValue] = useState(parameterValue)
  const [initial, setInitial] = useState(0)
  const [achilles, setAchilles] = useState(false)
  const [tortoise, setTortoise] = useState(false)
  const [unit, setUnit] = useState(param.multiplier)


  const handleMouseDown = (event) => {
    setIsDragging(true)
    setInitial({x: event.clientX, y: event.cientY})  
  }

  const handleMouseMove = (event) => {
    if (isDragging && event.clientX > 0) {
      let newVal
      if (achilles) {
        newVal = value + ((event.clientX - initial.x) * unit * 10)
      } else if (tortoise) {
        newVal = value + Math.floor((Math.sqrt((event.clientX - initial.x)**2 + (event.clientY - initial.y)**2) * unit) / 20)
       
      } else{
        if (name === "length") {
          newVal = value + Math.floor(((event.clientX - initial.x) * unit) / 20)

        } else {
          newVal = value + (event.clientX - initial.x) * unit
        }
      }
      newVal = clamp(newVal, param.min, param.max)
      if(newVal !== value) {
        setValue(newVal)
      }
    }
  }


  useEffect(() => {
    const handler = setTimeout(() => {
     //  getParameter(value, name) 
    }, 20)
    return () => clearTimeout(handler)
  }, [value])

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
    <div className='knob-wrapper'>
      
    </div>
  )
}

export default Knob
