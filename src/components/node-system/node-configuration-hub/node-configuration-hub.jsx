import React, { useState } from 'react'
import "./node-configuration-hub.scss"
import SourceOptions from '../option-components/source-options/source-options'
import Transport from '../option-components/transport/transport'
import InstrumentOptions from '../option-components/instrument-options/instrument-options'
import EffectOptions from '../option-components/effect-options/effect-option'

const NodeConfigurationHub = ({tone, notesToTrigger, getGlobalTime}) => {


  return (
    <div className='node-config-hub-container'>
      <div className='node-config-hub'> 
        {Object.keys(tone).map((toneObj) => (
          <React.Fragment key={toneObj}>
              {tone[toneObj].type === "Source" ? (
                <SourceOptions 
                  toneObj={tone[toneObj]}
                />
              ) : tone[toneObj].name === "Transport" ? (
                <Transport 
                  id={tone[toneObj].id} 
                  name={tone[toneObj].name} 
                  type={tone[toneObj].type}
                  notesToTrigger={notesToTrigger}
                  getGlobalTime={getGlobalTime}
                  />
              ) : tone[toneObj].type === "Instrument" ? (
                <InstrumentOptions 
                  toneObj={tone[toneObj]}
                /> 
              ) : tone[toneObj].type === "Effect" ? (
                <EffectOptions toneObj={tone[toneObj]} />
              ) : null}
          </React.Fragment>
        ))}
      </div>      
    </div>
  )
}

export default NodeConfigurationHub
