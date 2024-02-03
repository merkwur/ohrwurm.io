import React, { useState } from 'react'
import "./input.scss"
import { colorScheme } from '../../../node-helpers/helperFunctions'


const Input = ({id, inputType, whichParent, yPosition}) => {
  const type = inputType === "node" || inputType === "trigger" ? whichParent : "natural"
  const [focusOn, setFocusOn] = useState(false)

  const handleMouseEnter = () => {
    setFocusOn(true)
    console.log(inputType)
  }

  const handleMouseLeave = () => {
    setFocusOn(false)
  }

  return (
    <div
      id={id} 
      className='input'
      socket="io"
      sockettype={inputType}
      whichparent={whichParent}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        {focusOn ? (
          <div className='input-tooltips'>
            {inputType}
          </div>
        ) : null}
    </div>
  )
}

export default Input
