import React, { useEffect, useState } from "react";
import Curves from "./curves";

const LineCanvas = ({lines, deleteLine}) => {
  const [dims, setDims] = useState({ width: 0, height: 0 });

  

  useEffect(() => {
    setDims({width: window.innerWidth, height: window.innerHeight})
  }, [window.innerWidth])

  const handleLineDelete = (lineID) => {
    deleteLine(lineID)
  }


  return (

    <svg 
      viewBox={`0 0 ${dims.width} ${dims.height}`}
      // style={{position: "absolute"}}
      height={dims.height}
      width={dims.width}
      style={{zIndex: "9999"}}
      >  

      {lines && Object.keys(lines).length > 0 ? (
        <React.Fragment > 
          {Object.keys(lines).map((line, index) => (
          
            <Curves
              id={line}
              key={index}
              line={{sx: lines[line].sx, sy: lines[line].sy, ex: lines[line].ex, ey: lines[line].ey}}
              deleteLine = {(lineID) => handleLineDelete(lineID)}
              fromType={lines[line].fromType}
              toType={lines[line].toType}
            />
          ))}
        </React.Fragment>
      ) : null}
    </svg>
  );
};

export default LineCanvas;