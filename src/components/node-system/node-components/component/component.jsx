import React from 'react'
import "./component.scss"
import Input from '../component-helpers/input/input'
import Output from '../component-helpers/output/output'
import { colorScheme } from '../../node-helpers/helperFunctions'
import { abbreviates } from '../../node-helpers/nodeData'

const Component = ({node}) => {
  const inputs = node.input ? Object.keys(node.input) : null 



  return (
    <div 
      className='source-container'
      id={node.id}
      style={{
        height: `${node.size.y}px`,
        width :`${node.size.x}px`,
      }}
    >
      <div className='background-wrapper'>
        <div 
          className='background-image'
          style={{
            backgroundImage: `url(${node.name}.png)`,
            backgroundSize: "contain",
            
          }}
          > </div>
      </div>
      <div 
        className='background-hint'
        style={{
          position: "absolute",
          left: 0,
          top: 0, 
          color: `${colorScheme[node.type]}`,
          fontSize: `${7}pt`,    
        }}
        >
          {abbreviates[node.name] ? abbreviates[node.name] : node.name}
      </div> 
      <>
        {inputs ? (
          <>
            {inputs.map((input, index) => (
              <React.Fragment key={node.id + index}>
                <Input 
                  id={node.id}
                  inputType={input} 
                  whichParent={input === "node" || input === "trigger" ? node.type : "natural"}
                  yPosition={node.size.y / (inputs.length + 1)  * (index + 1) - 6}
                />
              </React.Fragment>
            ))}
         </>
        ) : null }
      </>
        {node.name !== "Analyzer" ? (
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

export default Component
