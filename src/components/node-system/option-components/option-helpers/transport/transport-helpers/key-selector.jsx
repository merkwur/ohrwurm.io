import React, { useEffect, useRef, useState } from 'react'
import "./key-selector.scss"
import { clamp } from 'three/src/math/MathUtils'


const KeySelector = ({currentKey, chromaKeys, onLine, getParameter }) => {
  const [hoveredKey, setHoveredKey] = useState(null);
  const [selectedKey, setSelectedKey] = useState(currentKey)
  
  const keyRefs = useRef({});

  const handleClick = (key) => () =>  {
    setSelectedKey(key)
    getParameter(key)
  }

  const handleMouseEnter = (key) => () => {
    setHoveredKey(key);
    
  };

  const handleMouseLeave = () => {
    setHoveredKey(null);
  };

  return (
    <div className='key-wrapper'>
      {chromaKeys.map((key, index) => (
        <div
          key={key + index + onLine}
          className='keys'
          ref={(ref) => (keyRefs.current[key] = ref)}
          onMouseEnter={handleMouseEnter(key)}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick(key)}
          style={{
            color: hoveredKey === key || selectedKey === key ? 'bisque' : '#77777742', // Change '#ccc' to whatever color you prefer
            cursor: 'pointer',
          }}
        >
          {key}
        </div>
      ))}
    </div>
  );
};

export default KeySelector;