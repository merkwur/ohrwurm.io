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
  const [type, setType] = useState("waveform")

  const handleClock = () => {
    if(!isClockRunning) {
      clearInterval(intervalId)
      
      const id = setInterval(() => setTime(p => p + 1), 1000 / fps)
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
    let s = ""
    if (node.input.x && !node.input.y) {
      if (type === "waveform") {
        const xWaveform = tone.tone.x.getValue()
        xWaveform.forEach((value, index) => {
          const x = ((index / 127) * 150).toFixed(3)
          const y = (((1 - value) * 22.5) + 20 ).toFixed(3)
          s += `${x}, ${y} `
        })  
        setPoints(s)
      } else {
        const xWaveform = tone.tone.x.getValue()
        
        xWaveform.forEach((value, index) => {
          const x = ((index / 127) * 150).toFixed(3)
          const y = (1 - value).toFixed(3)
          if (y < Infinity){
            s += `${x}, ${y} `
          }
        })  
        setPoints(s)
      }
    }
    if (node.input.x && node.input.y) {
      const xWaveform = tone.tone.x.getValue()
      const yWaveform = tone.tone.y.getValue()

      xWaveform.forEach((value, index) => {
        const x = (20+(1 - value) * 55).toFixed(3)
        const y = ((1 - yWaveform[index]) * 40).toFixed(3)
        s += `${x}, ${y} `
      })  
      setPoints(s)
    }
    if (!node.input.x && node.input.y) {
      const yWaveform = tone.tone.y.getValue()
      yWaveform.forEach((value, index) => {
        const x = ((index / 127) * 150).toFixed(3)
        const y = (((1 - value) * 22.5) + 20 ).toFixed(3)
        s += `${x}, ${y} `
      })  
      setPoints(s)
    }
  }, [time])  

  const handleScopeType = () => {
    if (node.input.x && !node.input.y) {
      console.log("we are here", type)
      if (type === "waveform") {
        console.log("change type")
        tone.tone.x.type = "fft"
        setType("fft")
      } else {
        tone.tone.x.type = "waveform"
        setType("waveform")
      }
    }
  }

  useEffect(() => {
    if (intervalId) {
      clearInterval(intervalId);
      const id = setInterval(() => setTime(p => p + 1), 1000 / fps);
      setIntervalId(id);
    }
  }, [fps]);

  useEffect(() => {console.log(node, tone)}, [])

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
              stroke={`${colorScheme[node.type]}`}
              strokeWidth={1}
              points={points}
            />
          </svg>
        </div>
        <div 
          className='button'
          style={{border: "1px solid", position: 'absolute', bottom: 0, right: 0}}
          onClick={handleClock}
          >
            start
        </div>
        <div 
          className='analyser-parameters'
          onClick={handleScopeType}
          style={{border: "1px solid", position: 'absolute', bottom: 20, right: 0}}
          >
           change
        </div>

    </div>
  )
}

export default ComponentAnalyser