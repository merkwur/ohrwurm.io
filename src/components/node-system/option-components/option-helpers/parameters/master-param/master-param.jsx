import React, { useEffect, useState } from 'react'
import HorizontalSlider from '../horizontal-slider/horizontal-slider'
import Detune from '../detune/detune'
import './master-param.scss'
import { initialStates } from '../../../../node-helpers/toneData'
import Switcheroo from '../switcheroo/switcheroo'

const MasterParam = ({id, name, type, startOscillator}) => {
  const [runOscillator, setRunOscillator] = useState(false)

  const handleSelection = (which) => {

  }
  const handleStartOscillator =() => {
    setRunOscillator(!runOscillator)
  }

  useEffect(() => {
    startOscillator(id)
  }, [runOscillator])

  return (
    <div className='param-wrapper'>
      { name === "type" ? (
        <Switcheroo 
          elements={["sine", "square", "sawtooth", "triangle"]}
          type={type}
          getWaveType={(whichElement) => handleSelection(whichElement)}
          />
      )
      : initialStates[name] ? (
        <HorizontalSlider id={id} name={name} type={type} param={initialStates[name]}/>
      ) 
      : name === "start" ? (
        <div 
          className='start-button'
          onClick={handleStartOscillator}
          >

        </div>
      ) : null}
      
    </div>
  )
}

export default MasterParam
