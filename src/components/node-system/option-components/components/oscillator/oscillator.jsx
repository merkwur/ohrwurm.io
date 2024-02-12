import React from 'react'
import "./oscillator.scss"
import { initialStates } from '../../../node-helpers/toneData'
import Switch from '../../parameters/switch/switch'
import StartButton from '../../parameters/start-button/start-button'
import HorizontalSlider from '../../parameters/horizontal-slider/horizontal-slider'


const Oscillator = ({parameters, getOscillatorState, getParameter}) => {
  return (
    <div className='hub-oscillator-wrapper'>
      <div className='osc-left-panel'>
        {parameters.hasOwnProperty("start") ? (
          <StartButton 
            value={parameters.start}
            getOscillatorState={getOscillatorState}
          />
          ): null } 
          {parameters.hasOwnProperty("type") ? (
            <Switch 
              elements={initialStates.type.value}
              value={parameters.type}
              parentType={"Source"}
              whichOscillator={"carrier"}
              orientation={"vertical"}
            /> 
        ): null} 
      </div>
      <div className='osc-right-panel'> 
        {Object.keys(parameters).map((param, index) => (
          <div 
            className='hub-oscillator-sliders'
            key={param+index+"carrier"}
          >
            {initialStates[param] && initialStates[param].type === "slider" ? (
              <HorizontalSlider 
                name={param}
                type={"Source"}
                state={initialStates[param]}
                parameterValue={parameters[param]}
                whichOscillator={"carrier"}
                getParameter={getParameter}
              />
              )  : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Oscillator
