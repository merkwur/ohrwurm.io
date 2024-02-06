import React, { useEffect, useState } from 'react'
import "./length-adjust.scss"
import { clamp } from 'three/src/math/MathUtils'
import { colorScheme } from '../../../../node-helpers/helperFunctions'

const LengthAdjust = ({ leftPosition, 
                        index,
                        getSequenceLengthValue, 
                        getSequencePosValue, 
                        length, seqLength
                      }) => {

  const [isDragging, setIsDragging] = useState(false)
  const [value, setValue] = useState(seqLength)
  const [initialX, setInitialX] = useState(0)
  const [deltaVal, setDeltaVal] = useState(0)
  const [partPosition, setPartPosition] = useState(leftPosition)

  const handleMouseDown = (event) => {
    
    setIsDragging(true)
    setInitialX(event.clientX)
  }

  const handleWheel = (event) => {
    setDeltaVal((prevDelta) => prevDelta + event.deltaY);
  };
  
  useEffect(() => {
    const val = Math.floor(deltaVal / 120);    
    setValue((prevValue) => clamp(prevValue - val, 1, (8 - partPosition)));
    setDeltaVal(0);
  }, [deltaVal]);

  const handleMouseMove = (event) => {
    const val = partPosition + -Math.floor((initialX - event.clientX)/50)
    const assing = clamp(val, 0, 8 - value)
    setPartPosition(assing) 
  }


  useEffect(() => {getSequenceLengthValue(value)}, [value])
  useEffect(() => {getSequencePosValue(partPosition)}, [partPosition])

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
      className='lengths'
      onMouseDown={handleMouseDown}
      onWheel={handleWheel}
      style={{
        top: `${index*(80/length)}%`,
        left: `${partPosition * 12.5}%`,
        width: `${value * 12.5}%`,
        height: `${80 / length}%`,
        
      }}
      >
    </div>
  )
}

export default LengthAdjust
