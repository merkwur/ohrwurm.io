import React, { useEffect, useState } from 'react'
import "./component-analyser.scss"
import Input from '../component-helpers/input/input'
import Output from '../component-helpers/output/output'
import { colorScheme } from '../../node-helpers/helperFunctions'

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
    if (node.input.x && !node.input.y) {
      const xWaveform = tone.tone.x.getValue()
      const pointsArray = Array.from(xWaveform).map((value, index) => {
        const x = ((index / 127) * 150).toFixed(3)
        const y = (((1 - value) * 22.5) + 20 ).toFixed(3)
        return `${x}, ${y}`
      }).join(" ") || ""
      setPoints(pointsArray)
    }

    if (node.input.x && node.input.y) {
      if (lissajous) {
        const xWaveform = tone.tone.x.getValue()
        const yWaveform = tone.tone.y.getValue()
  
        const pointsArray = Array.from(xWaveform).map((value, index) => {
          const x = (20+(1 - value) * 55).toFixed(3)
          const y = ((1 - yWaveform[index]) * 40).toFixed(3)
          return `${x}, ${y}`
        }).join(" ") || ""  
        setPoints(pointsArray)

      } else {
        
        const yWaveform = tone.tone.y.getValue()
        const secondPointsArray = Array.from(yWaveform).map((value, index) => {
          const x = ((index / 127) * 150).toFixed(3)
          const y = (((1 - value) * 22.5) + 20 ).toFixed(3)
          return `${x}, ${y}`
        }).join(" ") || ""
        setSecondPoints(secondPointsArray)

        const xWaveform = tone.tone.x.getValue()
        const pointsArray = Array.from(xWaveform).map((value, index) => {
          const x = ((index / 127) * 150).toFixed(3)
          const y = (((1 - value) * 22.5) + 20 ).toFixed(3)
          return `${x}, ${y}`
        }).join(" ") || ""
        setPoints(pointsArray)
      }
    }

    if (!node.input.x && node.input.y) {
      const yWaveform = tone.tone.y.getValue()
      const pointsArray = Array.from(yWaveform).map((value, index) => {
        const x = ((index / 127) * 150).toFixed(3)
        const y = (((1 - value) * 22.5) + 20 ).toFixed(3)
        return `${x}, ${y}`
      }).join(" ") || ""
      setPoints(pointsArray)
    }
  }, [time])  


  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
      const id = setInterval(() => setTime(p => p + 1), 1000 / fps);
      setIntervalId(id);
    }
  }, [fps]);

  useEffect(() => {console.log(node, tone)}, [])

  const handleScopeType = () => {
    if (type === "waveform") {
      tone.tone.x.type === "fft"
      tone.tone.y.type === "fft"
      setType("fft") 
    } else {
      tone.tone.x.type === "waveform"
      tone.tone.y.type === "waveform"
      setType("waveform")
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
                  
                  height: "105px"
                }} 
        >
          <svg 
            className='scope-view'
            style={{borderBottom: `1px solid ${colorScheme[node.type]}` , position: 'absolute', top: 15}}
            
            width="150" 
            height="90" 
            viewBox='0 0 150 90'
            >
            <polyline 
              fill='none'
              stroke={`${colorScheme[node.type]}77`}
              strokeWidth={1}
              points={points}
            />
            {!lissajous ? (
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
                    width: "10px", height: "10px"
                  }}
            onClick={handleClock}
            > 
          </div>
          <div 
            className='lissajous'
            onClick={() => setLissajous(!lissajous)}
            style={{
              position: 'absolute', 
              bottom: 2.5, right: 25, 
              width: "15px", height: "15px",
              border: "1px solid", 
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
              bottom: 2.5, right: 25, 
              width: "15px", height: "15px",
              border: "1px solid", 
              fontSize: "7pt",
              display: "flex", justifyContent: 'center',
              fontWeight: "600"

            }}
            > 
            2x      
          </div>
        </div>

    </div>
  )
}

export default ComponentAnalyser