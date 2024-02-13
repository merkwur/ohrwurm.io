import React, { useEffect } from 'react'
import { initialStates } from '../../../node-helpers/toneData'
import Switch from '../../parameters/switch/switch'
import HorizontalSlider from '../../parameters/horizontal-slider/horizontal-slider'
import "./omni-oscillator.scss"

const OmniOscillator = ({ parameters,  
                          getParameter, 
                          getWaveType, 
                          parent
                        }) => {


  return (
    <div 
      className='omni-oscillator-wrapper'
        style={{marginTop: parent === "modulator" ? "37.5px" : ""
        }}
      > 
      <div className='omni-carrier-oscillator'>
        <div className='omni-carrier-parameters'>
          <div className='omni-carrier-wave-select'>
            <Switch 
              elements={initialStates.type.value}
              value={parameters.type}
              parentType={"Instrument"}
              whichOscillator={"carrier"}
              parentOscillator={parent}
              getWaveType={getWaveType}
              orientation={"vertical"}
            />
          </div>
          <div className='omni-oscillator-carrier-sliders'>
            {Object.keys(parameters).map((parameter, index) => (
              <React.Fragment key={parameter+index+parent+"omnicarrier"} >
                {initialStates[parameter] && initialStates[parameter].type === "slider" ? (
                  <HorizontalSlider 
                    name={parameter}
                    type={"Instrument"}
                    state={initialStates[parameter]}
                    parameterValue={parameters[parameter]}
                    getParameter={getParameter}
                    whichOscillator={"carrier"}
                    parentOscillator={parent}
                  />
                ) : null}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      {parameters.modulator ? (
        <div className='omni-modulator-oscillator'>
          <div className='separator'>
            m
          </div>
          <div className='omni-modulator-parameters'>
            <div className='omni-modulator-wave-select'>
              <Switch 
                elements={initialStates.type.value}
                value={parameters.modulationType}
                parentType={"Instrument"}
                whichOscillator={"modulator"}
                parentOscillator={parent}
                getWaveType={getWaveType}
                orientation={"horizontal"}
              />
            </div>
            <div className='omni-oscillator-modulator-sliders'>
              {Object.keys(parameters.modulator).map((parameter, index) => (
                <React.Fragment key={parameter+index+parent+"omnimodulator"} >
                  {initialStates[parameter] && initialStates[parameter].type === "slider" ? (
                    <HorizontalSlider 
                      name={parameter}
                      type={"Instrument"}
                      state={initialStates[parameter]}
                      parameterValue={parameters[parameter]}
                      getParameter={getParameter}
                      whichOscillator={"modulator"}
                      parentOscillator={parent}
                    />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

      ) : null }
    </div>
  )
}

export default OmniOscillator
