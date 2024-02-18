import React, { useEffect, useState } from 'react'
import "./waveshaper.scss"
import { colorScheme } from '../../node-helpers/helperFunctions'
import { 
        identity, 
        tanh,
        sigmoid, 
        relu, 
        leaky, 
        gelu, 
        gaussian, 
        elu, 
        softplus
        } from './waveshapingFunctions'

const curveNames = ["I", "tanh", "sig", "relu", "lea", "gelu", "gaus", "elu", "soft"]

const Waveshaper = ({toneObj}) => {
  const [openProperties, setOpenProperties] = useState(true)
  const [curve, setCurve] = useState(new Float32Array(64))
  const [cruveDisplayData, setCurveDisplayData] = useState([])
  const [joy, setJoy] = useState({x: 62, y: 65})
  const [blobScope, setBlobScope] = useState(1)
  const [initialX, setInitialX] = useState(0)
  const [initialY, setInitialY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const radius = 50
    const t = (360 / curveNames.length) * (Math.PI / 180) 
    const arr = []
    for (let i = 0; i < curveNames.length; i++) {
      const theta = i * t - (Math.PI /2)
      const o = {x: 70 + radius * Math.cos(theta), y: 70 + radius * Math.sin(theta), name: curveNames[i]}
      arr.push(o)
    }
    
    setCurveDisplayData(arr)
    
  }, [])

  const curveInterpolation = () => {

  }

  useEffect(() => {
    getDistance()
  }, [joy])

  const getDistance = () => {
    const distance = cruveDisplayData.map(curve => {
      return Math.sqrt((curve.x - joy.x)**2 + (curve.y - joy.y)**2)
    })
    
    if (cruveDisplayData.length > 0) {
      const argmin = distance.reduce((minIdx, currentVal, currentIdx, array) => 
                                          currentVal < array[minIdx] ? currentIdx : minIdx , 0)
      console.log(cruveDisplayData[argmin].name)
      
    }
  }

  const handleMouseDown = (event) => {
    setInitialX(event.clientX)
    setInitialY(event.clientY)
    setIsDragging(true)
  }

  const handleMouseMove = (event) => {
    const x = event.clientX
    const y = event.clientY

    setJoy({x: joy.x + x - initialX, y: joy.y + y - initialY})

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
          {cruveDisplayData.map((value, index) => (
            <div 
              className='curve-image'
              key={value.name}
              style={{
                  position: 'absolute', 
                  top: value.y, left: value.x, 
                  height: "25px", width: "25px",
                  border: "1px solid", 
                  fontSize: "7pt", fontWeight: "500",
                  display: "flex", justifyContent: "center", 
                  alignItems: 'center',                  
                  transform: "translate(-50%, -50%)"
                }}
              >
              {value.name}
            </div>
          ))}
          <div 
            className='joystick'
            onMouseDown={handleMouseDown}
            style={{
                position:'absolute', left: joy.x, top: joy.y, 
                height: "20px", width: "20px", borderRadius: "50%",
                backgroundColor: "#ff4242",
                transform: "translate(-50%, -50%)"
          }}  
            >
              
          </div>
        </div>
        ) : null}
    </div>
      
    
  )
}

export default Waveshaper
