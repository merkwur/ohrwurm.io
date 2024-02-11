import React, { useState } from 'react'
import "./source-options.scss"
import { LFOStates, initialStates } from '../../node-helpers/toneData'
import Oscillator from '../option-helpers/oscillator/oscillator'
import LFO from '../option-helpers/lfo/lfo'
import { colorScheme } from '../../node-helpers/helperFunctions'


const SourceOptions = ({
                        id, 
                        name, 
                        type, 
                        size,
                        parameters, 
                        getOscillatorState,
                        getParameter, getWaveType
                      }) => {
  const [openProperties, setOpenProperties] = useState(false)
  const oneSide = parameters.modulator ? Object.keys(parameters).length + Object.keys(parameters.modulator).length - 1 <= 8 : false


  return (
    <div className='source-options-wrapper'>
      <div 
        className='left-stander'
        onClick={() => setOpenProperties(!openProperties)}
        >
        <div className='header'>
          {name}
        </div>
      </div>
      <>
        { openProperties ? (
          <div className='parameters'
              style={{flexDirection: oneSide ? "column" : "row", borderRight: `1px solid ${colorScheme[type]}`}}
            >
              {name.includes("Oscillator") ? (
                <React.Fragment>
                  <div>
                    <Oscillator 
                      whichOscillator={"main"}
                      parameters={parameters}
                      type={type}
                      id={id}
                      getOscillatorState={getOscillatorState}
                      getParameter={getParameter}
                      getWaveType={getWaveType}
                    />
                  </div>
                  {parameters.hasOwnProperty("modulator") ? (
                    <div className='oscillator-addition'
                         style={{display: "flex", flexDirection: "row"

                         }}
                    >
                      <div className='separator'>
                        <div className='separator-text'>
                          modulator
                        </div>
                      </div>
                      <div>
      
                        <Oscillator
                          whichOscillator={"modulator"} 
                          parameters={parameters.modulator}
                          type={type}
                          id={id}
                          getOscillatorState={getOscillatorState}
                          getParameter={getParameter}
                          getWaveType={getWaveType}
                        />
                             
                      </div>
                    </div>              
                  ) : null}
                </React.Fragment>
              ) : name === "LFO" ? (
                <LFO 
                  parameters={parameters}
                  state={LFOStates}
                  type={type}
                  id={id}
                  getOscillatorState={getOscillatorState}
                  getParameter={getParameter}
                  getWaveType={getWaveType}
                />
              ) : null} 
          </div>
        ) : null }

       </>
    </div>
  )
}

export default SourceOptions
