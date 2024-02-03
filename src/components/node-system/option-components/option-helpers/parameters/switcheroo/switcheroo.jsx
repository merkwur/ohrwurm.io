import React, { useRef, useState } from 'react'
import "./switcheroo.scss"
import { colorScheme } from '../../../../node-helpers/helperFunctions'

const Switcheroo = ({elements, parentType, getWaveType}) => {
  const [elems, setElems] = useState(elements)
  const [active, setActive] =  useState(false)
  const switchesRefs = useRef([]);


  const handleMouseEnter = (index) => {
    switchesRefs.current[index].classList.toggle('active');
  };

  const handleMouseLeave = (index) => {
    switchesRefs.current[index].classList.remove('active');
  };

  const handleWaveSelection = (waveType, index) => {
    getWaveType(waveType)
  }

  return (
    <div className='switcheroo-container'> 
      {elems.map((item, index) => (
        <div
          key={item} 
          id={item}
          className={`switches ${active ? "active" : ""}`}
          ref={(el) => (switchesRefs.current[index] = el)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={() => handleMouseLeave(index)}
          onClick={() => handleWaveSelection(item, index)}
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
