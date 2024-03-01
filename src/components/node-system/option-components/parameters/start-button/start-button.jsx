import React, { useEffect, useState } from 'react'
import "./start-button.scss"

const StartButton = ({value, getOscillatorState, lightColor}) => {
  const color = lightColor ? lightColor : "bisque"
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
          backgroundColor: state ? `${color}` : "#272727", 
          boxShadow: `0 0 2px 2px ${state ? "bisque" : ""}`
        }}
      > 
    </div>
  )
}

export default StartButton
