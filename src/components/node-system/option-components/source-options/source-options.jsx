import React, { useEffect, useState } from 'react'
import "./source-options.scss"
import { LFOStates, initialStates } from '../../node-helpers/toneData'
import { colorScheme } from '../../node-helpers/helperFunctions'
import Oscillator from '../components/oscillator/oscillator'



const SourceOptions = ({toneObj}) => {

  const [openProperties, setOpenProperties] = useState(false)
  const [_parameters, setParameters] = useState(toneObj.parameters)    
  const [_modulatorParameters, setModulatorParameters] = useState(_parameters.hasOwnProperty("modulator") ? _parameters.modulator : null)
  
  const handleParameterChange = (value, type, which) => {
    if (type) {
      if (type === "detune") {
        toneObj.tone.detune.set({value: value})
      } else if (typeof toneObj.tone[type] === "object") {
        toneObj.tone[type].value = value
      } else {
        toneObj.tone[type] = value 
      }

      if (which === "carrier" || which === "oscillator") {
        setParameters(previousParameters => ({
          ...previousParameters, 
          [type]: value
        }))
      } else {
        setModulatorParameters(previousParameters => ({
          ...previousParameters, 
          [type]: value
        }))
      }
    }
  }

  const handleStartOscillator = (id) => {
    if (!_parameters.start) {
      toneObj.tone.start()
    } else {
      toneObj.tone.stop()
    }

    setParameters(previousParameters => ({
      ...previousParameters, 
      start: !_parameters.start
    }))
  }

  const handleWaveTypes = (type, parent, which) => {
    toneObj.tone.type = type
    setParameters(previousParameters => ({
      ...previousParameters, 
      type: type
    }))
  }

  return (
    <div className='source-options-wrapper'>
      <div 
        className='left-stander'
        onClick={() => setOpenProperties(!openProperties)}
        >
        <div className='header'>
          {toneObj.name}
        </div>
      </div>
      <>
        { openProperties ? (
          <div className='parameters'
            style={{borderRight: `1px solid ${colorScheme[toneObj.type]}`}}
          > 
            {toneObj.parameters.hasOwnProperty("modulator") ? (
              <div className='modulator-oscillator'>
                <Oscillator 
                  parameters={_modulatorParameters}
                  getOscillatorState={(id) => handleStartOscillator(id)}
                  getParameter={(value, type, which) => handleParameterChange(value, type, which)}
                  getWaveType={(type, parent, which) => handleWaveTypes(type, parent, which)}
                />
              </div>  
            ) : (
              <div className='carrier-params'>
                <Oscillator 
                  parameters={_parameters}
                  getOscillatorState={(id) => handleStartOscillator(id)}
                  getParameter={(value, type, which) => handleParameterChange(value, type, which)}
                  getWaveType={(type, parent, which) => handleWaveTypes(type, parent, which)}
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
