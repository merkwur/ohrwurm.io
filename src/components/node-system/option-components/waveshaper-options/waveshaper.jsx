import React, { useEffect, useRef, useState } from 'react'
import "./waveshaper.scss"
import { colorScheme } from '../../node-helpers/helperFunctions'
import {  curveTypes, linspace } from './waveshapingFunctions'

const curveNames = ["I", "tanh", "sigmoid", "relu", "leaky", "gelu", "fold", "elu", "modulated", "circular"]

const scopeWidth = 140
const scopeHeigth = 100
const xValues = linspace(-Math.PI, Math.PI, 32)


const Waveshaper = ({toneObj}) => {
  const [openProperties, setOpenProperties] = useState(true)
  const [curve, setCurve] = useState(new Float32Array(32))
  const [curves, setCurves] = useState([])
  
  const [blob, setBlob] = useState({x: 70, y: 70})
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [selected, setSelected] = useState([])
  const radius = 50
  const shaperCanvasRef = useRef(null)
  const shaperCtx = useRef(null)


  useEffect(() => {
    if (!shaperCanvasRef.current) return;
    const canvas = shaperCanvasRef.current;
    canvas.width = scopeWidth; 
    canvas.height = scopeHeigth; 
    shaperCtx.current = canvas.getContext('2d'); // Initialize and store the context
  }, [])

  useEffect(() => {
    if (openProperties) {
      if (!shaperCanvasRef.current) return;
      const canvas = shaperCanvasRef.current;
      canvas.width = scopeWidth; 
      canvas.height = scopeHeigth; 
      shaperCtx.current = canvas.getContext('2d'); // Initialize and store the context
      getDistance()
    }  
  }, [openProperties])

  useEffect(() => {
    const t = (360 / curveNames.length) * (Math.PI / 180) 
    const arr = []
    for (let i = 0; i < curveNames.length; i++) {
      const theta = i * t - (Math.PI /2)
      const o = {x: 70 + radius * Math.cos(theta), y: 70 + radius * Math.sin(theta), name: curveNames[i], id:i}
      arr.push(o)
    }
    setCurves(arr)  
  }, [])

  const calcCurvey = (x) => {
    return (1 - (x * scopeHeigth) * .30) + 50
  }

  const calcCurvex = (x) => {
    return 70 + (x * 25)
  }

  const curveInterpolation = (distance) => {
    let lerped
    if (!shaperCtx.current) return 
    const ctx = shaperCtx.current
    ctx.strokeStyle = colorScheme["Signal"]
    ctx.clearRect(0, 0, shaperCanvasRef.current.width, shaperCanvasRef.current.height)   
    ctx.beginPath()
    ctx.moveTo(0, calcCurvey(curve[0]))
    ctx.lineWidth = 3
    
    if (distance.length > 1) {
      let d = 0
      let y = 0
      distance.forEach(dist => {
        d += dist.distance
      })

      lerped = curve.map((value, index) => {
        y = 0
        distance.forEach(dist => {   
          y += curveTypes[dist.name][index] * (1 - (dist.distance / d)) 
        })
        ctx.lineTo(calcCurvex(xValues[index]), calcCurvey(y))
        return y  
      })
      toneObj.tone.curve = lerped    
      setCurve(lerped)
      ctx.stroke()
    } else if (distance.length === 1){
      ctx.beginPath() 
      ctx.moveTo(0, calcCurvey(curve[0]))
      lerped = curveTypes[distance[0].name].map((value, index) => {
        const y = calcCurvey(value)
        ctx.lineTo(calcCurvex(xValues[index]), y)
        return value
      })
      
      toneObj.tone.curve = lerped
      setCurve(lerped)
      
      ctx.stroke()
    } else {
      toneObj.tone.curve = curveTypes["I"]
      setCurve(xValues)
    }
  }



  useEffect(() => {
    getDistance()
  }, [blob])

  const getDistance = () => {
    if (curves.length > 0 && blob) {
      const distance = selected.map(index => {
        return {distance: Math.sqrt((curves[index].x - blob.x) ** 2 + (curves[index].y - blob.y) ** 2), name: curves[index].name};
      });
      curveInterpolation(distance)
    }
  };
  

  const handleFunctionsSelection = (index) => {
    let arr
    if (selected.includes(index)) {
      arr = selected.filter(item => item !== index)
    } else {
      arr = selected.length < 3 ? [...selected, index] : [...selected]
    }
    setSelected(arr)
  }

  useEffect(() => {
    getDistance()
  }, [selected])


  const handleMouseDown = (event, index) => {
    setInitialX(event.clientX)
    setInitialY(event.clientY)
    setIsDragging(true)
  }

  const handleMouseMove = (event) => {
    const handler = setTimeout(() => {
    const x = event.clientX - initialX
    const y = event.clientY - initialY
    const updatedBlob = {
      x: blob.x + x, y: blob.y + y
    }        
    setBlob(updatedBlob); // Update the state with the new array
    }, 120)
    return () => clearTimeout(handler)    
  }



  const handleMouseUp = () => {
    setIsDragging(false)
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } 
  }, [isDragging]);

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []); 


  return (
    <div className='signal-options-wrapper'>
      <div 
        className='left-stander'
        onClick={() => setOpenProperties(!openProperties)}
        >
        <div className='header'>
          {toneObj.name}
        </div>
      </div>
        {openProperties ? (
          <div 
            className='parameters'
            style={{
              borderRight: `1px solid ${colorScheme["Signal"]}`, 
              position: 'relative'
            }}
          > 
          {curves.map((value, index) => (
            <div 
              className='curve-image'
              key={value.name}
              style={{
                  position: 'absolute', 
                  top: value.y, left: value.x, 
                  height: "25px", width: "25px",
                  zIndex: 99,
                  fontSize: "7pt", fontWeight: "500",
                  display: "flex", justifyContent: "center", 
                  alignItems: 'center',                  
                  transform: "translate(-50%, -50%)",
                  color: selected.includes(index) ? `${colorScheme["Signal"]}` : ""
                }}
                onClick={() => handleFunctionsSelection(index)}
              >
              {value.name.slice(0, 4)}
            </div>
          ))}

        
          <div 
            className='joystick'
            onMouseDown={handleMouseDown}
            
            style={{
                position:'absolute', left: blob.x, top: blob.y, 
                height: "20px", width: "20px", borderRadius: "50%",
                backgroundColor: `${colorScheme["Signal"]}`,
                transform: "translate(-50%, -50%)",
                zIndex: 999,
              }}  
              >
          </div>
          <div className='scope'
               style={{ display: "flex", 
                        zIndex: 0,
                        justifyContent: "center", 
                        alignItems: "center", 
                        position: 'relative',   
                        top: "140px",
                        left: 0,
   
                        height: `${scopeHeigth}px`, 
                        width: `${scopeWidth}px`,
                        cursor: "not-allowed", 
                        backgroundSize: "10px 10px",
                        backgroundImage: `linear-gradient(to right, ${colorScheme["natural"]}22 1px, transparent 1px),
                                          linear-gradient(to bottom, ${colorScheme["natural"]}22 1px, transparent 1px)`
                      }} 
        > 
        <div 
          className='center-line'
            style={{
            height: "100%",
            position: 'absolute',
            left: "70px",
            borderLeft: `1px solid ${colorScheme["Signal"]}77`
            }}         
        >
        </div>
        <div 
          className='center-line-horizontal'
            style={{
            width: "140px",
            position: 'absolute',
            top: "50px",
            borderTop: `1px solid ${colorScheme["Signal"]}77`
            }}         
        >
        </div>
        <div 
          className='+1'
            style={{
            height: "100%",
            position: 'absolute',
            right: "70px", fontSize: "6.5pt", fontWeight: "700",
            top: "10px",
            color: `${colorScheme["Signal"]}`
            }}         
        > 1
        </div>
        <div 
          className='-1'
            style={{
            height: "100%",
            position: 'absolute',
            right: "70px", fontSize: "6.5pt", fontWeight: "700",
            top: "70px",
            color: `${colorScheme["Signal"]}`
            }}         
        > -1
        </div>
        <div 
          className='center-line-horizontal'
            style={{
            width: "10px",
            position: 'absolute',
            top: "20px",
            borderTop: `1px solid ${colorScheme["Signal"]}77`
            }}         
        >
        </div>
        <div 
          className='center-line-horizontal'
            style={{
            width: "10px",
            position: 'absolute',
            top: "80px",
            borderTop: `1px solid ${colorScheme["Signal"]}77`
            }}         
        >
        </div>
          <canvas 
            ref={shaperCanvasRef}
            style={{

            }}
            >
          </canvas>
        </div>
      </div>
      ) : null}
    </div>
      
    
  )
}

export default Waveshaper
