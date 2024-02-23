import React, { useEffect, useRef, useState } from 'react'
import "./transport.scss"
import { Scale } from 'tonal'
import { colorScheme } from '../../node-helpers/helperFunctions'
import HorizontalSlider from '../parameters/horizontal-slider/horizontal-slider'
import { initialStates } from '../../node-helpers/toneData'
import { events } from '@react-three/fiber'
import { clamp } from 'three/src/math/MathUtils'


const chroma = Scale.get("C chromatic").notes

const Transport = ({tone}) => {
  const [openProperties, setOpenProperties] = useState(true)
  const [isClockRunning, setIsClockRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [intervalId, setIntervalId] = useState(0)
  const [_parameters, setParameters] = useState(tone.parameters)
  const [_bpm, setBpm] = useState(_parameters.bpm)
  const [_sequenceLengths, setSequenceLengths] = useState(_parameters.lengths)
  const [_length, setLength] = useState(_sequenceLengths.length)
  const [_sequencePositions, setSequencePositions] = useState(_parameters.positions)
  const [_sequenceProbabilities, setSequenceProbabilities] = useState(_parameters.probabilities)
  const [_sequenceDurations, setSequenceDurations] = useState(_parameters.durations)
  const [_sequenceStrides, setSequenceStrides] = useState(_parameters.strides)
  const [_sequenceKeys, setSequenceKeys] = useState(_parameters.keys)
  const [_keyScreen, setKeyScreen] = useState(Array(8).fill("C1"))
  const [isDragging, setIsDragging] = useState(false)
  const [slct, setSlct] = useState({i: 0, j: 0})
  const [note2Seq, setNote2Seq] = useState(true)
  const [initials, setInitials] = useState({x: 0, y: 0})
  const [whichElement, setWhichElement] = useState("")
  const [referenceIndex, setReferenceIndex] = useState(null)
  const noteRefs = useRef([])

  const handleClock = () => {
    if(!isClockRunning) {
      clearInterval(intervalId)
      const id = setInterval(() => setTime(p => p + 1), 60000 / _bpm)
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
      const id = setInterval(() => setTime(p => p + 1), 60000 / _bpm)
      setIntervalId(id)
    }
  }, [_bpm])


  const handleLength = (value) => {
    setLength(value)
  }

  useEffect(() => {console.log(time)}, [time])

  const handleClick = (event, i, j) => {
    setSlct({i: i, j: j})
  }

  

  const handleMouseDown = (event, index, which) =>{
    setIsDragging(true)
    setWhichElement(which)
    setInitials({
      x: event.clientX, 
      y: event.clientY
    })
    setReferenceIndex(index)    
  }

  const handleMouseMove = (event) => {
    if (isDragging) {
      const handler = setTimeout(() => {
      if (whichElement === "note") {
        const arr = [..._sequencePositions]
        const xpos = Math.floor((event.clientX - initials.x) / 30)
        arr[referenceIndex] += clamp(xpos, -_sequencePositions[referenceIndex], 8-_sequenceLengths[referenceIndex].length - _sequencePositions[referenceIndex])
        setSequencePositions(arr)
      } else {
        console.log("hjasd")
          const y = clamp(Math.floor((event.clientY - initials.y)), 0, 100)
          const x = clamp(Math.floor((event.clientX - initials.x) / 5), 0, 100)
          const octaves = Math.floor(x / (100 / 8))
          console.log(y, x)
          const key = chroma[Math.floor(y /9 )]
          console.log(key,octaves)
          noteRefs.current[referenceIndex].children[0].style.width  = `${x}%`
          noteRefs.current[referenceIndex].children[0].style.height = `${y}%`
          
          const arr = [..._keyScreen]
          arr[referenceIndex] = key+octaves
          setKeyScreen(arr)
        }
      }, 5)
    }

  }
  const handleMouseUp = () => {
    setIsDragging(false)
  }


  const handleValues = (value, type) => {
    console.log(value, type)
  }


  const handleLengths = (event, index) => {
    
    const lengthArr = [..._sequenceLengths]
    const pArr = [..._sequenceProbabilities]
    const dArr = [..._sequenceDurations]
    if (event.deltaY > 0 && lengthArr[index].length < 8 - _sequencePositions[index]) {
      const newArr = [...lengthArr[index], 1]
      const newPArr = [...pArr[index], 1]
      const newDArr = [...dArr[index], 1]
      pArr[index] = newPArr
      dArr[index] = newDArr
      lengthArr[index] = newArr

    } else if (event.deltaY < 0 && lengthArr[index].length > 1) {
      const newArr = lengthArr[index].slice(0, lengthArr[index].length -1)
      const newPArr = pArr[index].slice(0, pArr[index].length -1)
      const newDArr = dArr[index].slice(0, dArr[index].length -1)
      lengthArr[index] = newArr
      pArr[index] = newPArr
      dArr[index] = newDArr
    }
    setSequenceLengths(lengthArr)
    
  }

  useEffect(() => {console.log(slct)}, [slct])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      // Cleanup function to ensure no dangling listeners from this effect
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]); // This effect toggles based on isDragging state

  

  return (
    <div className='transport-container'>
      <div 
        className='left-stander'
        onClick={() => setOpenProperties(!openProperties)}
        >
        <div className='header'>
          {"Transport"}
        </div>
      </div>
      <>
        { openProperties ? (
          <div className='parameters'
               style={{borderRight: `1px solid ${colorScheme["Core"]}`}}
            >
              <div 
                className='transport-configuration'
                > 
              </div>
              <div className='sequencer-quantizer'>                
                <div className='key-screen'>
                  {_keyScreen.map((key, index) => (
                    <div 
                      key={"arrays"+index+key}
                      className='key'
                      >

                      {key}
                    </div>
                    
                  ))

                  }
                </div>
                <div className='sequence'>
                  <div className='adjustables'> 
                    {_keyScreen.map((item, index) => (
                      <div 
                        className='sequence-cells'
                        key={item+index+"sequence-cells"}
                        ref={(ref) => noteRefs.current[index] = ref}
                        onMouseDown={(event) => handleMouseDown(event, index, "not")}
                        style={{
                          
                          width: `${12.5}%`, height: `${100}%`,
                          border: `1px solid ${colorScheme["Core"]}42`, 
                          
                          cursor: "pointer",
                          borderCollapse: "collapse",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                        >   
                        <div className='key-pickers'
                          style={{
                            height: 0, width: 0, backgroundColor: "#777777", maxHeight: "100%",
                            transformOrigin: "center" 
                          }}
                        >
                        </div>
                      </div>
                    ))}
                  </div>
                    <div 
                      className='sliders'  
                    >
                      <HorizontalSlider 
                        name={"bpm"}
                        state={initialStates["bpm"]}
                        parameterValue={_bpm}
                        parentOscillator={"bpm"}
                        getParameter={(value, type) => handleValues(value, type)}
                      />
                      <HorizontalSlider 
                        name={"probs"}
                        state={initialStates["probabilities"]}
                        parameterValue={_sequenceProbabilities[slct.i][slct.j]}
                        parentOscillator={"bpm"}
                        getParameter={(value, type) => handleValues(value, type)}
                      />
                      <HorizontalSlider 
                        name={"durs"}
                        state={initialStates["durations"]}
                        parameterValue={_sequenceDurations[slct.i][slct.j]}
                        parentOscillator={"durations"}
                        getParameter={(value, type) => handleValues(value, type)}
                      />
                      <HorizontalSlider 
                        name={"length"}
                        state={initialStates["probabilities"]}
                        parameterValue={_sequenceProbabilities[slct.i][slct.j]}
                        parentOscillator={"length"}
                        getParameter={(value, type) => handleValues(value, type)}
                      />
                    </div>
                </div>
                  
                    {_sequenceLengths.map((lengths, index) => (
                      <React.Fragment key={index + "ls" +"bar"}>
                        {lengths.map((note, idx) => (
                          <div 
                            className='note'
                            key={"l"+index+idx}
                            onWheel={(event) => handleLengths(event, index)}
                            onMouseDown={(events) => handleMouseDown(events, index,"note")}
                            onClick={(event) => handleClick(event, index, idx)}
                            style={{
                              height: `${60/_length}%`,
                              top: `${10 + 60/_length * index}%`, 
                              left: `${12.5*_sequencePositions[index]+idx*12.5}%`,
                              border: index === slct.i && idx === slct.j ? "3px solid" : "1px solid",
                              color: index === slct.i && idx === slct.j ? `${colorScheme["Core"]}77` : "#777777aa"
                            }}
                          >

                          </div>
                        ))} 
                      </React.Fragment>
                    ))}
              </div>
          </div>
        ) : null }
       </>
    </div>
  )
}

export default Transport;