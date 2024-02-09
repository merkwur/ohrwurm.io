import React from 'react'
import "./lfo.scss"
import StartButton from '../parameters/start-button/start-button'
import HorizontalSlider from '../parameters/horizontal-slider/horizontal-slider'
import Switcheroo from '../parameters/switcheroo/switcheroo'

const LFO = ({
              parameters, 
              state,
              type, 
              id, 
              getParameter, 
              getOscillatorState, 
              getWaveType
            }) => {


  return (
    <div 
      className='lfo'
      >
      <div 
        className='params'
        >
        {Object.keys(parameters).map((param, index) => (
          <React.Fragment key={param+index+"LFO"}>

            {param === "start" ? (
              <StartButton 
                value={parameters[param]}
                getOscillatorState={getOscillatorState}
                whichOscillator={"main"}
              /> 
            ) 
            : state[param] && state[param].type === "slider" ? (
              <HorizontalSlider 
                id={id}
                name={param}
                type={type}
                parameterValue={parameters[param]}
                state={state[param]}
                getParameter={getParameter}
                whichOscillator={"main"}
              /> 
            )  
            : param === "type" ? (
              <Switcheroo 
                elements={state.value}          
                value={parameters[param]}
                parentType={type}
                getWaveType={getWaveType}
                whichOscillator={"main"}
              />
            ) : null }
          </React.Fragment>
        ))} 
      </div>
    </ div>
  )
}

export default LFO
