import React, { useState } from 'react'
import "./source-options.scss"
import MasterParam from '../option-helpers/parameters/master-param/master-param'


const SourceOptions = ({id, name, type, parameters}) => {
  const [openProperties, setOpenProperties] = useState(false)


  return (
    <div className='source-options-wrapper'>
      <div 
        className='left-stander'
        onClick={() => setOpenProperties(!openProperties)}
        >
        <div className='header'>
          {name}
        </div>
      </div>
      <>
        { openProperties ? (
          <div className='parameters'
            >
            {Object.keys(parameters).map((param, index) => (
              <div 
                className='params'
                key={param + index}
                > 
                <MasterParam id={id} name={param} type={type}/>
              </div>
            ))}      
          </div>
        ) : null }

       </>
    </div>
  )
}

export default SourceOptions
