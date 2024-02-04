import React, { useEffect, useState } from 'react'
import "./start-button.scss"

const StartButton = ({value, getOscillatorState}) => {

  const [state, setState] = useState(value)
  
  return (
    <div 
      className='start-button'
      onClick={() => getOscillatorState(!state)}
      >
    </div>
  )
}

export default StartButton
