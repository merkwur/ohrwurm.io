import React, { useEffect, useState } from 'react'
import OmniOscillator from '../components/omni-oscillator/omni-oscillator'
import { colorScheme } from '../../node-helpers/helperFunctions'
import "./instrument-options.scss"
import Switch from '../parameters/switch/switch'
import Envelope from '../components/envelope/envelope'
import HorizontalSlider from '../parameters/horizontal-slider/horizontal-slider'
import { initialStates } from '../../node-helpers/toneData'



const InstrumentOptions = ({toneObj}) => {

  const [openProperties, setOpenProperties] = useState(false)
  const [_parameters, setParameters] = useState(toneObj.parameters) 
  const [_carrierParameters, setCarrierParameters] = useState(_parameters.oscillator.osc)
  const [_modulatorParameters, setModulatorParameters] = useState(_parameters.hasOwnProperty("modulator") ? _parameters.modulator.osc : null)
  const [carrierOscillatorType, setCarrierOscillatorType] = useState(_parameters.carrierOscillatorType)
  const [modulatorOscillatorType, setModulatorOscillatorType] = useState(_parameters.modulatorOscillatorType)
  const [portamentoValue, setPortamentoValue] = useState(0)
  const [_envelope, setEnvelope] = useState(_parameters.envelope)
  const [_modulationEnvelope, setModulationEnvelope] = useState(_parameters.modulationEnvelope)
  const [carrierWaveType, setCarrierWaveType] = useState(_carrierParameters.type)
  const [modalatorWaveType, setModulatorWaveType] = useState(_modulatorParameters.type)


  const handleParameterChange = (value, type, which) => {
    if (type && which) {
      if (which === "carrier") {
        if (type === "detune") {
          toneObj.tone.detune.set({value: value})
        } else if (typeof toneObj.tone.oscillator[type] === "object") {
          toneObj.tone.oscillator[type].value = value
        } else {
          toneObj.tone.oscillator[type] = value
        }
        setCarrierParameters(previousParamters => ({
          ...previousParamters, 
          [type]: type
        }))
      } else {
        if (type === "detune") {
          toneObj.tone.modulation.detune.set({value: value})
        } else if (typeof toneObj.tone.modulation[type] === "object") {
          toneObj.tone.modulation[type].value = value
        } else {
          toneObj.tone.modulation[type] = value
        }
        setCarrierParameters(previousParamters => ({
          ...previousParamters, 
          [type]: type
        }))
      }
    }
  }

  const handleWaveTypes = (type, which) => {
    if (type && which) {
      if (which === "carrier") {
        toneObj.tone.oscillator.baseType = type
        setCarrierWaveType(type)
      } else {
        toneObj.tone.modulation.baseType = type
        setModulatorWaveType(type)
      }
    }
  }

  useEffect(() => {
      console.log(_carrierParameters)
      console.log(carrierOscillatorType)
      
    }, [_carrierParameters])

  const handleOscillatorType = (type, which) => {
    const oscType = type === "osc" ? "oscillator" : type 
    
    console.log(type, which)
    if (type && which) {
      if (which === "carrier") {
        setCarrierOscillatorType(type) 
        toneObj.tone.oscillator.sourceType = oscType
        setCarrierParameters(_parameters.oscillator[type])
      } else {
        setModulatorOscillatorType(type)
        toneObj.tone.modulation.sourceType = oscType
        setModulatorParameters(_parameters.modulator[type])
      }
    }
  }

  // useEffect(() => {console.log(_carrierParameters)}, [_carrierParameters])

  const handleEnvelopeParameters = (value, type, which) => {
    
    if (which && type && typeof value === "number") {
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

  const handlePortamentoValue = (value) => {
    setPortamentoValue(value)
    toneObj.tone.portamento = value
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
                style={{borderRight: `1px solid ${colorScheme[toneObj.type]}`}}
              > 
              <div className='synth-oscillators'>
                <div className='carrier-synth'> 
                  <div className='carrier-header'>
                    carrier
                  </div>
                  <Switch 
                    elements={["osc", "fm", "am", "fat", "pulse", "pwm" ]}
                    value={carrierOscillatorType}
                    parentType={"Instrument"}
                    whichOscillator={"carrier"}
                    getWaveType={(type, which) => handleOscillatorType(type, which)}
                    orientation={"horizontal"}
                  />
                  <div className='carrier-oscillator'> 
                    {_parameters.envelope ? (
                      <>
                        <Envelope 
                          parameters={_envelope}
                          which={"carrier"}
                          getParameter={(value, type, which) => handleEnvelopeParameters(value, type, which)}
                        />
                      </>
                    ) : null} 
                  <div className='portamento-slider'>
                    <HorizontalSlider 
                      name={"portamento"}
                      type={"Instrument"}
                      state={initialStates.portamento}
                      parameterValue={portamentoValue}
                      getParameter={(value) => handlePortamentoValue(value)}
                    />
                  </div>
 
                  </div>
                </div>
                {_parameters.modulator ? (
                  <div className='modulator-synth'> 
                    <div className='modulator-header'>
                      modulator
                    </div>
                    <Switch 
                      elements={["osc", "fm", "am", "fat", "pulse", "pwm" ]}
                      value={modulatorOscillatorType}
                      parentType={"Instrument"}
                      whichOscillator={"modulator"}
                      getWaveType={(type, which) => handleOscillatorType(type, which)}
                      orientation={"horizontal"}
                    />
                    <div className='carrier-oscillator'> 
                      {_parameters.modulationEnvelope ? (
                        <>
                          <Envelope 
                            parameters={_modulationEnvelope}
                            which={"modulator"}
                            getParameter={(value, type, which) => handleEnvelopeParameters(value, type, which)}
                          />
                        </>
                      ) : null}          
                      <div>

                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
          </div>          
        ) : null }
       </>
    </div>
  )
}

export default InstrumentOptions
