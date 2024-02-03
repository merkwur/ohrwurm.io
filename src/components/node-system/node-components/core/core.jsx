import React, { } from 'react'
import "./core.scss"
import Input from '../component-helpers/input/input'
import Output from '../component-helpers/output/output'



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
        {node.name !== "Destination" ? (
          <Output 
            id={node.id}
            outputType={"node"} 
            whichParent={node.type}
            yPosition={node.size.y / 2 - 6}
          />
        ) : null}
    </div>
  )
}

export default Core
