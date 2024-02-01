import React from 'react'
import "./core.scss"
import Input from '../component-helpers/input/input'
import Output from '../component-helpers/output/output'



const Gain = ({node}) => {
  const inputs = Object.keys(node.input)


  return (
    <div 
      className='gain-container'
      id={node.id}      
      > {node.id}
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
        
        <Output 
          id={node.id}
          outputType={"node"} 
          whichParent={node.type}
          yPosition={node.size.y / 2 - 6}
        />
    </div>
  )
}

export default Gain
