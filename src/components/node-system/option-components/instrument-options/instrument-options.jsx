import React, { useEffect, useState } from 'react'
import OmniOscillator from '../components/omni-oscillator/omni-oscillator'
import { colorScheme } from '../../node-helpers/helperFunctions'
import "./instrument-options.scss"
import Switch from '../parameters/switch/switch'
import Envelope from '../components/envelope/envelope'
import HorizontalSlider from '../parameters/horizontal-slider/horizontal-slider'
import { initialStates } from '../../node-helpers/toneData'
import Synth from '../components/synth/synth'


const InstrumentOptions = ({toneObj}) => {

  const [openProperties, setOpenProperties] = useState(true)
  const [_parameters, setParameters] = useState(toneObj.parameters) 
  const [_envelope, setEnvelope] = useState(_parameters.hasOwnProperty("envelope") ? _parameters.envelope : null)
  const [_carrierParameters, setCarrierParameters] = useState(_parameters.hasOwnProperty("oscillator") ? _parameters.oscillator.osc : null)
  const [_oscillatorType, setOscillatorType] = useState(_parameters.oscillatorType)
  const [_carrierBaseType, setCarrierBaseType] = useState(_parameters.type)
  const [_synthParameters, setSynthParameters] = useState(_parameters.synth)

  

  useEffect(() => {
    console.log(_synthParameters)
    console.log(_carrierParameters)
  }, [_synthParameters, _carrierParameters])
  
  const handleParameterChange = (value, type, which, parent) => {
    
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
              <Synth 
                parentSource={"carrier"}
                getParameter={(value, type, which, parent) => handleParameterChange(value, type, which, parent)}
                getWaveType={(wave, type, parent) => handleWaveTypes(wave, type, parent)}
                getEnvelopeParameter={(value, type, which) => handleEnvelopeParameters(value, type, which)}
                getOscillatorType={(value, which) => handleOscillatorType(value, which)}
                _oscillator={_carrierParameters}
                _synth={_synthParameters}
                _envelope={_envelope}
                _oscillatorType={_oscillatorType}
              />

          </div>
        ) : null }
      </>
    </div>
  )
}

export default InstrumentOptions
