import React, { useState } from 'react'
import "./source-options.scss"
import MasterParam from '../option-helpers/parameters/master-param/master-param'
import StartButton from '../option-helpers/parameters/start-button/start-button'
import { initialStates } from '../../node-helpers/toneData'
import HorizontalSlider from '../option-helpers/parameters/horizontal-slider/horizontal-slider'
import Switcheroo from '../option-helpers/parameters/switcheroo/switcheroo'
import Oscillator from '../option-helpers/oscillator/oscillator'


const SourceOptions = ({
                        id, 
                        name, 
                        type, 
                        parameters, 
                        getOscillatorState,
                        getParameter, getWaveType
                      }) => {
  const [openProperties, setOpenProperties] = useState(false)

  return (
    <div className='source-options-wrapper'>
      <div 
        className='left-stander'
        onClick={() => setOpenProperties(!openProperties)}
        >
        <div className='header'>
          {name}
        </div>
      </div>
      <>
        { openProperties ? (
          <div className='parameters'
            >
            <div>
              {Object.keys(parameters).map((param, index) => (
                <React.Fragment key={param+index} >
                  <Oscillator 
                    value={parameters[param]}
                    parameterName={param}
                    state={initialStates[param]}
                    type={type}
                    id={id}
                    getOscillatorState={getOscillatorState}
                    getParameter={getParameter}
                    getWaveType={getWaveType}

                  />
                </React.Fragment>       
              ))}      
            </div>
            <div className='seperator'>

            </div>
            <div>
              {Object.keys(parameters).map((param, index) => (
                <React.Fragment key={param+index} >
                  <Oscillator 
                    value={parameters[param]}
                    parameterName={param}
                    state={initialStates[param]}
                    type={type}
                    id={id}
                    getOscillatorState={getOscillatorState}
                    getParameter={getParameter}
                    getWaveType={getWaveType}

                  />
                </React.Fragment>       
              ))}      
            </div>
          </div>
        ) : null }

       </>
    </div>
  )
}

export default SourceOptions
