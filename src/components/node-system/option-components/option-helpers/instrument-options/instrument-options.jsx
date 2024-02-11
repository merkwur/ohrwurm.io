import React, { useState } from 'react'
import OmniOscillator from '../omni-osc/omni-oscillator'
import "./instrument-options.scss"
import { colorScheme } from '../../../node-helpers/helperFunctions'

const InstrumentOptions = ({ id, 
                            type, 
                            size, 
                            name,
                            parameters,
                            oscillatorType,
                            getParameter, 
                            getWaveType, 
                            getOscillatorType
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
              <React.Fragment>
                <div> 
                  <OmniOscillator 
                    type={type}
                    parameters={parameters} 
                    oscillatorType={oscillatorType}
                    getOscillatorType={getOscillatorType}
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
  
                    </div>
                  </div>              
                ) : null}
              </React.Fragment>
          </div>
        ) : null }

        </>
    </div>
  )
}

export default InstrumentOptions
