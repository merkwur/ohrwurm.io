import React, { useState } from 'react'
import "./dropdown.scss"
import { colorScheme } from '../../../node-helpers/helperFunctions'

const Dropdown = ({
                  options, 
                  selectFilterType, 
                  value, 
                  type, 
                  header
                }) => {


  const [drop, setDrop] = useState(false)

  const handlefilterSelection = (item) => {
    selectFilterType(item)
    
  }

  return (
    <div className='dropdown-wrapper'>
      <div 
        className='dropdown-selected'
        onClick={() => setDrop(!drop)}
      >
        <div style={{color: `${colorScheme[type]}`}}>
          {`${header} >`}
        </div>
        
        <div>{` ${value}`}</div>
      </div>
      <div 
        className='dropdown-menu'
        style={{height: drop ? `${options.lenght * 12}px` : "0px"}}
      >
        {drop ? (
          <React.Fragment>
            {options.map((item, index) => (
              <div 
                className='option'
                key={item+index+"filter"}
                style={{top: `${10 + 12*index}px`}}
                onClick={() => handlefilterSelection(item)}
              >
                {item}
              </div>
            ))}
          </React.Fragment>
        ) : null }
      </div>
    </div>
  )
}

export default Dropdown
