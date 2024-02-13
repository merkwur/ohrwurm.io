import React from 'react'
import { initialStates } from '../../../node-helpers/toneData'
import Switch from '../../parameters/switch/switch'
import HorizontalSlider from '../../parameters/horizontal-slider/horizontal-slider'
import "./omni-oscillator.scss"

const OmniOscillator = ({ parameters,  
                          getParameter, 
                          getWaveType, 
                          which, wave
                        }) => {

  

  return (
    <div 
      className='omni-oscillator-wrapper'
        style={{marginTop: which === "modulator" ? "40px" : ""

        }}
      > 
      <div>
        
      </div>
    </div>
  )
}

export default OmniOscillator
