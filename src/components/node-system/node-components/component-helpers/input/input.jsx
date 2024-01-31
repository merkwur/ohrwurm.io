import React from 'react'
import "./input.scss"
import { colorScheme } from '../../../node-helpers/helperFunctions'


const Input = ({id, inputType, whichParent, yPosition}) => {

  const type = inputType === "node" ? whichParent : "natural"

  return (
    <div
      id={id} 
      className='input'
      socket="io"
      sockettype={inputType}
      whichparent={whichParent}
      style={{
        backgroundColor: `${colorScheme[whichParent]}`,
        top: `${yPosition}px`,
        background: `radial-gradient(circle at 50%, #272727, #272727 40%, ${colorScheme[type]} 55%, #272727 100%)`
      }}
      
      >
      
    </div>
  )
}

export default Input
