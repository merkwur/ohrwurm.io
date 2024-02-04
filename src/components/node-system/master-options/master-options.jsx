import React, { useEffect, useState } from 'react'
import SourceOptions from '../option-components/source-options/source-options'
import './master-options.scss'

const MasterOptions = ({tone}) => {
  const [isOscillatorRunning, setIsOscillatorRunning] = useState(true)
  const [toneParameters, setToneParameters] = useState({})


  const handleStartOscillator = (id) => {
    if (!tone.parameters.start) {
      tone.parameters.start = true
      tone.tone.start()
    } else {
      tone.parameters.start = false
      tone.tone.stop()
    }
  }

  const handleParameterChange = (value, type) => {
    if (type) {
      if (type === "detune" || type === " width") {
        tone.parameters[type] = value
        tone.tone[type].set({value: value})
      } else {
        if (tone.tone[type].value) {
          tone.tone[type].value = value
          tone.parameters[type] = value
        } else {
          tone.tone[type] = value
          tone.parameters[type] = value
        }
      }

    }
  }


  return (
    <div 
      className='master-options-wrapper'
    > 
        <SourceOptions 
          id={tone.id}
          name={tone.name}
          type={tone.type}
          parameters={tone.parameters}
          getOscillatorState={(id) => handleStartOscillator(id)}
          getParameter={(value, type) => handleParameterChange(value, type)}
          setParameter={null}
        />
    </div>
  )
}

export default MasterOptions
