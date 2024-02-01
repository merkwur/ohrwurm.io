import React, { useEffect, useState } from 'react';

const colorScheme = {
  Core: "#b16286",
  Source: "#8ec07c",
  Instrument: "#fabd2f",
  Effect: "#fb4934",
  Component: "#b8bb26",
  Signal: "#458588",
  natural: "#777"
};

const generateGradients = () => {
  const gradientIDs = [];
  const gradients = [];

  for (const fromColor in colorScheme) {
    for (const toColor in colorScheme) {
      
      const gradientID = `${fromColor}2${toColor}`;
      gradientIDs.push(gradientID);

      const gradient = (
        <linearGradient id={gradientID} key={gradientID}>
          <stop offset="15%" stopColor={colorScheme[fromColor]} />
          <stop offset="85%" stopColor={colorScheme[toColor]} />
        </linearGradient>
      );

      gradients.push(gradient);

    }
  }

  return { gradientIDs, gradients };
};

const Curves = ({ id, line, deleteLine, fromType, toType }) => {
  const [curvePosition, setCurvePosition] = useState(0);
  const { gradientIDs, gradients } = generateGradients();



  useEffect(() => {
    const dx = Math.abs(line.ex - line.sx);
    const controlPointLength = dx / 2;
    const x1 = line.sx + controlPointLength;
    const x2 = line.ex - controlPointLength;

    setCurvePosition({
      mx: line.sx,
      my: line.sy + 1,
      x1: x1,
      y1: line.sy-1,
      x2: x2,
      y2: line.ey+1,
      x: line.ex,
      y: line.ey+1,
    });
  }, [line]);

  const handleClick = (event) => {
    event.preventDefault();
    deleteLine(id);
  };

  if (!curvePosition) {
    return null;
  }

  return (
    <>
      <defs>{gradients}</defs>
      <path
        d={`M ${curvePosition.mx} ${curvePosition.my} C ${curvePosition.x1} ${curvePosition.y1}, ${curvePosition.x2} ${curvePosition.y2}, ${curvePosition.x} ${curvePosition.y}`}
        // stroke='#f734d7'
        stroke={`url(#${fromType}2${toType})`} 
        strokeWidth={8}
        strokeLinecap="round"
        fill="transparent"
        onContextMenu={(event) => handleClick(event)}
        style={{ zIndex: "9999" }}
      />
    </>
  );
};

export default Curves;
