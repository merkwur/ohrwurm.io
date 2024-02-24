const xl = Array.from(Array(48).keys())
const xs = Array.from(Array(12).keys())
const dim = 48

const linspace = (start, stop, n) => {
  const step = (stop - start) / (n - 1)
  return Array.from({length: n}, (_, i) => start + i * step)
}

const mainY = () => {
  return 30
}

const getDestination = () => {
  const arr = linspace(0, Math.PI, 8).map((value, index) => {
    const x = 10 + (value * 12)
    const y = index % 2 === 0 ? mainY() + (20 * Math.sin(value)) : mainY() + (-20 * Math.sin(value)) 
    return `${x} ${y}`
  }).join(" ") || ""
  console.log(arr)  
  return arr
}


export const pictograms = {
  Destination: getDestination(), 

}