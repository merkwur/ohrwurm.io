export const positionHandler = (x: number, y: number, snapSize: number): {x: number, y: number} => { 
  const sx = Math.floor(x / snapSize) * snapSize 
  const sy = Math.floor(y / snapSize) * snapSize
  return {x: sx, y: sy}
}