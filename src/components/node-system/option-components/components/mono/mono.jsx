import React from 'react'
import HorizontalSlider from '../../parameters/horizontal-slider/horizontal-slider'
import Envelope from '../envelope/envelope'
import { initialStates } from '../../../node-helpers/toneData'
import "./mono.scss"
import Dropdown from '../dropdown/dropdown'


const Mono = ({
              filter, 
              filterEnvelope, 
              getEnvelopeParameter, 
              getParameter,
              getFilterType
            }) => {
  return (
    <div className='mono-filter-section'>
      <div className='mono-header'>
        frequencyEnvelope
      </div>
      <div className='mono-filter-envelope'>
        <Envelope
          parameters={filterEnvelope}
          which={null}
          getParameter={getEnvelopeParameter}
        />
      </div>
      <div className='mono-filter-type'>
        <Dropdown 
          options={initialStates.filterTypes.value.slice(0, 3)}
          selectFilterType={getFilterType}
          value={filter.type}
          header={"filterType"}
          type={"Instrument"}
        />
      </div>
      <div className='mono-filter'>
        <HorizontalSlider
          name={"Q"}
          type={"Instrument"}
          state={initialStates.Q}
          parameterValue={filter.Q}
          getParameter={getParameter}
          whichOscillator={"carrier"}
          parentOscillator={null}
        />

      </div> 
    </div>
  )
}

export default Mono
