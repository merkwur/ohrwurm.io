import React, { useEffect, useState } from 'react'
import "./horizontal-slider.scss"
import { clamp, colorScheme } from '../../../node-helpers/helperFunctions'
import { initialStates } from '../../../node-helpers/toneData'




const HorizontalSlider = ({
                            name, 
                            type,
                            abbreviate,
                            parameterValue,
                            state,
                            whichOscillator,
                            parentOscillator,
                            getParameter, 
                            isParamCentered,
                            from
                          }) => {

  
  const [isDragging, setIsDragging] = useState(false)
  const [value, setValue] = useState(parameterValue)
  const [initialX, setInitialX] = useState(0)
  const [achilles, setAchilles] = useState(false)
  const [tortoise, setTortoise] = useState(false)
  const unit = state.multiplier
  

  const handleMouseDown = (event) => {
    setIsDragging(true)
    setInitialX(event.clientX)  
  }



  const handleMouseMove = (event) => {
    if (isDragging && event.clientX > 0) {
      let newVal
      if (achilles) {
        newVal = value + ((event.clientX - initialX) * unit * 10)
       
      } else if (tortoise) {
        newVal = value + Math.floor(((event.clientX - initialX) * unit) / 20)
       
      } else{
        if (name === "length") {
          newVal = value + Math.floor(((event.clientX - initialX) * unit) / 20)

        } else {
          newVal = value + (event.clientX - initialX) * unit
        }
      }
      newVal = clamp(newVal, state.min, state.max)
      if(newVal !== value) {
        setValue(newVal)
      }
    }
  }


  useEffect(() => {
    const handler = setTimeout(() => {
      getParameter(value, name, whichOscillator, parentOscillator, from) 
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
      // Only add these listeners when dragging starts
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    // No need to remove listeners here since handleMouseUp will take care of it
    return () => {
      // Cleanup function to ensure no dangling listeners from this effect
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]); // This effect toggles based on isDragging state

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); 


  return (
    <div 
      className='frequency-wrapper'
      style={{width: abbreviate ? "30px" : "",  }}
      >
      <div 
        className='slider-header'
        style={{
          justifyContent: isParamCentered ? "center" : "left",
          fontSize: abbreviate ? "6.2pt" : ""
        }} 
        >
          {`< ${abbreviate ? name.slice(0,1) : name === "modulationFrequency" ? "modFrequency" : name} >`}
      </div>
      <div 
        className='frequency-slider'
        onMouseDown={handleMouseDown}
        style={{
          justifyContent: isParamCentered ? "center" : "left"
        }}
        >
      <div 
        className='value'
        style={{ fontSize: abbreviate ? "6.2pt" : ""
        }}
        > 
        {state.float ? value.toFixed(2) : parseInt(value/unit)} {state.unit}
      </div>
      </div>
    </div>
  )
}

export default HorizontalSlider 
