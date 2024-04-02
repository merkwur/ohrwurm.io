import React, { useEffect, useState } from 'react';
import { Bezier, Line } from '../../types/types';


interface CurveProps {
  id: string, 
  line: Line, 
  deleteLine: (id: string) => void
}

const Curves: React.FC<CurveProps> = ({id, line, deleteLine}) => {
  const [curvePosition, setCurvePosition] = useState<Bezier>({mx:0,my:0,x1:0,y1:0,x2:0,y2:0,x:0,y:0})

  useEffect(() => {
    const dx = Math.abs(line.ex - line.sx);
    const controlPointLength = dx / 2;
    const x1 = line.sx + controlPointLength;
    const x2 = line.ex - controlPointLength;

    setCurvePosition({
      mx: line.sx,
      my: line.sy,
      x1: x1,
      y1: line.sy,
      x2: x2,
      y2: line.ey,
      x: line.ex,
      y: line.ey,
    });
  }, [line])

  const handleClick: React.MouseEventHandler<SVGPathElement> = (event) => {
    event.preventDefault();
    deleteLine(id);
  };

  if (!curvePosition) {
    return null
  }

  return (
    <>
      <path
        d={`M ${curvePosition.mx} ${curvePosition.my} C ${curvePosition.x1} ${curvePosition.y1}, ${curvePosition.x2} ${curvePosition.y2}, ${curvePosition.x} ${curvePosition.y}`}
        // stroke='#f734d7'
        stroke={`#ff4242`} 
        strokeWidth={8}
        strokeLinecap="round"
        fill="transparent"
        onContextMenu={handleClick}
        style={{ zIndex: "9999" }}
      />
    </>
  );
};

export default Curves;