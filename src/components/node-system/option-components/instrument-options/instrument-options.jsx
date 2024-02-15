import React, { useEffect, useState } from 'react'
import { colorScheme } from '../../node-helpers/helperFunctions'
import "./instrument-options.scss"
import Synth from '../components/synth/synth'
import Mono from '../components/mono/mono'


const InstrumentOptions = ({toneObj}) => {

  const [openProperties, setOpenProperties] = useState(true)
  const [_parameters, setParameters] = useState(toneObj.parameters) 
  const [_envelope, setEnvelope] = useState(_parameters.hasOwnProperty("envelope") ? _parameters.envelope : null)
  const [_carrierParameters, setCarrierParameters] = useState(_parameters.hasOwnProperty("oscillator") ? _parameters.oscillator.osc : null)
  const [_oscillatorType, setOscillatorType] = useState(_parameters.oscillatorType)
  const [_carrierBaseType, setCarrierBaseType] = useState(_parameters.type)
  const [_synthParameters, setSynthParameters] = useState(_parameters.synth)
  const [_filterParameters, setFilterParameters] = useState(_synthParameters.hasOwnProperty("filter") ? _synthParameters.filter : null)
  const [_filterEnvelopeParameters, setFilterEnvelopeParameters] = useState(_synthParameters.hasOwnProperty("filter") ? _synthParameters.filterEnvelope : null)
  


  
  const handleParameterChange = (value, type, which, parent) => {
    if (type && which && parent) {
      if (parent === "carrier" && toneObj.name !== "MetalSynth" && toneObj.name !== "PluckSynth") {
        if (which === "carrier") {
          if (type === "portamento" || type === "octaves" || type === "pitchDecay") {
            toneObj.tone[type] = value
          }
          if (type === "detune") {
            toneObj.tone.oscillator.detune.set({value: value})
          } else if (typeof toneObj.tone.oscillator[type] === "object") {
            toneObj.tone.oscillator[type].value = value
          } else {
            console.log("triggered", type, value, which, parent)
            toneObj.tone.oscillator.set({[type]: value})
          }

          if (type in _carrierParameters){
            setCarrierParameters(previousParameters => ({
              ...previousParameters, 
              [type]: value
            }))
          } else {
            setSynthParameters(previousParameters => ({
              ...previousParameters, 
              [type]: value
            }))
          }
        }
      } else {
        if (type === "detune") {
          toneObj.tone.detune.set({value: value})
        } else if (typeof toneObj.tone[type] === "object") {
          toneObj.tone[type].value = value
        } else {
          toneObj.tone[type] = value
        }
      }
    }
  }

  const handleWaveTypes = (wave, which, parent) => {
    console.log(wave, which, parent)
    if (wave && which, parent) {
      if (parent === "carrier") {
        if (which === "carrier") {
          toneObj.tone.oscillator.baseType = wave
          setSynthParameters(previousParameters => ({
            ...previousParameters, 
            type: wave
          }))
        } else
          toneObj.tone.oscillator.modulationType = wave
          setCarrierParameters(previousParameters => ({
            ...previousParameters, 
            modulationType: wave
          }))
      }
    }
  }


  const handleOscillatorType = (type, which) => {
    console.log("this", type, which)
    const oscType = type === "osc" ? "oscillator" : type
    if (type && which) {
      if (which === "carrier") {
        toneObj.tone.oscillator.sourceType = oscType
        setOscillatorType(type)
        setCarrierParameters(_parameters.oscillator[type])
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
        console.log(toneObj.tone.filter[type])
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

  const handleCurveType = (curveType) => {
    console.log(curveType)
    if (curveType) {
      toneObj.tone.envelope.attackCurve = curveType
      setEnvelope(previousParameters => ({
        ...previousParameters, 
        attackCurve: curveType
      }))
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
              borderRight: `1px solid ${colorScheme["Instrument"]}` 
            }}
              > 
              <div className='parameters-left-side'>
                <Synth 
                  parentSource={"carrier"}
                  getParameter={(value, type, which, parent) => handleParameterChange(value, type, which, parent)}
                  getWaveType={(wave, type, parent) => handleWaveTypes(wave, type, parent)}
                  getEnvelopeParameter={(value, type, which) => handleEnvelopeParameters(value, type, which)}
                  getOscillatorType={(value, which) => handleOscillatorType(value, which)}
                  getCurveType={(value) => handleCurveType(value)}
                  _oscillator={_carrierParameters}
                  _synth={_synthParameters}
                  _envelope={_envelope}
                  _oscillatorType={_oscillatorType}
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

          </div>
        ) : null }
      </>
    </div>
  )
}

export default InstrumentOptions
