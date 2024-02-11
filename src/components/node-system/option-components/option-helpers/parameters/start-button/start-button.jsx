import React, { useEffect, useState } from 'react'
import "./start-button.scss"

const StartButton = ({value, getOscillatorState}) => {

  const [state, setState] = useState(value)
  
  const handleOscillatorState = () => {
    getOscillatorState(!state)
    setState(!state)
  }

  return (
    <div 
      className='start-button'
      onClick={handleOscillatorState}
      style={{
          backgroundColor: state ? "bisque" : "#272727", 
          boxShadow: `0 0 2px 2px ${state ? "bisque" : ""}`
        }}
      > <div className='button-text'>
        {state ? "stop" : "start"}
      </div>
    </div>
  )
}

export default StartButton
