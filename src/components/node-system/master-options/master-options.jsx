import React, { useEffect, useState } from 'react'
import SourceOptions from '../option-components/source-options/source-options'
import './master-options.scss'
import Transport from '../option-components/option-helpers/transport/transport'




const MasterOptions = ({tone, notesToTrigger, getGlobalTime}) => {

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
        if (typeof tone.tone[type] === "object") {
          tone.tone[type].value = value
          tone.parameters[type] = value
        } else {
          tone.tone[type] = value
          tone.parameters[type] = value
        }
      }
    }
  }


  const handleWaveTypes = (type, parent) => {
    
    if (type) {
      if (parent === "Source") {
        tone.parameters.type = type
        tone.tone.type = type
      } else {
        tone.parameters.type = type
        tone.tone.oscillator.type = type
      }
    }
  } 

  return (
    <div 
      className='master-options-wrapper'
    > 
      {tone.name !== "Destination" && tone.name !== "Transport" && tone.type !== "Signal"? (
        <SourceOptions 
          id={tone.id}
          name={tone.name}
          type={tone.type}
          parameters={tone.parameters}
          getOscillatorState={(id) => handleStartOscillator(id)}
          getParameter={(value, type) => handleParameterChange(value, type)}
          getWaveType={(type, parent) => handleWaveTypes(type, parent)}
          setParameter={null}
        />
      ): tone.name === "Transport" ? (
        <Transport 
          id={tone.id} 
          name={tone.name} 
          type={tone.type}
          notesToTrigger={notesToTrigger}
          getGlobalTime={getGlobalTime}
          
          />
      ) : null}
    </div>
  )
}

export default MasterOptions
