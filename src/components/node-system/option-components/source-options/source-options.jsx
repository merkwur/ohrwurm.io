import React, { useState } from 'react'
import "./source-options.scss"
import { LFOStates, initialStates } from '../../node-helpers/toneData'
import { colorScheme } from '../../node-helpers/helperFunctions'
import Oscillator from '../components/oscillator/oscillator'



const SourceOptions = ({name,
                        type,  
                        parameters
                      }) => {
  const [openProperties, setOpenProperties] = useState(false)


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
            style={{borderRight: `1px solid ${colorScheme[type]}`}}
          > 
            {parameters.hasOwnProperty("modulator") ? (
              <div className='modulator-oscillator'>
                <Oscillator 
                  parameters={parameters.modulator}
                />
              </div>  
            ) : (
              <div className='carrier-params'>
                <Oscillator 
                  parameters={parameters}
                />
              </div>
            )}
            
            
          </div>
        ) : null }

       </>
    </div>
  )
}

export default SourceOptions
