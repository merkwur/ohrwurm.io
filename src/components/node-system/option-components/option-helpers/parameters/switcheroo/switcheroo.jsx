import React, { useRef, useState } from 'react'
import "./switcheroo.scss"
import { colorScheme } from '../../../../node-helpers/helperFunctions'

const Switcheroo = ({elements, value, parentType, getWaveType, whichOscillator}) => {
  const [elems, setElems] = useState(elements)
  const [active, setActive] =  useState(false)
  const [waveType, setWaveType] = useState(value)
  const switchesRefs = useRef([]);
  
  

  const handleMouseEnter = (index) => {
    switchesRefs.current[index].classList.toggle('active');
  };

  const handleMouseLeave = (index) => {
    switchesRefs.current[index].classList.remove('active');
  };

  const handleWaveSelection = (wave, type ) => {
    console.log(wave, type)
    setWaveType(wave)
    getWaveType(wave, type, whichOscillator)
  }

  return (
    <div 
      className='switcheroo-container'
      style={{
        marginTop: whichOscillator !== "main" ? "1.25rem" : ""
      }}
    
    > 
      {elems.map((item, index) => (
        <div
          key={item} 
          id={item}
          className={`switches ${active ? "active" : ""}`}
          ref={(el) => (switchesRefs.current[index] = el)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onClick={() => handleWaveSelection(item, parentType)}
          style={{
            width: `${100 / elems.length}%`,
            color: `${colorScheme["natural"]}`
          }}
        >
          {item.slice(0, 3)}
        </div>
      ))}   
    </div>
  )
}

export default Switcheroo
