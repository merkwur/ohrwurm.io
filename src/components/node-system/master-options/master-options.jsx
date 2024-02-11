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

  const handleParameterChange = (value, type, which) => {
    if (type) {
      if (type === "detune" || type === " width") {
        if (which === "main") {
          tone.parameters[type] = value
          tone.tone[type].set({value: value})
        } else {
          tone.parameters.modulator[type] = value
          tone.tone._modulator[type].set({value: value})
        }
      } else {
        if (typeof tone.tone[type] === "object") {
          if (which === "main") {
            tone.tone[type].value = value
            tone.parameters[type] = value
          } else {
            console.log(tone.tone._modulator)
            tone.tone._modulator[type].value = value
            tone.parameters.modulator[type] = value
          }
        } else {
          if (which === "main") {
            tone.tone[type] = value
            tone.parameters[type] = value 
          } else {
            tone.tone._modulator[type] = value
            tone.parameters.modulator[type] = value
          }

        }
      }
    }
  }


  const handleWaveTypes = (type, parent, which) => {
    
    if (type) {
      if (parent === "Source") {
        if (which === "main"){
          tone.parameters.type = type
          tone.tone.type = type
        } else {
          tone.tone.modulationType = type
        }
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
      {tone.type === "Source" ? (
        <SourceOptions 
          id={tone.id}
          name={tone.name}
          type={tone.type}
          size={tone.size}
          parameters={tone.parameters}
          getOscillatorState={(id) => handleStartOscillator(id)}
          getParameter={(value, type, which) => handleParameterChange(value, type, which)}
          getWaveType={(type, parent, which) => handleWaveTypes(type, parent, which)}
        />
      ): tone.type === "Instrument" ? (
        <></>
      ) : tone.name === "Transport" ? (
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
