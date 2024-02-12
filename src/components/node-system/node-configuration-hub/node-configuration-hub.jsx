import React, { useState } from 'react'
import "./node-configuration-hub.scss"
import SourceOptions from '../option-components/source-options/source-options'
import Transport from '../option-components/transport/transport'

const NodeConfigurationHub = ({tone, notesToTrigger, getGlobalTime}) => {

  return (
    <div className='node-config-hub-container'>
      <div className='node-config-hub'> 
        {Object.keys(tone).map((toneObj) => (
          <React.Fragment key={toneObj}>
              {tone[toneObj].type === "Source" ? (
                <SourceOptions 
                  name={tone[toneObj].name}
                  type={tone[toneObj].type}
                  parameters={tone[toneObj].parameters}
                  getOscillatorState={(id) => handleStartOscillator(id)}
                  getParameter={(value, type, which) => handleParameterChange(value, type, which)}
                  getWaveType={(type, parent, which) => handleWaveTypes(type, parent, which)}
                />
              ): toneObj.type === "Instrument" ? (
                <></>
              ) : tone[toneObj].name === "Transport" ? (
                <Transport 
                  id={toneObj.id} 
                  name={toneObj.name} 
                  type={toneObj.type}
                  notesToTrigger={notesToTrigger}
                  getGlobalTime={getGlobalTime}
                  />
              ) : null}
          </React.Fragment>
        ))}
      </div>      
    </div>
  )
}

export default NodeConfigurationHub
