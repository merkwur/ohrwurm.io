import React from 'react'
import { initialStates } from '../../../node-helpers/toneData'
import Switch from '../../parameters/switch/switch'
import HorizontalSlider from '../../parameters/horizontal-slider/horizontal-slider'
import "./omni-oscillator.scss"

const OmniOscillator = ({ parameters,  
                          getParameter, 
                          getWaveType, 
                          which,
                          oscillatorType 
                        }) => {

  console.log(oscillatorType)

  return (
    <div 
      className='omni-oscillator-wrapper'
      > 
      <div className='osc-left-panel'>
        <Switch 
          elements={initialStates.type.value}
          value={parameters.type}
          parentType={"Instrument"}
          whichOscillator={which}
          getWaveType={getWaveType}
          orientation={"vertical"}
        /> 
        
      </div>
      <div className='osc-right-panel'> 
        {Object.keys(parameters).map((param, index) => (
          <div 
            className='hub-oscillator-sliders'
            key={param+index+which}
          >
            {initialStates[param] && initialStates[param].type === "slider" ? (
              <HorizontalSlider 
                name={param}
                type={"Source"}
                state={initialStates[param]}
                parameterValue={parameters[param]}
                whichOscillator={which}
                getParameter={getParameter}
              />
              )  : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default OmniOscillator
