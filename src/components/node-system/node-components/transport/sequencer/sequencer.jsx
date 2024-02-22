import React, { useEffect, useRef, useState } from 'react'
import Output from '../../component-helpers/output/output'
import { clamp, colorScheme } from '../../../node-helpers/helperFunctions'
import { Scale } from 'tonal'
import "./sequencer.scss"
import HorizontalSlider from '../../../option-components/parameters/horizontal-slider/horizontal-slider'
import { initialStates } from '../../../node-helpers/toneData'


const chroma = Scale.get("C chromatic").notes

const Sequencer = ({node}) => {
  
  const [sequenceLenght, setSequenceLength] = useState(8)
  const [keys, setKeys] = useState(Array(sequenceLenght).fill("C1"))
  const [selectedCells, setSelectedCells] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const [initials, setInitials] = useState({x: 0, y: 0})
  const [refIndex, setRefIndex] = useState(null)
  const [note2Seq, setNote2Seq] = useState(false)
  const [whichAdjust, setWhichAdjust] = useState("")
  const [subSequenceLength, setSubSequenceLength] = useState(Array(8).fill(1))
  const [subSequencePosition, setSubSequencePosition] = useState(Array.from(Array(8).keys()))
  const nodeRefs = useRef([])

  const handleMouseDown = (event, index, which) => {
    setIsDragging(true)
    setWhichAdjust(which)
    setInitials({x: event.clientX, y: event.clientY})
    setRefIndex(index)
  }

  const handleMouseMove = (event) => {
    if (isDragging && whichAdjust === "note") {
      const handler = setTimeout(() => {
        const y = clamp(Math.floor((event.clientY - initials.y) / 5), 0, 100)
        const x = clamp(Math.floor((event.clientX - initials.x) / 5), 0, 100)
        const octaves = Math.floor(x / (100 / 8))
        const key = chroma[Math.floor(y /9 )]
        console.log(key,octaves)
        nodeRefs.current[refIndex].children[0].style.width  = `${x}%`
        nodeRefs.current[refIndex].children[0].style.height = `${y}%`
        const arr = [...keys]
        arr[refIndex] = key+octaves
        setKeys(arr)
      }, 20)
      return () => clearTimeout(handler)
    } else if (isDragging && whichAdjust === "sequence") {
        const arr = [...subSequencePosition]
        const xpos = Math.floor((event.clientX - initials.x) / 30)
        arr[refIndex] += clamp(xpos, -subSequencePosition[refIndex], 8-subSequenceLength[refIndex] - subSequencePosition[refIndex])
        setSubSequencePosition(arr)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setWhichAdjust("")
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }


  const handleSubSequenceLength = (event, index) => {
    const arr = [...subSequenceLength]
    arr[index] += event.nativeEvent.wheelDelta / 120
    arr[index] = clamp(arr[index], 1, 8 - subSequencePosition[index])
    setSubSequenceLength(arr)
  } 


  useEffect(() => {
    if (isDragging) {
      // Only add these listeners when dragging starts
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    // No need to remove listeners here since handleMouseUp will take care of it
    return () => {
      // Cleanup function to ensure no dangling listeners from this effect
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]); // This effect toggles based on isDragging state


  const handleLength = (value) => {
    setSequenceLength(value)
  }

  return (
    <div 
      className='sequencer-container'
      id={node.id}
      style={{
        height: `${node.size.y}px`,
        width :`${node.size.x}px`,
      }}
    >
      <div className='notes-wrapper'>
        <div className='sequences'>
          {keys.map((item, index) => (
            <div 
              className='sequence-cells'
              key={item+index+"sequence-cells"}
              ref={(ref) => nodeRefs.current[index] = ref}
              onMouseDown={(event) => handleMouseDown(event, index, "note")}
              style={{
                
                width: `${25}px`, height: `${100}px`,
                border: `1px solid ${colorScheme["Core"]}42`, 
                backgroundColor: selectedCells.includes(index) ? `${colorScheme["Core"]}` : "",
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
        <div className='keys'>

          {keys.map((key, index) => (
            <div 
              className='key'
              key={key+index+"keeyyo"}
              style={{
                position:'absolute',
                width: "25px", left: `${index*25}px`
              }}
              >
              {key}
            </div>
          ))}
        </div>
      </div>
      <div className='bottom-parameters'>
        <div 
          className='note-sequence-switch'
          onClick={() => setNote2Seq(!note2Seq)}
          >
          {"switch"}
        </div>
        <div className='length'>
            
            <HorizontalSlider 
              name={"length"}
              getParameter={(value) => handleLength(value)}
              state={initialStates["length"]}
              parameterValue={sequenceLenght}
              isParamCentered={true}
            />
            
        </div>
      </div>
     {note2Seq ? (
      <>
        {subSequenceLength.slice(0, sequenceLenght).map((sequence, index) => (
          <div 
            className='subsequence'
            key={index+"subsequence"}
            onWheel={(event) => handleSubSequenceLength(event, index)}
            onMouseDown={(event) => handleMouseDown(event, index, "sequence")}
            style={{
              position: 'absolute',
              top: `${9+index*(100/sequenceLenght)}px`, left:`${subSequencePosition[index]*25}px`,
              width: `${sequence * 25}px`,
              height: `${100/sequenceLenght}px`,
              backgroundColor: `${colorScheme["Core"]}27`,
              borderBottom: "1px solid #777777"
            }}
            >
          </div>
        ))}
      </>
    
     ) : null}
      <Output 
        id={node.id}
        outputType={"node"} 
        whichParent={node.type}
        yPosition={node.size.y / 2 - 6}
      />
    </div> 
  )
}

export default Sequencer
