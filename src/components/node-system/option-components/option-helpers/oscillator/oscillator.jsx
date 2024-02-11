import React from 'react'
import StartButton from '../parameters/start-button/start-button'
import HorizontalSlider from '../parameters/horizontal-slider/horizontal-slider'
import Switcheroo from '../parameters/switcheroo/switcheroo'
import { initialStates } from '../../../node-helpers/toneData'
import "./oscillator.scss"


const Oscillator = ({  
                      parameters,
                      type,
                      whichOscillator,
                      id, 
                      getOscillatorState, 
                      getParameter, 
                      getWaveType}) => {

  return (
    <div className='oscillator'>
      <div 
        className='params'
        > 
        {Object.keys(parameters).map((parameter, index) => (
          <React.Fragment key={parameter+index}>

            {parameter === "start" && whichOscillator === "main" ? (
              <StartButton 
                value={parameters[parameter]}
                getOscillatorState={getOscillatorState}
                whichOscillator={whichOscillator}
              /> 
            ) 
            : initialStates[parameter] && initialStates[parameter].type === "slider" ? (
              <HorizontalSlider 
                id={id}
                name={parameter}
                type={type}
                parameterValue={parameters[parameter]}
                state={initialStates[parameter]}
                getParameter={getParameter}
                whichOscillator={whichOscillator}
              /> 
            )  
            : parameter === "type" ? (
              <Switcheroo 
                elements={initialStates[parameter].value}          
                value={parameters[parameter]}
                parentType={type}
                getWaveType={getWaveType}
                whichOscillator={whichOscillator}
              />
            ) : null }
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default Oscillator
