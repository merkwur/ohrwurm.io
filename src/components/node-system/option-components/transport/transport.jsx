import React, { useEffect, useRef, useState } from 'react'
import "./transport.scss"
import { initialStates } from '../../node-helpers/toneData'
import HorizontalSlider from '../parameters/horizontal-slider/horizontal-slider'
import { Scale } from 'tonal'
import LengthAdjust from './transport-helpers/length-adjust'
import KeySelector from './transport-helpers/key-selector'
import OctavePicker from './transport-helpers/octave-picker'
import { colorScheme } from '../../node-helpers/helperFunctions'


/* The transport object is making my eyes too bleed when I trying to look in it!!
   This is not an efficient way to make this object. I am keeping it for the test cases.
   It will be refactored and more simplified also needs to move  => nodeCanvas => Underneath 
   the masterNode section in order to make more pleasant. it should be controlled on node
   parameters not from the node hub section !!! Also it will be divided many section
   main section is simle trigger. noise synth and amplitude and/or frequency envelope component
   there will be add-on on top of trigger which is simply quantizer. quantizer will be animated
   steps will be adjustable and can move with each time step. also there will be another add-ons
   one is durations which holds the normal range for each tick how long the note duration will 
   play. and there will be probabilities. these are currently exist but computationally absurd!
*/

const Transport = ({id, name, type, notesToTrigger, getGlobalTime}) => {

  const [openProperties, setOpenProperties] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [isClockRunning, setIsClockRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [intervalId, setIntervalId] = useState(0)
  const [length, setLength] = useState(8)
  const [sequenceKeys, setSeqeunceKeys] = useState(Array(length).fill("C"))
  const [sequenceLength, setSeqeunceLength] = useState(Array(length).fill(1))
  const [probabilities, setProbabilities] = useState(sequenceLength)
  const [sequenceOctaves, setSequenceOctaves] = useState(Array(length).fill(1))
  const [sequencePosition, setSeqeuncePosition] = useState([...Array(length).keys()])
  const [triggerReadyProbs, setTriggerReadyProbs] = useState(Array(length).fill(1))
  const [durations, setDurations] = useState({0: {0: 1}, 1: {0: 1}, 2: {0: 1},3: {0: 1},4: {0: 1},5: {0: 1},6: {0: 1},7: {0: 1}})
  const [triggerReady, setTriggerReady] = useState([])
  const [triggerReadyDur, setTriggerReadyDur] = useState([])
  const [showLength, setShowLength] = useState(true)
  const chroma = Scale.get("C chromatic").notes

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
    let arr = [...sequenceLength]
    if (length > arr.length) {
      for (let i = 0; i < 1 + length - arr.length; i++) {
        arr.push(1)
      }
    } else {
      arr = arr.slice(0, length)
    }


    setSeqeunceLength(arr)    
  }, [length])

  const handleSliderValue = (value, index) => {
    const arr = [...sequenceKeys]
    arr[index] = value 
    setSeqeunceKeys(arr)
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
    setSequenceOctaves(arr)
  }

  const handleProbabilities = (value, index) => {
    const arr = [...probabilities]
    arr[index] = value
    setProbabilities(arr)
  }

  useEffect(() => {
    const arr =  sequenceKeys.map((e, i) => e + sequenceOctaves[i].toString())
    const probs = []
    const dur = []
    const sequence = []
    for (let i = 0; i < length; i++) {
      let subseq = []
      let subdurseq = []
      let subprobseq = []
      for(let j = 0; j < sequenceLength[i]; j++){
        subseq.push(arr[sequencePosition[i]+j])
        subprobseq.push(probabilities[sequencePosition[i]+j])
        subdurseq.push(durations[i][j] ? durations[i][j] : 1)
      }
      sequence.push(subseq)
      probs.push(subprobseq)
      dur.push(subdurseq)
    }

    setTriggerReady(sequence)
    setTriggerReadyProbs(probs)
    setTriggerReadyDur(dur)
  }, [length, sequenceLength, sequencePosition, sequenceOctaves, sequenceKeys, probabilities, durations])

  useEffect(() => {
    
    notesToTrigger( triggerReady[time%length], 
                    triggerReadyProbs[time%length], 
                    triggerReadyDur[time%length], bpm)

  }, [bpm, time, triggerReady, sequencePosition, durations, triggerReadyProbs])


  const handleDurations = (value, row, col) => { 
    const updatedDurations = { ...durations };
    updatedDurations[row] = { ...updatedDurations[row] };
    updatedDurations[row][col] = value;

    setDurations(updatedDurations);
  };


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
               style={{borderRight: `1px solid ${colorScheme["Core"]}`}}
            >
            <div className='parameter-params'>
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
                  state={initialStates["bpm"]}
                  getParameter={(value) => handleBPMValue(value)}
                  />
                <HorizontalSlider 
                  id={id} 
                  name={"length"} 
                  type={type}
                  parameterValue={length}
                  state={initialStates["length"]}
                  getParameter={(value) => handleLength(value)}
                  />
                <div 
                  className='show-length'
                  onClick={() => setShowLength(!showLength)}
                  >
                 {showLength ? "♪" : "𝄆"} 
                </div>
              </div>
              <div className='transport-main'>
                <div className='key-slider'>
                  {sequenceKeys.map((value, index) => (
                    <div 
                      key={index+"keys"}
                      className='key-slider-wrapper'
                    >
                      <KeySelector 
                        currentKey={value}
                        chromaKeys={chroma}
                        getParameter={(val) => handleSliderValue(val, index)}
                        onLine={index}
                        />
                    </div>
                  ))}
                </div>
                {showLength ? (
                  <>
                    {sequenceLength.map((value, index) => (
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
                      <React.Fragment key={index+value+"as"}> 
                        <OctavePicker 
                          currentKey={sequenceKeys[index]}
                          currentValue={sequenceOctaves[index]}
                          getParameter={(octave) => handleOctaves(octave, index)}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                  <div className='probabilities'>
                    {probabilities.map((value, index) => (
                      <div 
                        className='ps'
                        key={index+"probs"}
                        >
                          <HorizontalSlider
                            id={id} 
                            name={"p"} 
                            type={type}
                            reduced={true}
                            parameterValue={probabilities[index]}
                            state={initialStates["p"]}
                            getParameter={(value) => handleProbabilities(value, index)}
                            isParamCentered={true}
                          />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className='durations'>
              <div className='duration-space'>
                
              </div>
              <div className='duration-header'>
                durations
              </div>
              <div className='duration-params'> 
                {triggerReady.map((notes, index) => (
                  <div 
                    key={index+"note"}
                    className='notes'
                    style={{
                      width: `${100}%`,
                      height: `${(100 / length) }%`,
                      top: `${index * (100/length)}%`,
                      left: `%${0}`
                    }}
                    >
                    {notes.map((n, i) => (
                      <div 
                        className='ts'
                        key={i+"ts"+n}
                        style={{
                          width: `${100 / notes.length}$`
                        }}
                        >
                        <HorizontalSlider
                          id={id} 
                          name={"d"} 
                          type={type}
                          reduced={true}
                          parameterValue={durations[index][i] ? durations[index][i] : 1}
                          state={initialStates["d"]}
                          getParameter={(value) => handleDurations(value, index, i)}
                          isParamCentered={true}
                        />
                      </div>
                    ))}
                  </div>
                ))}

              </div>

            </div>
          </div>
        ) : null }
       </>
    </div>
  )
}

export default Transport;