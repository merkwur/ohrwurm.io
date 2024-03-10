import React, { useState } from 'react'
import "./output.scss"
import { colorScheme } from '../../../node-helpers/helperFunctions'

const Output = ({id, outputType, whichParent, yPosition}) => {
  const [focusOn, setFocusOn] = useState(false)

  
  return (
    <div
      id={id} 
      className='output'
      sockettype={outputType}
      whichparent={whichParent}
      onMouseEnter={() => setFocusOn(true)}
      onMouseLeave={() => setFocusOn(false)}
      style={{backgroundColor: `${colorScheme[whichParent]}`,
              background: `radial-gradient(circle at 50%, #272727, #272727 40%, ${colorScheme[whichParent]} 55%, #272727 100%)`,
              top: !yPosition ? "calc(50% - 6px)" : `${yPosition}px`, 
              right: "3%",
              boxShadow: focusOn 
                          ? ` 0 0 3px 2px #ff4242` 
                          : ""
    }}
      >
        {focusOn ? (
          <div className='output-tooltips'>
            {outputType}
          </div>
        ) : null}
    </div>
  )
}

export default Output
