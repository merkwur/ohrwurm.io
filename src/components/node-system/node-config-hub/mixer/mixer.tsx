import React, { useState } from 'react'
import { Mixer } from '../../../types/types'
import { getMixer } from '../../node-helpers/hubData'

const MixerUI = () => {
  const [mixer, setMixer] = useState<Mixer>(getMixer())

  return (
    <div className='mixer-container'> 
      <div className='channel-container'>
        {Object.keys(mixer).map((channel, index) => (
          <div 
            className='channel'
            key={"channel"+index}
            >
              {channel}
          </div>
        ))} 

      </div>        
    </div>
  )
}

export default MixerUI