import React, { useState } from 'react'
import "./input.scss"
import { colorScheme } from '../../../node-helpers/helperFunctions'


const Input = ({id, inputType, whichParent, yPosition}) => {
  const type = inputType === "node" ? whichParent : "natural"
  const [focusOn, setFocusOn] = useState(false)

  return (
    <div
      id={id} 
      className='input'
      socket="io"
      sockettype={inputType}
      whichparent={whichParent}
      onMouseEnter={() => setFocusOn(true)}
      onMouseLeave={() => setFocusOn(false)}
      style={{
        backgroundColor: `${colorScheme[whichParent]}`,
        top: `${yPosition}px`,
        background: `radial-gradient(circle at 50%, #272727, #272727 40%, ${colorScheme[type]} 55%, #272727 100%)`,
        right: "3%",
        boxShadow: focusOn 
                    ? ` 0 0 3px 2px #ff4242` 
                    : ""
      }}
      >
        {inputType} {focusOn}
      
    </div>
  )
}

export default Input
