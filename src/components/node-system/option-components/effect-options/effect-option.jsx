import React, { useEffect, useState } from 'react'
import { initialStates } from '../../node-helpers/toneData'
import "./effect-option.scss"
import HorizontalSlider from '../parameters/horizontal-slider/horizontal-slider'
import Dropdown from '../components/dropdown/dropdown'
import StartButton from '../parameters/start-button/start-button'
import { colorScheme } from '../../node-helpers/helperFunctions'
import Switch from '../parameters/switch/switch'

const EffectOptions = ({toneObj}) => {

  const [openProperties, setOpenProperties] = useState(true)
  const [_parameters, setParameters] = useState(toneObj.parameters)
  const [_types, setTypes] = useState(_parameters.type ? initialStates[_parameters.type].value : null)
  const [_type, setType] = useState(_types ? _types[0] : null)
  const [_isOscilaltorRunning, setIsOscillatorRunning] = useState(_parameters.start ? false : null)
  const [_waveType, setWaveType] = useState("sine")

  const handleParameterChange = (value, type) => {
    
    if (type) {

      if (typeof toneObj.tone[type] === "object") {
        toneObj.tone[type].value = value
      } else {
        toneObj.tone[type] = value
      }

      setParameters(previousParameters => ({
        ...previousParameters, 
        [type]: value
      }))
    }
  }

  const handleDropdown = (option) => {
    toneObj.tone.filter.type = option
    setType(option)
  }

  const handleOscillatorState = () => {
    if (!_isOscilaltorRunning) {
      console.log(_isOscilaltorRunning, "and we triggered the filter")
      toneObj.tone.start()
      setIsOscillatorRunning(true)
    } else {
      toneObj.tone.stop()
      setIsOscillatorRunning(false)
    }
  }

  const handleWaveTypes = (wave) => {
    toneObj.tone.type = wave
    setWaveType(wave)
  }

  return (
    <div className='effect-options-wrapper'>
      <div 
        className='left-stander'
        onClick={() => setOpenProperties(!openProperties)}
        >
        <div className='header'>
          {toneObj.name}
        </div>
      </div>
        {openProperties ? (
          <div 
            className='parameters'
            style={{
              borderRight: `1px solid ${colorScheme["Effect"]}`
            }}
          > 
          {_parameters.hasOwnProperty("start") ? (
            <>
              <StartButton 
                value={_isOscilaltorRunning}
                getOscillatorState={() => handleOscillatorState()}
              />
              <Switch 
                elements={initialStates.type.value}
                value={_waveType}
                parentType={"Effect"}
                getWaveType={(wave) => handleWaveTypes(wave)}
                orientation={"horizontal"}
              />
            </>
          ) : null} 
          {_parameters.type ? (
            <div className='effect-dropdown-type'>
              <Dropdown 
                options={_types}
                selectFilterType={(option) => handleDropdown(option)}
                value={_type}
                header={_parameters.type}
                type={"Effect"}
                which={null}
              />
            </div>
          ) : null}
            {Object.keys(_parameters).map((parameter, index) => (
              <div 
                className='parameter'
                key={"parameter"+index+"effect"}
                >
                  {initialStates[parameter] && initialStates[parameter].type === "slider" ? (
                    <HorizontalSlider 
                      name={parameter}
                      type={"Instrument"}
                      state={initialStates[parameter]}
                      parameterValue={_parameters[parameter]}
                      getParameter={(value, type) => handleParameterChange(value, type)}
                      whichOscillator={null}
                      parentOscillator={null}
                      from={null}
                    />
                  ) : null }
              </div>
            ))}
        </div>
        ) : null}
    </div>
  )
}

export default EffectOptions
