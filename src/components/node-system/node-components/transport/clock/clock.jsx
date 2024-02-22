import React, { useEffect, useState } from 'react'
import "./clock.scss"

const Clock = React.memo(({bpm, getTime}) => {
  const [isClockRunning, setIsClockRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [intervalId, setIntervalId] = useState(0)

  const handleClock = () => {
    if(!isClockRunning) {
      clearInterval(intervalId)
      console.log(bpm)
      const id = setInterval(() => setTime(p => p + 1), 60000 / bpm)
      setIntervalId(id)
      setIsClockRunning(true)
    } else {
      clearInterval(intervalId)
      setIntervalId(null)
      setTime(0)
      setIsClockRunning(false)
    }
  }

  useEffect(() => {getTime(time)}, [time])  

  useEffect(() => {
    if(intervalId) {
      clearInterval(intervalId)
      const id = setInterval(() => setTime(p => p + 1), 60000 / bpm)
      setIntervalId(id)
      
    }
  }, [bpm])

  return (
    <div 
      className='clock-screen'
      onClick={handleClock}
      style={{color: isClockRunning ? "#42ff42" : "#ff4242"}}
    > 
      {time}
    </div>
  )
})

export default Clock
