import React from 'react'
import Frequency from '../frequency/frequency'
import Detune from '../detune/detune'

const MasterParam = ({id, name, type}) => {



  return (
    <div className='param-wrapper'>
      {name === "frequency" ? (
        <Frequency id={id} name={name} type={type}/>
      ) 
      : name === "detune" ? (
       <></>
      ) : null}
      
    </div>
  )
}

export default MasterParam
