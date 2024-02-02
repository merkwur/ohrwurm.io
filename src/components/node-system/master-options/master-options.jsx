import React from 'react'
import SourceOptions from '../option-components/source-options/source-options'
import './master-options.scss'

const MasterOptions = ({tone}) => {

  return (
    <div 
      className='master-options-wrapper'
    > 
      {tone.type === "Source" ? (
        <SourceOptions 
          id={tone.id}
          name={tone.name}
          type={tone.type}
          parameters={tone.parameters}
        />
      ) : null}
    </div>
  )
}

export default MasterOptions
