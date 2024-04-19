import React, { useState } from 'react'
import { Mixer } from '../../../types/types'
import { getMixer } from '../../node-helpers/hubData'
import "./mixer.scss"
const MixerUI = () => {
  const [mixer, setMixer] = useState<Mixer>(getMixer())

  return (
    <div className='mixer-container'> 
      <div className='hub-header'>
        <div className='hub-header-text'> 
          Mix8
        </div>
      </div>
      <div className='channel-container'>
        {Object.keys(mixer).map((channel, index) => (
          <div 
            className='channel'
            key={"channel"+index}
            >
              <div className='channel-header'>
                c{index+1}
              </div>
              <div className='channel-panner'>
                <div className='channel-panner-header'>
                    pan
                </div>
                <div className='channel-panner-knob'>

                </div>
              </div>
              <div className='channel-volume'>
                <div className='channel-volume-header'>
                    vol
                </div>
                <div className='channel-volume-slider'>

                </div>
                
              </div>
          </div>
        ))} 

      </div>        
    </div>
  )
}

export default MixerUI