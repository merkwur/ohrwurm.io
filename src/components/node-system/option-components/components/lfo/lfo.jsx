import React, { useEffect } from 'react'
import StartButton from '../../parameters/start-button/start-button'
import Switch from '../../parameters/switch/switch'
import { LFOStates } from '../../../node-helpers/toneData'
import HorizontalSlider from '../../parameters/horizontal-slider/horizontal-slider'
import "./lfo.scss"


const LFO = ({
              parameters, 
              getOscillatorState, 
              getParameter, 
              getWaveType
            }) => {

  return (
    <div className='hub-lfo-wrapper'>
      <div className='lfo-left-panel'>
          {parameters.hasOwnProperty("start") ? (
            <StartButton 
              value={parameters.start}
              getOscillatorState={getOscillatorState}
            />
          ) : null}
          {parameters.hasOwnProperty("type") ? (
            <Switch 
              elements={LFOStates.type.value}
              value={parameters.type}
              parentType={"Source"}
              whichOscillator={"carrier"}
              getWaveType={getWaveType}
              orientation={"vertical"}
            />
          ) : null}
        </div>
        <div className='lfo-right-panel'>
          {Object.keys(parameters).map((param, index) => (
            <div 
              className='lfo-sliders'
              key={param+index+"lfo"}
            > 
              {LFOStates[param] && LFOStates[param].type === "slider" ? (
                <HorizontalSlider
                  name={param}
                  type={"Source"}
                  state={LFOStates[param]}
                  whichOscillator={"carrier"}
                  parameterValue={parameters[param]}
                  getParameter={getParameter}
                />
              ) : null}
            </div>
          ))}
        </div>
      
    </div>
  )
}

export default LFO
