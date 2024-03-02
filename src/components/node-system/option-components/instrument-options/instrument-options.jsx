import React, { memo, useEffect, useState } from 'react'
import { colorScheme } from '../../node-helpers/helperFunctions'
import "./instrument-options.scss"
import Synth from '../components/synth/synth'
import Mono from '../components/mono/mono'
import { faHatCowboySide } from '@fortawesome/free-solid-svg-icons'


/*felt cute. might delete it later! :P xoxo*/

const InstrumentOptions = memo(({toneObj}) => {

  const [openProperties, setOpenProperties] = useState(true)
  const [_parameters, setParameters] = useState(toneObj.parameters) 
  const [_envelope, setEnvelope] = useState(_parameters.hasOwnProperty("envelope") ? _parameters.envelope : null)
  const [_modulationEnvelope, setModulationEnvelope] = useState(_parameters.hasOwnProperty("modulationEnvelope") ? _parameters.modulationEnvelope : null)
  const [_carrierParameters, setCarrierParameters] = useState(_parameters.hasOwnProperty("oscillator") ? _parameters.oscillator.osc : _parameters.oscillator0 ? _parameters.oscillator0.osc : null)
  const [_modulatorParameters, setModulatorParameters] = useState(_parameters.hasOwnProperty("modulator") ? _parameters.modulator.osc : _parameters.oscillator1 ? _parameters.oscillator1.osc : null)
  const [_oscillatorType, setOscillatorType] = useState(_parameters.noiseType ? _parameters.noiseType : _parameters.oscillatorType)
  const [_modulationType, setModulationType]  =useState(_parameters.modulationType)
  const [_carrierBaseType, setCarrierBaseType] = useState(_parameters.type)
  const [_synthParameters, setSynthParameters] = useState(_parameters.voice0 ? _parameters.voice0 : _parameters.synth)
  const [_modulatorSynthParameters, setModulatorSynthParameters] = useState(_parameters.voice1 ? _parameters.voice1 : _parameters.modulatorSynth)
  const [_filterParameters, setFilterParameters] = useState(_synthParameters.hasOwnProperty("filter") ? _synthParameters.filter : null)
  const [_filterEnvelopeParameters, setFilterEnvelopeParameters] = useState(_synthParameters.hasOwnProperty("filter") ? _synthParameters.filterEnvelope : null)
  const [_isSynthConnected, setIsSynthConnected] = useState(toneObj.isTriggerConnected)
  const [_noiseTypes, setNoiseTypes] = useState(_parameters.noiseTypes ? _parameters.noiseTypes : null)



  useEffect(() => {
    if (toneObj.name === "Synth") {
      toneObj.tone.oscillator.baseType = "sine"
    }
  }, [])

  const handleParameterChange = (value, type, which, parent, from) => {
    
    if (toneObj.isTriggerConnected && type === "frequency") {
      return
    }
    /* there should be better way to handle whis! */
    if (type && which && parent && from) {
      if (toneObj.name === "DuoSynth") {
        if (parent === "carrier") {
          if (from === "synth") {
            if (type === "detune") {
              toneObj.tone.detune.set({value: value})
            } else if (typeof toneObj.tone[type] === "object") {
              toneObj.tone[type].value = value
            } else {
              toneObj.tone[type] = value
            }
            setSynthParameters(previousParameters => ({
              ...previousParameters, 
              [type]: value
            }))
          } else {
            toneObj.tone.voice0.oscillator[type] = value
          }
        } else {

        }
      } else if (parent === "carrier") {
        if (from === "synth") {
          if (type === "detune") {
            toneObj.tone.detune.set({value: value})
          } else if (typeof toneObj.tone[type] === "object") {
            toneObj.tone[type].value = value
          } else {
            toneObj.tone[type] = value
          }
          setSynthParameters(previousParameters => ({
            ...previousParameters, 
            [type]: value
          }))
        } else {
          if (type === "detune") {
            toneObj.tone.oscillator.detune.set({value: value})
          } else if (typeof toneObj.tone.oscillator[type] === "object") {
            toneObj.tone.oscillator[type].value = value
          } else {
            toneObj.tone.oscillator[type] = value
          }
          setCarrierParameters(previousParameters => ({
            ...previousParameters, 
            [type]: value
          }))
        }
      } else {
        
        if (from === "synth") {
          if (type === "detune") {
            toneObj.tone.modulation.detune.set({value: value})
            toneObj.tone.modulation.frequency.value = 1200
          } else if (toneObj.tone.modulation[type] === "object") {
            toneObj.tone.modulation[type].value = value
          } else {
            toneObj.tone.modulation[type] = value
          }
          setModulatorSynthParameters(previousParameters => ({
            ...previousParameters, 
            [type]: value
          }))
        } else {
          toneObj.tone.modulation[type] = value
          setModulatorParameters(previousParameters => ({
            ...previousParameters, 
            [type]: value
          }))
        }
      }
    }
  }



  const handleWaveTypes = (wave, which, parent) => {
    if (wave && which && parent) {
      if (parent === "carrier") {
        if (which === "carrier") {
          toneObj.tone.oscillator.baseType = wave
          setCarrierParameters(previousParameters => ({
            ...previousParameters, 
            type: wave
          }))
        } else
          toneObj.tone.oscillator.modulationType = wave
          setCarrierParameters(previousParameters => ({
            ...previousParameters, 
            modulationType: wave
          }))
      } else {
        if (which === "carrier") {
          toneObj.tone.modulation.baseType = wave
          setModulatorParameters(previousParameters => ({
            ...previousParameters, 
            type: wave
          }))
        } else {
          toneObj.tone.modulation.modulationType = wave
          setModulatorParameters(previousParameters => ({
            ...previousParameters, 
            modulationType: wave
          }))
        }
      }
    }
  }


  const handleOscillatorType = (type, which) => {

    
    if (toneObj.name === "NoiseSynth") {
      toneObj.tone.noise.type = type
    } else  if (type && which) {
      if (which === "carrier") {
        if (type !== "pwm" || type !== "pulse") {
          if (toneObj.tone.oscillator.partialCount > 1) {
            toneObj.tone.oscillator.type = toneObj.tone.oscillator.baseType + toneObj.tone.oscillator.partialCount
          } else {
             toneObj.tone.oscillator.type = toneObj.tone.oscillator.baseType 
          }
        }
        toneObj.tone.oscillator.sourceType = type
        setOscillatorType(type)
        setCarrierParameters(_parameters.oscillator[type])
      } else {
        toneObj.tone.modulation.sourceType = type
        setModulationType(type)
        setModulatorParameters(_parameters.modulator[type])
      }
    }
  }


  const handleEnvelopeParameters = (value, type, which) => {
    if (type && which) {
      if (which === "carrier") {
        toneObj.tone.envelope[type] = value
        setEnvelope(previousParameters => ({
          ...previousParameters, 
          [type]: value
        }))
      } else {
        toneObj.tone.modulationEnvelope[type] = value
        setModulationEnvelope(previousParameters => ({
          ...previousParameters, 
          [type]: value
        }))
      }
    }
  }

  const handleFilterEnvelope = (value, type, which) => {
    if (type) {
      toneObj.tone.filterEnvelope[type] = value
      setFilterEnvelopeParameters(previousParameters => ({
        ...previousParameters,
        [type]: value
      }))
    }
  } 

  const handleFilterParameters = (value, type, which) => {
    if (type) {
      if (typeof toneObj.tone.filter[type] === "object") {
        
        toneObj.tone.filter[type].set({value: value}) 
      } else {
        toneObj.tone.filter[type] = value
      }
      setFilterParameters(previousParameters => ({
        ...previousParameters, 
        [type]: value
      }))
    }
  }

  const handleFilterType = (filterType) => {
    if (filterType) {
      toneObj.tone.filter.type = filterType
      setFilterParameters(previousParameters => ({
        ...previousParameters, 
        type: filterType
      }))
    }
  }

  const handleCurveType = (curveType, which) => {
    if (curveType) {
      if (which === "carrier") {
        toneObj.tone.envelope.attackCurve = curveType
        setEnvelope(previousParameters => ({
          ...previousParameters, 
          attackCurve: curveType
        }))
      } else {
        toneObj.tone.modulationEnvelope.attackCurve = curveType
        setModulationEnvelope(previousParameters => ({
          ...previousParameters, 
          attackCurve: curveType
        }))
      }
    }
  }

  return (
    <div className='instrument-options-wrapper'>
      <div 
        className='left-stander'
        onClick={() => setOpenProperties(!openProperties)}
        >
        <div className='header'>
          {toneObj.name}
        </div>
      </div>
      < >
        { openProperties ? (
          <div className='parameters'
            style={{
              borderRight: `1px solid ${colorScheme["Instrument"]}`, 
              display: toneObj.name === "DuoSynth" ? "flex" : "",
              flexDirection: toneObj.name !== "DuoSynth" ? "column" : ""
            }}
              > 
              <div className='parameters-left-side'>
                <div className='synth-header'>
                  {_parameters.voice0 ? "voice0" : "carrier"}
                </div>
                <Synth 
                  parentSource={"carrier"}
                  getParameter={(value, type, which, parent, from) => handleParameterChange(value, type, which, parent, from)}
                  getWaveType={(wave, type, parent) => handleWaveTypes(wave, type, parent)}
                  getEnvelopeParameter={(value, type, which) => handleEnvelopeParameters(value, type, which)}
                  getOscillatorType={(value, which) => handleOscillatorType(value, which)}
                  getCurveType={(value, which) => handleCurveType(value, which)}
                  _connected={_isSynthConnected}
                  _oscillator={_carrierParameters}
                  _synth={_synthParameters}
                  _envelope={_envelope}
                  _oscillatorType={_oscillatorType}
                  _noiseTypes={_noiseTypes}
                  
                />
                {_synthParameters.filter ? (
                  <Mono 
                    filter={_filterParameters}
                    filterEnvelope={_filterEnvelopeParameters}
                    getEnvelopeParameter={(value, type, which) => handleFilterEnvelope(value, type, which)}
                    getParameter={(value, type, which) => handleFilterParameters(value, type, which)}
                    getFilterType={(value) => handleFilterType(value)}
                  />
                ) : null }
              </div>
              {_modulatorParameters ? (
                <div className='parameters-right-side'>
                  <div className='synth-header'>
                    {_parameters.voice1 ?  "voice1" : "modulation"}
                  </div>
                  <Synth 
                    parentSource={"modulator"}
                    getParameter={(value, type, which, parent, from) => handleParameterChange(value, type, which, parent, from)}
                    getWaveType={(wave, type, parent) => handleWaveTypes(wave, type, parent)}
                    getEnvelopeParameter={(value, type, which) => handleEnvelopeParameters(value, type, which)}
                    getOscillatorType={(value, which) => handleOscillatorType(value, which)}
                    getCurveType={(value) => handleCurveType(value)}
                    _connected={_isSynthConnected}
                    _oscillator={_modulatorParameters}
                    _synth={_modulatorSynthParameters}
                    _envelope={_modulationEnvelope}
                    _oscillatorType={_modulationType}
                  />
                  {_modulatorSynthParameters.filter ? (
                    <Mono 
                      filter={_filterParameters}
                      filterEnvelope={_filterEnvelopeParameters}
                      getEnvelopeParameter={(value, type, which) => handleFilterEnvelope(value, type, which)}
                      getParameter={(value, type, which) => handleFilterParameters(value, type, which)}
                      getFilterType={(value) => handleFilterType(value)}
                    />
                  ) : null }
                </div>
              ) : null}
          </div>
        ) : null }
      </>
    </div>
  )
})

export default InstrumentOptions
