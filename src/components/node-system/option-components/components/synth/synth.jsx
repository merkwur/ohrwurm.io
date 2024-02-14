import React, { useEffect } from 'react'
import Switch from '../../parameters/switch/switch'
import Envelope from '../envelope/envelope'
import OmniOscillator from '../omni-oscillator/omni-oscillator'
import "./synth.scss"
import { initialStates } from '../../../node-helpers/toneData'
import HorizontalSlider from '../../parameters/horizontal-slider/horizontal-slider'

const Synth = ({
                parentSource, 
                getParameter,
                getWaveType,
                getOscillatorType,
                getEnvelopeParameter,
                _envelope, 
                _oscillator,
                _synth,
                _oscillatorType
}) => {

  console.log(_oscillator, parentSource)


  return (
    <div className='synth-wrapper'>
      <div className='synth-carrier'>
        <Switch 
          elements={["osc", "fm", "am", "fat", "pulse", "pwm" ]}
          value={_oscillatorType}
          parentType={"Instrument"}
          whichSource={"carrier"}
          parentSource={parentSource}
          getWaveType={getOscillatorType}
          orientation={"horizontal"}
        />
        <div className='carrier-oscillator'> 
          <>
            <Envelope 
              parameters={_envelope}
              which={parentSource}
              getParameter={getEnvelopeParameter}
            />
          </>
          <div className='synth-parameters'>
            {_oscillator.type ? (
              <div className='synth-wave-select'>
                <Switch
                  elements={initialStates.type.value}
                  value={_synth.type}
                  parentType={"Instrument"}
                  whichSource={"carrier"}
                  parentSource={parentSource}
                  getWaveType={getWaveType}
                  orientation={"vertical"}
                />
              </div>
            ) : null}
            <div className='synth-sliders'>
              {Object.keys(_synth).map((parameter, index) => (
                <React.Fragment key={parameter+index+parentSource+"synth"}>
                  {initialStates[parameter] && initialStates[parameter].type === 'slider' ? (
                    <HorizontalSlider 
                      name={parameter}
                      type={"Instrument"}
                      state={initialStates[parameter]}
                      parameterValue={_synth[parameter]}
                      getParameter={getParameter}
                      whichOscillator={parentSource}
                      parentOscillator={null}
                    />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className='oscillator-adjustable-parameters'>
            <div className='oscillator-modulator-sliders'>
              {Object.keys(_oscillator).map((parameter, index) => (
                <React.Fragment key={parameter+index+parentSource+"oscillator"}>
                  {!_synth.hasOwnProperty(parameter) && initialStates[parameter] && initialStates[parameter].type === "slider" ? (
                    <HorizontalSlider 
                      name={parameter}
                      type={"Instrument"}
                      state={initialStates[parameter]}
                      parameterValue={_oscillator[parameter]}
                      getParameter={getParameter}
                      whichOscillator={parentSource}
                      parentOscillator={null}
                    />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
            {_oscillator.modulator ? (
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
            ) : null}
          </div>
        </div>
      </div>          
    </div>
  )
}

export default Synth
