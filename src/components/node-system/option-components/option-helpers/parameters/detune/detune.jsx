import React from 'react'
import Slider from '../param-helpers/slider'

const Detune = ({id, name, type}) => {
  return (
    <div className='detune-wrapper'>
      <Slider id={id} name={name} type={type}/>
    </div>
  )
}

export default Detune
