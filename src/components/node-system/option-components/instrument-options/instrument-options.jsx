import React, { useState } from 'react'
import OmniOscillator from '../components/omni-oscillator/omni-oscillator'
import { colorScheme } from '../../node-helpers/helperFunctions'
import "./instrument-options.scss"
import Switch from '../parameters/switch/switch'
import Envelope from '../components/envelope/envelope'


const InstrumentOptions = ({toneObj}) => {

  const [openProperties, setOpenProperties] = useState(false)
  const [_parameters, setParameters] = useState(toneObj.parameters) 
  const [_carrierParameters, setCarrierParameters] = useState(_parameters.oscillator.osc)
  const [_modulatorParameters, setModulatorParameters] = useState(_parameters.hasOwnProperty("modulator") ? _parameters.modulator.osc : null)
  const [carrierOscillatorType, setCarrierOscillatorTyoe] = useState(_parameters.carrierOscillatorType)
  const [modulatorOscillatorType, setModulatorOscillatorType] = useState(_parameters.modulatorOscillatorType)

  const handleParameterChange = (value, type, which) => {

  }

  const handleWaveTypes = (type, which) => {
    if (type && which) {
      if (which === "carrier") {
        toneObj.tone.oscillator.type = type
        setCarrierParameters(previousParamters => ({
          ...previousParamters, 
          type: type
        }))
      } else {
        toneObj.tone.modulator.type = type
        setModulatorParameters(previousParamters => ({
          ...previousParamters, 
          type: type
        }))
      }
    }
  }

  const handleOscillatorType = (type, which) => {
    const oscType = type === "osc" ? "oscillator" : type 

    if (type && which) {
      if (which === "carrier") {
        setCarrierOscillatorTyoe(type) 
        toneObj.tone.oscillator.sourceType = oscType
        setCarrierParameters(_parameters.oscillator[type])
      } else {
        setModulatorOscillatorType(type)
        toneObj.tone.modulator.sourceType = oscType
        setModulatorParameters(_parameters.modulator[type])
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
                style={{borderRight: `1px solid ${colorScheme[toneObj.type]}`}}
              > 
              <div className='omni-oscillators'>
                <Switch 
                  elements={["osc", "fm", "am", "fat", "pulse", "pwm" ]}
                  value={carrierOscillatorType}
                  parentType={"Instrument"}
                  whichOscillator={"carrier"}
                  getWaveType={(type, which) => handleOscillatorType(type, which)}
                  orientation={"horizontal"}
                />
                {_parameters.envelope ? (
                  <>
                    <Envelope 
                      parameters={_parameters.envelope}
                    />
                  </>
                ) : null}
                <OmniOscillator 
                  parameters={_carrierParameters}
                  which={"carrier"}
                  oscillatorType={carrierOscillatorType}
                  getParameter={(value, type, which) => handleParameterChange(value, type, which)}
                  getWaveType={(wave, which) => handleWaveTypes(wave, which)}
                />
              </div>
          </div>          

        ) : null }
       </>
    </div>
  )
}

export default InstrumentOptions
