import React from 'react'
import StartButton from '../parameters/start-button/start-button'
import HorizontalSlider from '../parameters/horizontal-slider/horizontal-slider'
import Switcheroo from '../parameters/switcheroo/switcheroo'

const Oscillator = ({ value, 
                      parameterName,
                      state,
                      type,
                      id, 
                      getOscillatorState, 
                      getParameter, 
                      getWaveType}) => {

  return (
    <div className='oscillator'>
      <div 
        className='params'
        > 
        {parameterName === "start" ? (
          <StartButton 
            value={value}
            getOscillatorState={getOscillatorState}
          /> 
        ) 
        : state && state.type === "slider" ? (
          <HorizontalSlider 
            id={id}
            name={parameterName}
            type={type}
            parameterValue={value}
            state={state}
            getParameter={getParameter}
          /> 
        )  
        : parameterName === "type" ? (
          <Switcheroo 
            elements={state.value}          
            value={value}
            parentType={type}
            getWaveType={getWaveType}
          />
        ) : null }
      </div>
    </div>
  )
}

export default Oscillator
