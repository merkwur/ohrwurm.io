import React, { useEffect, useState } from 'react'
import HorizontalSlider from '../horizontal-slider/horizontal-slider'

import './master-param.scss'
import { initialStates } from '../../../../node-helpers/toneData'
import Switcheroo from '../switcheroo/switcheroo'
import StartButton from '../start-button/start-button'

const MasterParam = ({id, 
                      name, 
                      type, 
                      value,
                      getOscillatorState, 
                      getParameter,
                      
                    }) => {

  return (
    <>
      <div className='param-wrapper'>
        { name === "type" ? (
          <Switcheroo 
            elements={["sine", "square", "sawtooth", "triangle"]}
            type={type}
            getWaveType={(whichElement) => handleSelection(whichElement)}
            />
          )
        : initialStates[name] ? (
          <HorizontalSlider 
            id={id} 
            name={name} 
            type={type} 
            parameterValue={value}
            param={initialStates[name]}
            getParameter={getParameter}
            
            />
        ) 
        : name === "start" ? (
          <StartButton 
            value={value}
            getOscillatorState={getOscillatorState}
          />
        ) : null}
        
      </div>
    </>
  )
}

export default MasterParam
