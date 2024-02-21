import React, { useState } from 'react'
import { colorScheme } from '../../node-helpers/helperFunctions'
import Envelope from '../components/envelope/envelope'
import "./component-options.scss"
import Dropdown from '../components/dropdown/dropdown'
import { initialStates } from '../../node-helpers/toneData'
import HorizontalSlider from '../parameters/horizontal-slider/horizontal-slider'
import StartButton from '../parameters/start-button/start-button'

const ComponentOptions = ({toneObj}) => {
  const [openProperties, setOpenProperties] = useState(true)
  const [_parameters, setParameters] = useState(toneObj.parameters)
  const [_envelope, setEnvelope] = useState(_parameters.envelope ? _parameters.envelope : null)
  const [_attackCurve, setAttackCurve] = useState(_envelope ? _envelope.attackCurve : null)
  const [_types, setTypes] = useState(_parameters.type ? initialStates[_parameters.type].value : null)
  const [_type, setType] = useState(_types ? _types[0] : null)
  const [_recorderState, setRecorderState] = useState(false)

  

  const handleEnvelopeParameters = (value, type) => {
    toneObj.tone[type] = value
    setEnvelope(previousParameters => ({
      ...previousParameters, 
      [type]: value
    }))
  }

  const handleEnvelopeCurve = (type) => {
    setAttackCurve(type)
    toneObj.tone.attackCurve = type
  }

  const handleSliderParameters = (value, type) => {
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

  const handleDropdown = (type) => { 
    toneObj.tone.type = type
    setType(type)
  }



  return (
    <div className='component-options-wrapper'>
      <div 
        className='left-stander'
        onClick={() => setOpenProperties(!openProperties)}
        >
        <div className='header'>
          {toneObj.name}
        </div>
      </div>
      
        { openProperties ? (
          <div className='parameters'
            style={{
              borderRight: `1px solid ${colorScheme["Component"]}`, 
              display: toneObj.name === "DuoSynth" ? "flex" : ""
            }}
              > 
              <div className='parameters-left-side'>
                <div 
                  className='head'
                  >
                  
                </div>
                {_envelope ? (
                  <>
                    <Envelope 
                      parameters={_envelope}
                      which={null}    
                      getParameter={(value, type) => handleEnvelopeParameters(value, type)}
                    />
                    <div className='head'>
                      
                    </div>
                    <Dropdown 
                      options={initialStates.attackCurve.value}
                      selectFilterType={(type) => handleEnvelopeCurve(type)}
                      value={_attackCurve}
                      type={"Component"}
                      header={"attackCurve"}
                    />
                  </>
                ) : null}
                {Object.keys(_parameters).map((parameter, index) => (
                  <div 
                    className='params'
                    key={"component"+parameter+index}
                    > 
                    {initialStates[parameter] && initialStates[parameter].type === "slider" ? (
                      <HorizontalSlider 
                        name={parameter}
                        type={"Component"}
                        state={initialStates[parameter]}
                        parameterValue={_parameters[parameter]}
                        getParameter={(value, type) => handleSliderParameters(value, type)}
                        whichOscillator={null}
                        parentOscillator={null}
                        from={null}
                      /> 
                    ) : parameter === "type" && _parameters[parameter] === "filterTypes" ? (
                      <Dropdown 
                        options={_types}
                        selectFilterType={(option) => handleDropdown(option)}
                        value={_type}
                        header={_parameters.type}
                        type={"Component"}
                        which={null} 
                      />
                    )
                     :  parameter === "start" ? (
                        <StartButton 
                          value={_parameters.start}
                          getOscillatorState={(state) => handleState(state)}
                        />
                        ): null } 
                  </div>
                ))}
              </div>
          </div>
        ) : null }
    </div>
  )
}

export default ComponentOptions
