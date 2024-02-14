import React, { useEffect, useState } from 'react'
import "./source-options.scss"
import { colorScheme } from '../../node-helpers/helperFunctions'
import Oscillator from '../components/oscillator/oscillator'
import LFO from '../components/lfo/lfo'



const SourceOptions = ({toneObj}) => {

  const [openProperties, setOpenProperties] = useState(true)
  const [_parameters, setParameters] = useState(toneObj.parameters)    
  const [_modulatorParameters, setModulatorParameters] = useState(_parameters.hasOwnProperty("modulator") ? _parameters.modulator : null)
  

  const handleParameterChange = (value, type, which) => {


    if (type) {
      if (which === "carrier") {
        if (type === "detune") {
          toneObj.tone.detune.set({value: value})
        } else if (typeof toneObj.tone[type] === "object") {
            toneObj.tone[type].value = value
        } else {
            toneObj.tone[type] = value 
        }
      } else {
        if (type === "detune") {
          toneObj.tone._modulator.detune.set({value: value})
        } else if (typeof toneObj.tone._modulator[type] === "object") {
            toneObj.tone._modualtor[type].value = value
        } else {
            toneObj.tone._modulator[type] = value 
        }
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

  //useEffect(() => {console.log(_parameters)}, [_parameters])

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

  const handleWaveTypes = (type, which) => {
    console.log("type: ", type, "parent: ", parent, "which: ", which)
    if (which === "carrier" || which === "oscillator") {

      toneObj.tone.type = type
      setParameters(previousParameters => ({
        ...previousParameters, 
        type: type
      }))
    } else {
      toneObj.tone.modulationType = type
      setModulatorParameters(previousParameters => ({
        ...previousParameters,
        type: type
      }))
    }
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
            {toneObj.name === "LFO" ? (
              <LFO 
                parameters={_parameters}
                getOscillatorState={(id) => handleStartOscillator(id)}
                getParameter={(value, type, which) => handleParameterChange(value, type, which)}
                getWaveType={(type, which) => handleWaveTypes(type, which)}
              />
            ) : toneObj.name === "Noise" ? (
              <></>
            ) :  (
              <>
                <div className='carrier-oscillator'>
                  <Oscillator 
                    parameters={_parameters}
                    which={"carrier"}
                    getOscillatorState={(id) => handleStartOscillator(id)}
                    getParameter={(value, type, which) => handleParameterChange(value, type, which)}
                    getWaveType={(type, which) => handleWaveTypes(type, which)}
                  />
                </div>
                <div className='modulator-parameters'>
                  {toneObj.parameters.hasOwnProperty("modulator") ? (
                    <>
                      <div className='separator'>
                        modulator
                      </div>
                      <div className='modulator-oscillator'>
                        <Oscillator 
                          parameters={_modulatorParameters}
                          which={"modulator"}
                          getOscillatorState={(id) => handleStartOscillator(id)}
                          getParameter={(value, type, which) => handleParameterChange(value, type, which)}
                          getWaveType={(type, parent, which) => handleWaveTypes(type, parent, which)}
                        />
                      </div>  
                    </>
                  ) : null}
                </div>
              </>
            )}
          </div>
        ) : null }

       </>
    </div>
  )
}

export default SourceOptions
