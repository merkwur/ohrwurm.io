import React, { useState } from 'react'
import "./core.scss"
import Input from '../component-helpers/input/input'
import Output from '../component-helpers/output/output'
import { initialStates } from '../../node-helpers/toneData'
import HorizontalSlider from '../../option-components/parameters/horizontal-slider/horizontal-slider'



const Core = ({node, tone}) => {
  
  const [_parameters, setParameters] = useState(tone && tone.parameters ? tone.parameters : null)
  const inputs = node.input ? Object.keys(node.input) : null


  const handleParameterChanges = (value, type) => {
    tone.tone[type].value = value
  }

  return (
    <div 
      className='core-container'
      id={node.id}      
      > 
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
      <div className='core-parameters'>
        {_parameters ? (
          Object.keys(_parameters).map((parameter, index) => (
            <React.Fragment key={parameter+"core"+index}>
              {initialStates[parameter] && initialStates[parameter].type === "slider" ? (
                <HorizontalSlider 
                  name={parameter}
                  state={initialStates[parameter]}
                  parameterValue={_parameters[parameter]}
                  abbreviate={true}
                  getParameter={(value, type) => handleParameterChanges(value, type)}
                  isParamCentered={true}
                />
              ) : null}  
            </React.Fragment>
          ))
        ) : null}
      </div>

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
