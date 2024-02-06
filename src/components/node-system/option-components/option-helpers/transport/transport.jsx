import React, { useEffect, useRef, useState } from 'react'
import "./transport.scss"
import { initialStates } from '../../../node-helpers/toneData'
import HorizontalSlider from '../parameters/horizontal-slider/horizontal-slider'
import KeySlider from './transport-helpers/key-slider'
import { Scale } from 'tonal'
import LengthAdjust from './transport-helpers/length-adjust'



const Transport = ({id, name, type, notesToTrigger, getGlobalTime}) => {

  const [openProperties, setOpenProperties] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [isClockRunning, setIsClockRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [intervalId, setIntervalId] = useState(0)
  const [length, setLength] = useState(8)
  const [sliderValues, setSliderValues] = useState(Array(length).fill(0))
  const [sequenceKeys, setSeqeunceKeys] = useState(Array(length).fill("C"))
  const [sequenceLength, setSeqeunceLength] = useState(Array(length).fill(1))
  const [sequenceL, setSequenceL] = useState(sequenceLength)
  const [sequenceOctaves, setSequenceOctaves] = useState(Array(length).fill(1))
  const [sequencePosition, setSeqeuncePosition] = useState([...Array(length).keys()])
  const chroma = Scale.get("C chromatic").notes
  const [triggerReady, setTriggerReady] = useState([])
  const [showLength, setShowLength] = useState(false)
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
    if(intervalId) {
      clearInterval(intervalId)
      const id = setInterval(() => setTime(p => p + 1), 60000 / bpm)
      setIntervalId(id)
      
    }
  }, [bpm])


  const handleLength = (value) => {
    setLength(value)
  }

  useEffect(() => {getGlobalTime(time)}, [time])

  useEffect(() => {
    setSequenceL(sequenceLength.slice(0, length))
  }, [length])

  const handleSliderValue = (value, index) => {
    const arr = [...sliderValues]
    arr[index] = value 
    const seqArr = [...sequenceKeys]
    seqArr[index] = chroma[Math.floor(value/chroma.length)]
    setSliderValues(arr)
    setSeqeunceKeys(seqArr)
  }

  const handleSequenceLength = (value, index) => {
    const arr = [...sequenceLength]
    arr[index] = value
    setSeqeunceLength(arr)
  }

  const handleSequencePos = (value, index) => {
    const arr = [...sequencePosition]
    arr[index] = value
    setSeqeuncePosition(arr)
  }

  const handleOctaves = (value, index) => {
    const arr = [...sequenceOctaves]
    arr[index] = value
    console.log("octaves; ", value)
    setSequenceOctaves(arr)
  }


  useEffect(() => {
    const arr =  sequenceKeys.map((e, i) => e + sequenceOctaves[i].toString())
    
    const sequence = []
    for (let i = 0; i < length; i++) {
      let subseq = []
      for(let j = 0; j < sequenceLength[i]; j++){
        subseq.push(arr[sequencePosition[i]+j])
      }
      sequence.push(subseq)
    }
    setTriggerReady(sequence)

  }, [length, sequenceLength, sequencePosition, sequenceOctaves, sequenceKeys])

  useEffect(() => {
    notesToTrigger(triggerReady[time%triggerReady.length], bpm)

  }, [bpm, time, triggerReady, sequencePosition])

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
              <div 
                className='show-length'
                onClick={() => setShowLength(!showLength)}
                >
                show length
              </div>
            </div>
            <div className='transport-main'>
              <div className='key-slider'>
                {sliderValues.map((value, index) => (
                  <div 
                    key={index+"keys"}
                    className='key-slider-wrapper'
                  >
                    <KeySlider 
                      currentHeightValue={value}
                      currentWidthValue={sequenceOctaves[index]}
                      index={index}
                      getParameter={(val) => handleSliderValue(val, index)}
                      getWidthParameter={(val) => handleOctaves(val, index)}
                      />
                  </div>
                ))}
              </div>
              {showLength ? (
                <>
                  {sequenceL.map((value, index) => (
                    <React.Fragment key={index+"length"}>
                      <LengthAdjust
                        seqLength={value} 
                        leftPosition={sequencePosition[index]} 
                        index={index}
                        getSequenceLengthValue={(value) => handleSequenceLength(value, index)}
                        getSequencePosValue={(value) => handleSequencePos(value, index)}
                        length={length}
                        />
                    </React.Fragment>
                  ))}
                </>
                
              ) : null}
              <div className='transport-bottom'>
                <div className='keys-screen'>
                  {sequenceKeys.map((value, index) => (
                    <div 
                      className='chroma-keys'
                      key={index+"chroma"}
                      >
                      {value+sequenceOctaves[index]}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : null }
       </>
    </div>
  )
}

export default Transport;