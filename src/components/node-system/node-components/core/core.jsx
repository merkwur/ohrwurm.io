import React, { useEffect, useRef, useState } from 'react'
import "./core.scss"
import Input from '../component-helpers/input/input'
import Output from '../component-helpers/output/output'
import { colorScheme } from '../../node-helpers/helperFunctions'
import { clamp } from '../../node-helpers/helperFunctions'
import Slider from '../component-helpers/slider/slider'


const Core = ({node}) => {
  const inputs = node.input ? Object.keys(node.input) : null


  return (
    <div 
      className='core-container'
      id={node.id}      
      > {node.name}
      <>
        {inputs ? (
          <>
            {inputs.map((input, index) => (
    
              <React.Fragment key={node.id + input}>
                <Input 
                  id={node.id}
                  inputType={input} 
                  whichParent={input === "node" ? node.type : "natural"}
                  yPosition={node.size.y / (inputs.length + 1)  * (index + 1) - 6}
                  />
              </React.Fragment>
            ))}
          </>
        ) : null }
      </>
      {node.name === "Gain" ? (
        <>
        </>
      ): null}
        
        <Output 
          id={node.id}
          outputType={"node"} 
          whichParent={node.type}
          yPosition={node.size.y / 2 - 6}
        />
    </div>
  )
}

export default Core
