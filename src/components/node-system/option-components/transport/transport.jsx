import React, { useEffect, useRef, useState } from 'react'
import "./transport.scss"
import { Scale } from 'tonal'
import { colorScheme } from '../../node-helpers/helperFunctions'
import HorizontalSlider from '../parameters/horizontal-slider/horizontal-slider'
import { initialStates } from '../../node-helpers/toneData'
import { clamp } from 'three/src/math/MathUtils'
import StartButton from '../parameters/start-button/start-button'


const chroma = Scale.get("C chromatic").notes

// I do considering the adding 31 EDO Scale too!

const Transport = ({tone, trigger}) => {
  const [openProperties, setOpenProperties] = useState(true)
  const [isClockRunning, setIsClockRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [intervalId, setIntervalId] = useState(0)
  const [_bpm, setBpm] = useState(tone.parameters.bpm)
  const [_sequenceLengths, setSequenceLengths] = useState(tone.parameters.lengths)
  const [_length, setLength] = useState(_sequenceLengths.length)
  const [_sLength, setSLength] = useState(8)
  const [_sequencePositions, setSequencePositions] = useState(tone.parameters.positions)
  const [_sequenceProbabilities, setSequenceProbabilities] = useState(tone.parameters.probabilities)
  const [_sequenceDurations, setSequenceDurations] = useState(tone.parameters.durations)
  const [_sequenceStrides, setSequenceStrides] = useState(tone.parameters.strides)
  const [_keyScreen, setKeyScreen] = useState(Array(8).fill("C1"))
  const [_divDims, setDivDims] = useState(Array(8).fill({x: 0, y: 0}))
  const [isDragging, setIsDragging] = useState(false)
  const [slct, setSlct] = useState({i: 0, j: 0})
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
          if (_sequenceStrides[referenceIndex] === 0) {
            const arr = [..._sequencePositions]
            const xpos = Math.floor((event.clientX - initials.x) / 30)
            arr[referenceIndex] += clamp(xpos, -_sequencePositions[referenceIndex], 8-_sequenceLengths[referenceIndex].length - _sequencePositions[referenceIndex])
            setSequencePositions(arr)
          }
        } else {
          const y = clamp(_divDims[referenceIndex].y + Math.floor((event.clientY - initials.y)), 0, 100)
          const x = clamp(_divDims[referenceIndex].x + Math.floor((event.clientX - initials.x) / 5), 0, 100)
          const octaves = Math.floor(x / (100 / 8))
          const key = chroma[Math.floor(y /9 )]
          
          const dimsArr = [..._divDims]
          dimsArr[referenceIndex] = {x: x, y: y}
          setDivDims(dimsArr)
          
          const arr = [..._keyScreen]
          arr[referenceIndex] = key+octaves
          setKeyScreen(arr)
        }
      }, 20)
    }

  }
  const handleMouseUp = () => {
    setIsDragging(false)
  }


  const handleValues = (value, type) => {
    if (type === "lengths") {
      setLength(value)
    } 
    if (type == "bpm") {
      setBpm(value)
    } 
    if (type === "probabilities") {
      const arr = [..._sequenceProbabilities]; 
      arr[slct.i] = [...arr[slct.i]]; 
      arr[slct.i][slct.j] = value; 
      setSequenceProbabilities(arr);
    }
    if (type === "duratoinss") {
      const arr = [..._sequenceDurations]; 
      arr[slct.i] = [...arr[slct.i]]; 
      arr[slct.i][slct.j] = value;
      setSequenceDurations(arr);
    }

    if (type === "sequenceLength") {
      setSLength(value)
    }

  }

  const handleStrides = (value, name, index) => {
    const arr = [..._sequenceStrides]
    arr[index] = value
    setSequenceStrides(arr)
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
    setSequenceProbabilities(pArr)
    setSequenceDurations(dArr)
  }

  // useEffect(() => {console.log(_sequenceProbabilities)}, [_sequenceProbabilities])

  const getTriggerReadyData = () => {
    
    const posArr = _sequencePositions.map((item, index) => {
      if (_sequenceStrides[index] !== 0) {
        if (time % _sequenceStrides[index] === 0)
          
          return (item + 1) % ((_sLength + 1) - _sequenceLengths[index].length)
          
        } 
      return item
    })
    
    const n = time % _length
    const start = posArr[n]
    const end = start + _sequenceLengths[n].length
    const keysArr = _keyScreen.slice(start, end)
    const durArr = _sequenceDurations[n]
    const probArr = _sequenceProbabilities[n]
    trigger(keysArr, durArr, probArr, tone.id, _bpm)
    setSequencePositions(posArr)
  }
  
  useEffect(() => {
    getTriggerReadyData()
    

  }, [time])

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
  }, [isDragging]); 

  

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
                <StartButton 
                  value={isClockRunning}
                  getOscillatorState={(value) => handleClock(value)}
                /> 
                <div className='strides'>
                  {_sequenceStrides.slice(0, _length).map((item, index) => (
                    <div
                      className='stride'
                      key={"strides"+index+item}
                      style={{
                        height: `${77.7/_length}%`
                      }}
                    >
                      <HorizontalSlider 
                        name={"stride"}
                        abbreviate={true}
                        state={initialStates["stride"]}
                        parameterValue={item}
                        whichOscillator={index}
                        getParameter={(value, name, index) => handleStrides(value, name, index)}
                        isParamCentered={true}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className='sequencer-quantizer'>                
                <div className='key-screen'>
                  {_keyScreen.map((key, index) => (
                    <div 
                      key={"arrays"+index+key}
                      className='key'
                      style={{borderRight: index === _sLength-1 ? "3px solid #777777": "1px solid #777777"}}
                      
                      >
                      {key}
                    </div>
                    
                  ))

                  }
                </div>
                <div className='sequence'>
                  <div className='adjustables'> 
                    {_divDims.map((item, index) => (
                      <div 
                        className='sequence-cells'
                        key={item+index+"sequence-cells"}
                        ref={(ref) => noteRefs.current[index] = ref}
                        onMouseDown={(event) => handleMouseDown(event, index, "not")}
                        style={{
                          
                          width: `${100 / 8}%`, height: `${100}%`,
                          border: `1px solid ${colorScheme["Core"]}42`, 
                          borderRight: index === _sLength-1 ? `2px solid ${colorScheme["Core"]}` : "", 
                          cursor: "pointer",
                          borderCollapse: "collapse",
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}
                        >   
                        <div className='key-pickers'
                          style={{
                            height: `${item.y}%`, width: `${item.x}%`, backgroundColor: "#777777", maxHeight: "100%",
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
                        key={`${slct.i}-${slct.j}`} 
                        name={"probabilities"}
                        state={initialStates["probabilities"]}
                        isParamCentered={true}
                        abbreviate={true}
                        parameterValue={_sequenceProbabilities[slct.i][slct.j]}
                        parentOscillator={"bpm"}
                        getParameter={(value, type) => handleValues(value, type)}
                      />
                      <HorizontalSlider
                        key={`d${slct.i}-${slct.j}`} 
                        name={"durations"}
                        state={initialStates["durations"]}
                        parameterValue={_sequenceDurations[slct.i][slct.j]}
                        parentOscillator={"durations"}
                        abbreviate={true}
                        isParamCentered={true}
                        getParameter={(value, type) => handleValues(value, type)}
                      />
                      <HorizontalSlider 
                        name={"lengths"}
                        state={initialStates["lengths"]}
                        abbreviate={true}
                        parameterValue={_length}
                        parentOscillator={"length"}
                        isParamCentered={true}
                        getParameter={(value, type) => handleValues(value, type)}
                      />
                      <HorizontalSlider 
                        name={"sequenceLength"}
                        state={initialStates["lengths"]}
                        parameterValue={_length}
                        abbreviate={true}
                        parentOscillator={"sequenceLength"}
                        isParamCentered={true}
                        getParameter={(value, type) => handleValues(value, type)}
                      />
                    </div>
                </div>
                  
                    {_sequenceLengths.slice(0, _length).map((lengths, index) => (
                      <React.Fragment key={index + "ls" +"bar"}>
                        {lengths.map((note, idx) => (
                          <div 
                            className='note'
                            key={"l"+index+idx}
                            onWheel={(event) => handleLengths(event, index)}
                            onMouseDown={(events) => handleMouseDown(events, index,"note")}
                            onClick={(event) => handleClick(event, index, idx)}
                            style={{
                              width: `${100 / 8}%`,
                              height: `${70/_length}%`,
                              top: `${10 + 70/_length * index}%`, 
                              left: `${(100/8)*_sequencePositions[index]+idx*(100/8)}%`,
                              border: index === slct.i && idx === slct.j ? "3px solid" : "1px solid",
                              color: index === slct.i && idx === slct.j ? `${colorScheme["Core"]}77` : "#777777aa",
                              backgroundColor: time % _length === index ? `${colorScheme["Core"]}42` : ""
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