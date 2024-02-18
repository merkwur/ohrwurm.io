import React, { useEffect, useState } from 'react'
import "./component-analyser.scss"
import Input from '../component-helpers/input/input'
import Output from '../component-helpers/output/output'
import { colorScheme } from '../../node-helpers/helperFunctions'


const yOffset = 25
const scopeWidth = 150
const scopHeigth = 100
const quarterScopeHeigth = 25

const ComponentAnalyser = ({node, tone}) => {
  const inputs = node.input ? Object.keys(node.input) : null 

  const [isClockRunning, setIsClockRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [intervalId, setIntervalId] = useState(0)
  const [fps, setFps] = useState(60)
  const [points, setPoints] = useState("")
  const [secondPoints, setSecondPoints] = useState("")
  const [type, setType] = useState("waveform")
  const [isAnalyserRunning, setIsAnalyserRunning] = useState(false)
  const [lissajous, setLissajous] = useState(false)


  // some sort of ticker component is necessary to dealing with the rate of getting value 
  const handleClock = () => {
    if(!isClockRunning) {
      clearInterval(intervalId)
      const id = setInterval(() => setTime(p => p + 1), 1000 / fps)
      setIntervalId(id)
      setIsClockRunning(true)
      setIsAnalyserRunning(true)
    } else {
      clearInterval(intervalId)
      setIntervalId(null)
      setTime(0)
      setIsClockRunning(false)
      setIsAnalyserRunning(false)
    }
  }


  useEffect(() => {
    // check inputs 
    if (node.input.x && !node.input.y) {
      if (type === "fft") {
        // tone returns to Float32Array, values cannot be convertable to string 
        // we need to wrap it to Array again.
        const xWaveform = Array.from(tone.tone.x.getValue()).slice(1)
        // fft's first value will always have an infinite magnitude to skip checking each value .slice() is better
        const pointsArray = xWaveform.map((value, index) => {
          const x = ((index / 127) * scopeWidth).toFixed(3)
          // quick and dirty way to fit the graph into scope
          const y = (1 - (value * .5) + 10).toFixed(3)
            return `${x}, ${y}`
        }).join(" ") || ""
        setPoints(pointsArray)
      } else {
        const xWaveform = Array.from(tone.tone.x.getValue())
        const pointsArray = xWaveform.map((value, index) => {
          // normalizing the x value to fit the graph into the scope exactly
          const x = ((index / 127) * scopHeigth).toFixed(3)
          // since most periodic waves has range between [-1, 1] half of the scope will fit exactly but no room fot amplitude changes.
          const y = (((1 - (value)) * quarterScopeHeigth) + yOffset ).toFixed(3)
          return `${x}, ${y}`
        }).join(" ") || ""
      setPoints(pointsArray)
      }
    }

    if (node.input.x && node.input.y) {
      if (lissajous) {
        const xWaveform = tone.tone.x.getValue()
        const yWaveform = tone.tone.y.getValue()
  
        const pointsArray = Array.from(xWaveform).map((value, index) => {
          const x = (30+(1 - value) * 45).toFixed(3)
          const y = ((1.04 - yWaveform[index]) * 44).toFixed(3)
          return `${x}, ${y}`
        }).join(" ") || ""  
        setPoints(pointsArray)

      } else if (type === "fft") {
          const yWaveform = Array.from(tone.tone.y.getValue()).slice(1)
          const secondPointsArray = yWaveform.map((value, index) => {
            const x = ((index / 127) * scopeWidth).toFixed(3)
            const y = (1 - (value * .6) - 5).toFixed(3)
            return `${x}, ${y}`
          }).join(" ") || ""
          setSecondPoints(secondPointsArray)
  
          const xWaveform = Array.from(tone.tone.x.getValue()).slice(1)
          const pointsArray = xWaveform.map((value, index) => {
            const x = ((index / 127) * scopeWidth).toFixed(3)
            const y = (1 - (value * .6) - 5).toFixed(3)
            return `${x}, ${y}`
          }).join(" ") || ""
          setPoints(pointsArray)
        } else {
          const yWaveform = tone.tone.y.getValue()
          const secondPointsArray = Array.from(yWaveform).map((value, index) => {
            const x = ((index / 127) * scopeWidth).toFixed(3)
            const y = (((1 - value) * quarterScopeHeigth) + yOffset ).toFixed(3)
            return `${x}, ${y}`
          }).join(" ") || ""
          setSecondPoints(secondPointsArray)
  
          const xWaveform = tone.tone.x.getValue()
          const pointsArray = Array.from(xWaveform).map((value, index) => {
            const x = ((index / 127) * scopeWidth).toFixed(3)
            const y = (((1 - value) * quarterScopeHeigth) + yOffset ).toFixed(3)
            return `${x}, ${y}`
          }).join(" ") || ""
          setPoints(pointsArray)
        }
      
    }

    if (!node.input.x && node.input.y) {
      if (type === "fft") {
        const yWaveform = Array.from(tone.tone.y.getValue()).slice()
        const pointsArray = Array.from(yWaveform).map((value, index) => {
          const x = ((index / 127) * scopeWidth).toFixed(3)
          const y = (1 - (value * .6) - 5).toFixed(3)
          return `${x}, ${y}`
        }).join(" ") || ""
        setPoints(pointsArray)
      } else {
        const yWaveform = tone.tone.y.getValue()
        const pointsArray = Array.from(yWaveform).map((value, index) => {
          const x = ((index / 127) * scopeWidth).toFixed(3)
          const y = (((1 - value) * quarterScopeHeigth) + yOffset ).toFixed(3)
          return `${x}, ${y}`
        }).join(" ") || ""
        setPoints(pointsArray)
      }
    }
  
  }, [time])  

  
  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
      const id = setInterval(() => setTime(p => p + 1), 1000 / fps);
      setIntervalId(id);
    }
  }, [fps]);

  const handleLissajous = () => {
    if (!lissajous) {
      setLissajous(true)
      setType("waveform")
    }
  }
  

  const handleScopeType = () => {
    console.log(type)
    if (type === "waveform") {
      tone.tone.x.type = "fft"
      tone.tone.y.type = "fft"
      setType("fft")
      setLissajous(false) 
    } else {
      tone.tone.x.type = "waveform"
      tone.tone.y.type = "waveform"
      setType("waveform")
      setLissajous(false)
    }
  }

  return (
    <div 
      className='source-container'
      id={node.id}
      style={{
        height: `${node.size.y}px`,
        width :`${node.size.x}px`,
      }}
    >
      <>
        {inputs ? (
          <>
            {inputs.map((input, index) => (
              <React.Fragment key={node.id + index}>
                <Input 
                  id={node.id}
                  inputType={input} 
                  whichParent={ "Component" }
                  yPosition={node.size.y - index * 20 - 20}
                />
              </React.Fragment>
            ))}
         </>
        ) : null }
      </>
        {node.name !== "Analyser" ? (
          <Output 
            id={node.id}
            outputType={"node"} 
            whichParent={node.type}
            yPosition={node.size.y / 2 - 6}
          />
        ) : null}

        <div className='scope'
          style={{display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  position: 'relative',                  
                  height: "105px", 
                  cursor: "not-allowed", 
                  backgroundSize: "25px 25px",
                  backgroundImage: `linear-gradient(to right, ${colorScheme["natural"]}22 1px, transparent 1px),
                                    linear-gradient(to bottom, ${colorScheme["natural"]}22 1px, transparent 1px)`
                }} 
        >
          <svg 
            className='scope-view'
            style={{borderBottom: `1px solid ${colorScheme[node.type]}` , position: 'absolute', top: 5}}
            
            width="150" 
            height="100" 
            viewBox='0 0 150 100'
            >
            { isAnalyserRunning && node.input.x || node.input.y ? (
              <polyline 
                fill='none'
                stroke={`${colorScheme[node.type]}77`}
                strokeWidth={1}
                points={points}
              />
            ) : null}
            {!lissajous && node.input.x && node.input.y ? (
              <polyline 
                fill='none'
                stroke="#ff424277"
                strokeWidth={1}
                points={secondPoints}
              />
            ) : null}
          </svg>
        </div>
        <div 
          className='analyser-parameters'
          
          style={{    
            position: 'absolute', 
            bottom: 5, right: 0,      
          }}
          >
          <div 
            className='button'
            style={{
                    position: 'absolute', 
                    bottom: 5, right: 5, 
                    borderRadius: "50%",
                    backgroundColor: isAnalyserRunning ? "bisque" : "#272727", 
                    boxShadow: `0 0 2px 2px ${isAnalyserRunning ? "bisque" : ""}`,
                    width: "10px", height: "10px",
                    cursor: "pointer",
                  }}
            onClick={handleClock}
            > 
          </div>
          <div 
            className='lissajous'
            onClick={handleLissajous}
            style={{
              position: 'absolute', 
              bottom: 2.5, right: 25, 
              width: "15px", height: "15px",
              cursor: "pointer",
              fontSize: "7pt",
              display: "flex", justifyContent: 'center',
              fontWeight: "600"

            }}
            > 
            2x      
          </div>
          <div 
            className='waveform-fft-switch'
            onClick={handleScopeType}
            style={{
              position: 'absolute', 
              bottom: 3.4, right: type === "fft" ? 50 : 50, 
              cursor: "pointer",
              fontSize: "7pt",
              display: "flex", justifyContent: 'center',
              fontWeight: "600",
            }}
            > 
            {type === "fft" ? "fft" : "waveform" }      
          </div>
        </div>

    </div>
  )
}

export default ComponentAnalyser