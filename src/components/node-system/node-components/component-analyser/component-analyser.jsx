import React, { useEffect, useRef, useState } from 'react'
import "./component-analyser.scss"
import Input from '../component-helpers/input/input'
import Output from '../component-helpers/output/output'
import { colorScheme } from '../../node-helpers/helperFunctions'
import { linspace } from '../../option-components/waveshaper-options/waveshapingFunctions'


const yOffset = 25
const scopeWidth = 150
const scopeHeigth = 100
const quarterScopeHeigth = 25
const xValues = linspace(0, scopeWidth, 128)

const ComponentAnalyser = ({node, tone}) => {
  const inputs = node.input ? Object.keys(node.input) : null 

  const [isClockRunning, setIsClockRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [intervalId, setIntervalId] = useState(0)
  const [fps, setFps] = useState(45)
  const [points, setPoints] = useState("")
  const [secondPoints, setSecondPoints] = useState("")
  const [type, setType] = useState("waveform")
  const [isAnalyserRunning, setIsAnalyserRunning] = useState(false)
  const [lissajous, setLissajous] = useState(false)
  const canvasRef = useRef(null)
  const ctxRef = useRef(null)
  const [length, setLength] = useState(xValues.length)
  
  


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
    if (!canvasRef.current) return;
  
    const canvas = canvasRef.current;
    canvas.width = scopeWidth; 
    canvas.height = scopeHeigth; 
  
    ctxRef.current = canvas.getContext('2d'); // Initialize and store the context
  }, [])

  const calcWaveForm = (x) => {
    return (1 - x * .5) * 50
  }

  const calcFFT = (x) => {
    return (1 - x * .57) 
  }

  const calcLissajousx = (x) => {
    return 75 + (x * 40)
  }

  const calcLissajousy = (y) => {
    return 50 + (y * 40)
  }

  useEffect(() => {
    
    if (!ctxRef.current) return 
    const ctx = ctxRef.current
    ctx.strokeStyle = colorScheme["Component"]
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)   
    ctx.beginPath()
    
    
    if (node.input.x && !node.input.y) {
      let waveformValueX = tone.tone.x.getValue()
      if (type === "fft") ctx.moveTo(xValues[1], (1 - calcFFT(waveformValueX[1])))
      else ctx.moveTo(0, calcWaveForm(waveformValueX[0]))
      
    
      if (type === "fft") {
        for (let i = 2; i < length; i++) {
          ctx.lineTo(xValues[i], calcFFT(waveformValueX[i]))
        }
      } else {
        for (let i = 1; i < length; i++) {
          ctx.lineTo(xValues[i], calcWaveForm(waveformValueX[i]))
        }
      } 
      ctx.stroke()

    } else if (!node.input.x && node.input.y) {
        let waveformValueY = tone.tone.y.getValue()
        if (type === "fft") ctx.moveTo(0, calcFFT(waveformValueY[1]))
        else ctx.moveTo(0, calcWaveForm(waveformValueY[0]))
        

        if (type === "fft") {
          for (let i = 1; i < length; i++) {
            ctx.lineTo(xValues[i], calcFFT[i])
          }
        } else {
          for (let i = 1; i < length; i++) {
            ctx.lineTo(xValues[i], calcWaveForm[i])
          }
        }
        ctx.stroke()

      } else if (node.input.x && node.input.y) {
        let waveformValueY = tone.tone.y.getValue()
        let waveformValueX = tone.tone.x.getValue()
        ctx.beginPath()
        if (lissajous) {
          ctx.moveTo(calcLissajousx(waveformValueX[0]), calcLissajousy(waveformValueY[0]))
          for (let i = 1; i < length; i++) {
            ctx.lineTo(calcLissajousx(waveformValueX[i]), calcLissajousy(waveformValueY[i]))
          }
        ctx.stroke()
        } else if (!lissajous && type === "fft") {

          ctx.beginPath()
          ctx.strokeStyle = colorScheme["Component"]
          ctx.moveTo(0, calcFFT(waveformValueX[1]))
          for (let i = 2; i < length; i++) {
            ctx.lineTo(xValues[i], calcFFT(waveformValueX[i]))
          }
          ctx.stroke()
          
          ctx.beginPath()
          ctx.strokeStyle = colorScheme["Instrument"]
          ctx.moveTo(0, calcFFT(waveformValueY[1]))
          for (let i = 2; i < length; i++) {
            ctx.lineTo(xValues[i], calcFFT(waveformValueY[i]))
          }
          ctx.stroke()
        } else if (!lissajous && type === "waveform") {
          ctx.beginPath()
          ctx.strokeStyle = colorScheme["Component"]
          ctx.moveTo(0, calcWaveForm(waveformValueX[0]))

          for (let i = 1; i < length; i++) {
            ctx.lineTo(xValues[i], calcWaveForm(waveformValueX[i]))
          }
          ctx.stroke()

          ctx.beginPath()
          ctx.strokeStyle = colorScheme["Instrument"]
          ctx.moveTo(0, calcWaveForm(waveformValueY[0]))
          for (let i = 0; i < length; i++){
            ctx.lineTo(xValues[i], calcWaveForm(waveformValueY[i]))
          }
          ctx.stroke()
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
        
        </div>
        <div 
          className='analyser-parameters'
          
          style={{    
            position: 'absolute', 
            top: 0, right: 0,
            borderBottom: `1px solid ${colorScheme["Component"]}`      
          }}
          >
          <canvas 
            id="waveformCanvas" 
            ref={canvasRef}
            
            >
          </canvas>

          </div>
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
  )
}

export default ComponentAnalyser