import React, { useEffect, useState } from "react";
import Curves from "./curves";
import { Lines } from "../../types/types";

interface LineProps {
  lines: Lines, 
  deleteLine: (id: string) => void
}

const LineCanvas: React.FC<LineProps> = ({lines, deleteLine}) => {
  const [dims, setDims] = useState<{width: number, height: number}>({width: 0, height: 0});

  useEffect(() => {
    console.log(lines)
    setDims({width: window.innerWidth, height: window.innerHeight})
  }, [window.innerWidth])

  const handleLineDelete = (id: string) => {
    deleteLine(id)
  }

  return (
    <svg 
      viewBox={`0 0 ${dims.width} ${dims.height}`}
      style={{position: "absolute"}}
      height={dims.height}
      width={dims.width}
      >  
      {lines && Object.keys(lines).length > 0 ? (
        <React.Fragment > 
          {Object.keys(lines).map((line, index) => (  
            <Curves
              key={index+line}
              id={line}
              line={lines[line]}
              deleteLine = {(id) => handleLineDelete(id)}         
            />
          ))}
        </React.Fragment>
      ) : null}
    </svg>
  );
};

export default LineCanvas;