import React, { memo, useState } from 'react'
import "./node-configuration-hub.scss"
import SourceOptions from '../option-components/source-options/source-options'

import InstrumentOptions from '../option-components/instrument-options/instrument-options'
import EffectOptions from '../option-components/effect-options/effect-option'
import Waveshaper from '../option-components/waveshaper-options/waveshaper'
import ComponentOptions from '../option-components/component-options/component-options'


const NodeConfigurationHub = memo(({tone, notesToTrigger, getGlobalTime}) => {


  return (
    <div className='node-config-hub-container'>
      <div className='node-config-hub'> 
        {Object.keys(tone).map((toneObj) => (
          <React.Fragment key={toneObj}>
              {tone[toneObj].type === "Source" ? (
                <SourceOptions 
                  toneObj={tone[toneObj]}
                />
              ) : tone[toneObj].type === "Instrument" ? (
                <InstrumentOptions 
                  toneObj={tone[toneObj]}
                /> 
              ) : tone[toneObj].type === "Effect" ? (
                <EffectOptions toneObj={tone[toneObj]} />
              ) : tone[toneObj].name === "WaveShaper" ? (
                <div>
                  <Waveshaper toneObj={tone[toneObj]}/>
                </div>
              ) : tone[toneObj].type === "Component" ? 
              <>
                {tone[toneObj].name !== "Analyser" && tone[toneObj].name !== "CrossFade" ? (
                  <ComponentOptions toneObj={tone[toneObj]} />
                ) : null} 
              </>
              : null}
          </React.Fragment>
        ))}
      </div>      
    </div>
  )
})

export default NodeConfigurationHub
