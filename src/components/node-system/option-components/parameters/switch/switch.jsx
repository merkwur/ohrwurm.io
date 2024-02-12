import React, { useEffect, useRef, useState } from 'react'
import "./switch.scss"
import { colorScheme } from '../../../node-helpers/helperFunctions'

const Switch = ({
                elements, 
                value, 
                parentType, 
                getWaveType, 
                whichOscillator, 
                orientation
              }) => {

  const [elems, setElems] = useState(elements)
  const [active, setActive] =  useState(false)
  const [waveType, setWaveType] = useState(value)
  const switchesRefs = useRef([]);
  const [currentIdx, setCurrentIdx] = useState(null)
  
  useEffect(() => {console.log(value)} , [value])

  const handleMouseEnter = (index) => {
    switchesRefs.current[index].classList.toggle('active');
  };

  const handleMouseLeave = (index) => {
    switchesRefs.current[index].classList.remove('active');
  };

  const handleWaveSelection = (wave, type, index) => {
    setCurrentIdx(index)
    setWaveType(wave)
    getWaveType(wave, type, whichOscillator)
  }

  return (
    <div 
      className='switcheroo-container'
      style={{
        marginTop: whichOscillator !== "main" ? ".75rem" : "",
        flexDirection: orientation === "vertical" ? "column" : "row",
        justifyContent: "space-around",
        width: orientation === "horizontal" ? "100%" : "fit-content"
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
          onClick={() => handleWaveSelection(item, parentType, index, oscTyp)}
          style={{
            width: orientation === "horizontal" ? `${100 / elems.length}` : ``,
            height: orientation === "horizontal" ? `${20}px` : `${20}px`,
            color: index === currentIdx ?`${colorScheme[parentType]}` : `${colorScheme["natural"]}`
          }}
        >
          {item.slice(0, 3)}
        </div>
      ))}   
    </div>
  )
}

export default Switch
