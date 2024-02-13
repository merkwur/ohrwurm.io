import React from 'react'
import "./envelope.scss"
import { initialStates } from '../../../node-helpers/toneData'
import HorizontalSlider from '../../parameters/horizontal-slider/horizontal-slider'


const Envelope = ({parameters, which, getParameter}) => {

  
  return (
    <div className='envelope'>
      {Object.keys(parameters).map((item, index) => (
        <React.Fragment
          key={item+index+which}
        > 
          {initialStates[item].type  === "slider" ? (
            <HorizontalSlider 
              name={item}
              type={"Instrument"}
              state={initialStates[item]}
              getParameter={getParameter}
              whichOscillator={which}
              parameterValue={parameters[item]}
              abbreviate={true}
              isParamCentered={true}
              
            />
          ) : initialStates[item].type === "select" ? (
            <div className='dropdown'>
              <></>
            </div>
          ) : null}
        </React.Fragment>
      ))}
    </div>
  )
}

export default Envelope
