import React, { useState } from 'react'
import "./signal.scss"
import Input from '../component-helpers/input/input'
import Output from '../component-helpers/output/output'
import { initialStates } from '../../node-helpers/toneData'
import HorizontalSlider from '../../option-components/parameters/horizontal-slider/horizontal-slider'
import { abbreviates } from '../../node-helpers/nodeData'
import { colorScheme } from '../../node-helpers/helperFunctions'


const Signal = ({node, tone}) => {
  const inputs = node.input ? Object.keys(node.input) : null 
  const [_parameters, setParameters] = useState(tone.parameters)

  console.log(_parameters)
  const handleParameterChange = (value, type) => {
    if (typeof tone.tone[type] === "object") {
      tone.tone[type].value = value
    } else {
      tone.tone[type] = value
    }
  }

  return (
    <div 
      className='source-container'
      id={node.id}
      style={{
        height: `${node.size.y}px`,
        width :`${node.size.x}px`,
      }}
    >
      {Object.keys(_parameters).length === 0 ? (
        <div className='background-wrapper'
          style={{position: 'absolute'}}
        >
          <div 
            className='background-image'
            style={{
              backgroundImage: `url(${node.name}.png)`,
              backgroundSize: "contain",
              
            }}
            > </div>
        </div>
      ) : null}
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
                  whichParent={input === "node" ? node.type : "natural"}
                  yPosition={node.size.y / (inputs.length + 1)  * (index + 1) - 6}
                />
              </React.Fragment>
            ))}
         </>
        ) : null }
        {_parameters ? (
          <div className='signal-parameters'>
            {Object.keys(_parameters).map((parameter, index) => (
              <React.Fragment key={parameter+"signal"+index}>
                {initialStates[parameter] && initialStates[parameter].type === "slider" ? (
                  <div 
                    className='signal-sliders'
                  >
                    <HorizontalSlider 
                      name={parameter}
                      parameterValue={_parameters[parameter]}
                      state={initialStates[parameter]}
                      abbreviate={true}
                      isParamCentered={true}
                      getParameter={(value, param) => handleParameterChange(value, param)}
                    />
                  </div>
                ) : null}
              </React.Fragment>
            ))}
          </div>
 
        ) : null }
      </>
        <Output 
          id={node.id}
          outputType={"node"} 
          whichParent={node.type}
          yPosition={node.size.y / 2 - 6}
        />
    </div>
  )
}

export default Signal
