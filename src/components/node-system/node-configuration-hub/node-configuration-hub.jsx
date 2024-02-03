import React, { useState } from 'react'
import "./node-configuration-hub.scss"
import MasterOptions from '../master-options/master-options'

const NodeConfigurationHub = ({tone}) => {

  return (
    <div className='node-config-hub-container'>
      <div className='node-config-hub'> 
        {Object.keys(tone).map((toneObj) => (
          <React.Fragment key={toneObj}>
            <MasterOptions tone={tone[toneObj]}/>
          </React.Fragment>
        ))}
      </div>      
    </div>
  )
}

export default NodeConfigurationHub
