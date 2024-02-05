import React, { useEffect, useRef, useState } from 'react'
import "./transport.scss"
import { initialStates } from '../../../node-helpers/toneData'
import HorizontalSlider from '../parameters/horizontal-slider/horizontal-slider'



const Transport = ({id, name, type}) => {

  const [openProperties, setOpenProperties] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [isClockRunning, setIsClockRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [intervalId, setIntervalId] = useState(0)
  const [length, setLength] = useState(8)
  const [sliderValues, setSliderValues] = useState(Array(length).fill(0))
  const [sequenceKeys, setSeqeunceKeys] = useState(Array(length).fill("A3"))
  const [sequenceLength, setSeqeunceLengt] = useState(Array(length).fill(0))
  const [sequencePosition, setSeqeuncePosition] = useState(Array(length).fill(0))
  
  const handleBPMValue = (value) => {
    setBpm(value)
  }

  const handleClock = () => {
    if(!isClockRunning) {
      clearInterval(intervalId)
      const id = setInterval(() => setTime(p => p + 1), 60000 / bpm)
      setIntervalId(id)
      setIsClockRunning(true)
    } else {
      clearInterval(intervalId)
      setIntervalId(null)
      setTime(0)
      setIsClockRunning(false)
    }
  }

  useEffect(() => {
    console.log("tick")
  }, [time])

  useEffect(() => {
    if(intervalId) {
      clearInterval(intervalId)
      const id = setInterval(() => setTime(p => p + 1), 60000 / bpm)
      setIntervalId(id)
      
    }
  }, [bpm])


  const handleLength = (value) => {
    setLength(value)
  }

  return (
    <div className='transport-container'>
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
            <div className='transport-top'>
              <div 
                className='start-button'
                onClick={handleClock}
              >
              </div>
              <div className='start-button-text'>
                {isClockRunning ? "stop ": "start"}
              </div>
            </div>
            
            <div 
              className='transport-adjust'
              >
              <HorizontalSlider 
                id={id} 
                name={"bpm"} 
                type={type}
                parameterValue={bpm}
                param={initialStates["bpm"]}
                getParameter={(value) => handleBPMValue(value)}
                />
              <HorizontalSlider 
                id={id} 
                name={"length"} 
                type={type}
                parameterValue={length}
                param={initialStates["length"]}
                getParameter={(value) => handleLength(value)}
                />
            </div>
            <div className='transport-main'>
              
            </div>

          </div>
        ) : null }
       </>
    </div>
  )
}

export default Transport;