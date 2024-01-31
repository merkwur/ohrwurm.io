import React from 'react'
import "./output.scss"
import { colorScheme } from '../../../node-helpers/helperFunctions'

const Output = ({id, outputType, whichParent}) => {
  return (
    <div
      id={id} 
      className='output'
      sockettype={outputType}
      whichparent={whichParent}
      style={{backgroundColor: `${colorScheme[whichParent]}`,
              background: `radial-gradient(circle at 50%, #272727, #272727 40%, ${colorScheme[whichParent]} 55%, #272727 100%)`
    }}
      >
      
    </div>
  )
}

export default Output
