import React, { useEffect } from 'react'
import "./component-analyser.scss"
import Input from '../component-helpers/input/input'
import Output from '../component-helpers/output/output'
import { colorScheme } from '../../node-helpers/helperFunctions'

const ComponentAnalyser = ({node}) => {
  const inputs = node.input ? Object.keys(node.input) : null 


  useEffect(() => {console.log(node)}, [])

  return (
    <div 
      className='source-container'
      id={node.id}
      style={{
        height: `${node.size.y}px`,
        width :`${node.size.x}px`,
      }}
    >
      <>
        {inputs ? (
          <>
            {inputs.map((input, index) => (
              <React.Fragment key={node.id + index}>
                <Input 
                  id={node.id}
                  inputType={input} 
                  whichParent={ "Component" }
                  yPosition={node.size.y - index * 20 - 20}
                />
              </React.Fragment>
            ))}
         </>
        ) : null }
      </>
        {node.name !== "Analyser" ? (
          <Output 
            id={node.id}
            outputType={"node"} 
            whichParent={node.type}
            yPosition={node.size.y / 2 - 6}
          />
        ) : null}

        <div className='scope'
          style={{display: "flex", justifyContent: "center", alignItems: "center", position: 'relative'}} 
        >
          <svg 
            className='scope-view'
            style={{border: `1px solid ${colorScheme[node.type]}` , position: 'absolute', top: 15}}
            
            width="110" 
            height="90" 
            viewBox='0 0 110 90'
            >
            <rect className='scope-view-box' width="110" height="90" x="00" y="00" rx="0" ry="0" fill="#070707" />
          </svg>
        </div>
    </div>
  )
}

export default ComponentAnalyser