import React, { useEffect, useState } from 'react'
import SourceOptions from '../option-components/source-options/source-options'
import './master-options.scss'

const MasterOptions = ({tone}) => {
  const [isOscillatorRunning, setIsOscillatorRunning] = useState(true)

  const handleStartOscillator = (id) => {
    if (!isOscillatorRunning) {
      setIsOscillatorRunning(true)
      tone.tone.start()
    } else {
      setIsOscillatorRunning(false)
      tone.tone.stop()
    }
  }


  return (
    <div 
      className='master-options-wrapper'
    > 
      {tone.type === "Source" ? (
        <SourceOptions 
          id={tone.id}
          name={tone.name}
          type={tone.type}
          parameters={tone.parameters}
          startOscillator={(id) => handleStartOscillator(id)}
        />
      ) : null}
    </div>
  )
}

export default MasterOptions
