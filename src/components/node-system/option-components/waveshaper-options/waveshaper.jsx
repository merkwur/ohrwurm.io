import React, { useEffect, useState } from 'react'
import "./waveshaper.scss"
import { colorScheme } from '../../node-helpers/helperFunctions'
import {  curveTypes } from './waveshapingFunctions'
import { lerp } from 'three/src/math/MathUtils'

const curveNames = ["I", "tanh", "sigmoid", "relu", "leaky", "gelu", "fold", "elu", "modulated", "circular"]

const scopeWidth = 140
const scopeHeigth = 100

const Waveshaper = ({toneObj}) => {
  const [openProperties, setOpenProperties] = useState(true)
  const [curve, setCurve] = useState(new Float32Array(32))
  const [curves, setCurves] = useState([])
  const [points, setPoints] = useState([])
  const [blob, setBlob] = useState({x: 70, y: 70})
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [selected, setSelected] = useState([])
  const radius = 50


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

  const curveInterpolation = (distance) => {
    let lerped
    if (distance.length > 1) {
      let d = 0
      let v = 0
      distance.forEach(dist => {
        d += dist.distance
      })

      lerped = curve.map((value, index) => {
        v = 0
        distance.forEach(dist => {
          
          v += curveTypes[dist.name][index] * (1 - (dist.distance / d))
          
        })
        return v 
      })

      toneObj.tone.curve = lerped
      setCurve(lerped)      
    } else if (distance.length === 1){
      toneObj.tone.curve = curveTypes[distance[0].name]
      setCurve(new Float32Array(curveTypes[distance[0].name]))
    } else {
      toneObj
      setCurve(new Float32Array(curveTypes["I"]))
    }
  }


  useEffect(() => {
      const arr = Array.from(curve).map((value, index) => {
        const x = (index / curve.length)  * scopeWidth
        const y = (1-(value * scopeHeigth) * .3) + 45 
        return `${x} ${y}`
      }).join(" ") || ""
      setPoints(arr)
      
  }, [curve])

  

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
    
  }, [selected])


  const handleMouseDown = (event, index) => {
    setInitialX(event.clientX)
    setInitialY(event.clientY)
    setIsDragging(true)
  }

  const handleMouseMove = (event) => {
    const x = event.clientX - initialX
    const y = event.clientY - initialY
    const updatedBlob = {
      x: blob.x + x, y: blob.y + y
    }        
    setBlob(updatedBlob); // Update the state with the new array
    //const handler = setTimeout(() => {
   // }, 5)
    //return () => clearTimeout(handler)    
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
                transform: "translate(-50%, -50%)"
              }}  
              >
          </div>
          <div className='scope'
               style={{display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center", 
                  position: 'relative',   
                  top: "140px",
                  left: -5,               
                  height: `${scopeHeigth}px`, 
                  cursor: "not-allowed", 
                  backgroundSize: "25px 25px",
                  backgroundImage: `linear-gradient(to right, ${colorScheme["natural"]}22 1px, transparent 1px),
                                    linear-gradient(to bottom, ${colorScheme["natural"]}22 1px, transparent 1px)`
                }} 
        >
          <svg 
            className='scope-view'
            style={{borderBottom: `1px solid`, position: 'absolute'}}
            
            width={scopeWidth} 
            height={scopeHeigth} 
            viewBox={`0 0 ${scopeWidth} ${scopeHeigth}`}
            >
            <polyline 
              fill='none'
              stroke={`${colorScheme["Signal"]}`}
              strokeWidth={1}
              points={points}
            />

          </svg>
        </div>
      </div>
      ) : null}
    </div>
      
    
  )
}

export default Waveshaper
