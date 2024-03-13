export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max)
}


export const positionHandler = (x: number, y: number, snapSize: number): {x: number, y: number} => { 
  const sx = Math.floor(x / snapSize) * snapSize + 5
  const sy = Math.floor(y / snapSize) * snapSize + 5
  return {x: sx, y: sy}
}