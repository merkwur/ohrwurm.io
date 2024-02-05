import React, { useEffect, useState } from 'react'
import HorizontalSlider from '../horizontal-slider/horizontal-slider'

import './master-param.scss'
import { LFOStates, initialStates } from '../../../../node-helpers/toneData'
import Switcheroo from '../switcheroo/switcheroo'
import StartButton from '../start-button/start-button'

const MasterParam = ({id, 
                      name, 
                      type, 
                      value,
                      parent,
                      getOscillatorState, 
                      getParameter,
                      
                    }) => {



  console.log(name)

  return (
    <>
      <div className='param-wrapper'>
        { name === "type" ? (
          <Switcheroo 
            elements={["sine", "square", "sawtooth", "triangle"]}
            type={type}
            getWaveType={(whichElement) => handleSelection(whichElement)}
            />
          ) : name === "start" ? (

            <StartButton 
              value={value}
              getOscillatorState={getOscillatorState}
            />
          ) : parent !== "LFO" ? (
            <>
              {initialStates[name] && initialStates[name].type === "slider" ? (
                <HorizontalSlider 
                  id={id} 
                  name={name} 
                  type={type} 
                  parameterValue={value}
                  param={initialStates[name]}
                  getParameter={getParameter}
                  />) : null }
              
            </>
          ) : parent === "LFO" ? (
            <>
              {LFOStates[name] && LFOStates[name].type === "slider" ? (
                <HorizontalSlider 
                  id={id} 
                  name={name} 
                  type={type} 
                  parameterValue={value}
                  param={LFOStates[name]}
                  getParameter={getParameter}
                  />) : null }
            </>
          ) : null}
        
      </div>
    </>
  )
}

export default MasterParam
