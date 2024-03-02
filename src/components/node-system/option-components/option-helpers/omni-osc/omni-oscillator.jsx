import React, { useState } from 'react'
import "./omni-oscillator.scss"
import Oscillator from '../oscillator/oscillator'
import Switcheroo from '../../parameters/switch/switch'
import { initialStates } from '../../../node-helpers/toneData'
import HorizontalSlider from '../../horizontal-slider/horizontal-slider'

const OmniOscillator = ({id, 
                        name,
                        type,
                        parameters, 
                        oscillatorType, 
                        getOscillatorType, 
                        getWaveType, getParameter}) => {

  

  return (
    <div className='omni-oscillator'>
      <div className='oscillator-selector'>
        <Switcheroo 
          elements={["osc", "fat", "fm", "am", "pwm", "pulse"]}
          value={oscillatorType}
          parentType={"Instrument"}          
          getWaveType={getOscillatorType}
          orientation={"horizontal"}
          whichOscillator={"main"}
          oscTyp={oscillatorType}
        /> 

      </div>
      <div className='omni-oscillator-options'>
        <div className='omni-oscillator-waves'>
          <Switcheroo 
            elements={initialStates.type.value}          
            value={parameters.oscillator[oscillatorType].type}
            parentType={"Instument"}
            getWaveType={getWaveType}
            orientation={"vertical"}
            whichOscillator={"main"}
            oscTyp={oscillatorType}
            />
        </div>
        <div className='omni-oscillator-sliders'>
          {Object.keys(parameters.oscillator[oscillatorType]).map((param, index) => (
            <React.Fragment key={param+index+"synthe"}>
              {param !== "start" ? (
                <div>
                  {initialStates[param] && initialStates[param].type === "slider" ? (
                    <HorizontalSlider 
                      id={id}
                      name={param}
                      type={type}
                      parameterValue={parameters.oscillator[oscillatorType][param]}
                      state={initialStates[param]}
                      getParameter={getParameter}
                      whichOscillator={"main"}
                      oscTyp={oscillatorType}
                    />
                  ) : null }
                </div>
              ) : null}
            </React.Fragment>
            
          ))}
        </div>
      </div>
    </div>
  )
}

export default OmniOscillator
