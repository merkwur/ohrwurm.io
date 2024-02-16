import React, { useEffect } from 'react'
import Switch from '../../parameters/switch/switch'
import Envelope from '../envelope/envelope'
import OmniOscillator from '../omni-oscillator/omni-oscillator'
import "./synth.scss"
import { initialStates } from '../../../node-helpers/toneData'
import HorizontalSlider from '../../parameters/horizontal-slider/horizontal-slider'
import Dropdown from '../dropdown/dropdown'


const efm = ["frequency"]  

const Synth = ({
                parentSource, 
                getParameter,
                getWaveType,
                getOscillatorType,
                getEnvelopeParameter,
                getCurveType,
                _connected,
                _envelope, 
                _oscillator,           
                _synth,
                _oscillatorType
}) => {

  console.log(_connected)

  return (
    <div className='synth-wrapper'>
      <div className='synth-carrier'>
        {_oscillator ? (
          <Switch 
            elements={["osc", "fm", "am", "fat", "pulse", "pwm" ]}
            value={_oscillatorType}
            parentType={"Instrument"}
            whichSource={parentSource}
            parentSource={parentSource}
            getWaveType={getOscillatorType}
            orientation={"horizontal"}
          />
        ) : null}
        <div className='carrier-oscillator'> 
          {_envelope ? (
          <>
            <Envelope 
              parameters={_envelope}
              which={parentSource}
              getParameter={getEnvelopeParameter}
            />
          <div className='attack-curve-type'>
              <Dropdown 
                options={initialStates.attackCurve.value}
                selectFilterType={getCurveType}
                value={_envelope.attackCurve}
                header={"aCurve"}
                type={"Instrument"}
                which={parentSource}
                />
          </div>
            </>
            ) : null}
          <div className='synth-parameters'>
            {_oscillator && _oscillator.type ? (
              <>
              {parentSource === "modulator" ? (
                <div className='carrier-image'>
                  C
                </div>
              ) : null}
                <div 
                  className='synth-wave-select'
                  style={{width: parentSource === "carrier" ? "20%" : "100%"}}
                >
                  <Switch
                    elements={initialStates.type.value}
                    value={_oscillator.type}
                    parentType={"Instrument"}
                    whichSource={"carrier"}
                    parentSource={parentSource}
                    getWaveType={getWaveType}
                    orientation={parentSource === "carrier" ? "vertical" : "horizontal"}
                  />
                </div>
              </>
            ) : null}
            {parentSource === "carrier" ? (
              <div 
                className='synth-sliders'
                style={{borderLeft: parentSource === "carrier" ? "1px solid #77777777" : ""}}
              >
                {Object.keys(_synth).map((parameter, index) => (
                  <React.Fragment key={parameter+index+parentSource+"synth"}>
                    {initialStates[parameter] && initialStates[parameter].type === 'slider' ? (
                      <>
                        {_connected && parameter === "frequency" ? (
                          null
                          ) : (
                            <HorizontalSlider 
                              name={parameter}
                              type={"Instrument"}
                              state={initialStates[parameter]}
                              parameterValue={_synth[parameter]}
                              getParameter={getParameter}
                              whichOscillator={"carrier"}
                              parentOscillator={parentSource}
                              from={"synth"}
                            />
                        )}
                      </>
                    ) : null}
                  </React.Fragment>
                ))}
              </div>
            ) : null} 
          </div>
          <div className='oscillator-adjustable-parameters'>
            <div className='oscillator-modulator-sliders'>
              {_oscillator ?  (
                <>
                  {Object.keys(_oscillator).map((parameter, index) => (
                    <React.Fragment key={parameter+index+parentSource+"oscillator"}>
                      {!_synth.hasOwnProperty(parameter) && !efm.includes(parameter) && initialStates[parameter] && initialStates[parameter].type === "slider" ? (
                        <HorizontalSlider 
                          name={parameter}
                          type={"Instrument"}
                          state={initialStates[parameter]}
                          parameterValue={_oscillator[parameter]}
                          getParameter={getParameter}
                          whichOscillator={"carrier"}
                          parentOscillator={parentSource}
                          from={"oscillator"}
                        />
                      ) : null}
                    </React.Fragment>
                  ))}
                </>
              )  : null }
            </div>
            {_oscillator && _oscillator.modulator ? (
              <div className='omni-oscillator-modulation'>
                <div className='modulation-image'>
                  m
                </div>
                <div className='oscillator-modulator-wave-select'>
                  <Switch 
                    elements={initialStates.type.value}
                    value={_oscillator.modulationType}
                    parentType={"Instrument"}
                    whichSource={"modulator"}
                    parentSource={parentSource}
                    getWaveType={getWaveType}
                    orientation={"horizontal"}
                  />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>          
    </div>
  )
}

export default Synth
