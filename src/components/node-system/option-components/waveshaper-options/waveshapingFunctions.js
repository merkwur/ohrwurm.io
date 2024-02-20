import { clamp } from "../../node-helpers/helperFunctions"

export const linspace = (start, stop, n) => {
  const step = (stop - start) / (n - 1)
  return new Float32Array(Array.from({length: n}, (_, i) => start + i * step))
}

const x = new Float32Array(linspace(-Math.PI, Math.PI, 32))


const getIdentity = (x) => { 
  const arr = x.map(value => {
    return value*.45
  })
  return arr
}

const getTanh = (x) => {
  const arr = x.map(value => {
    return Math.tanh(value)
  })
  return arr
}

const getSigmoid = (x) => {
  const arr = x.map(value => {
    return clamp(1 / (1 + Math.exp(-value)), 0, 1)
  }) 
  return arr
}

const getRelu = (x) => {
  const arr = x.map(value => {
    const val = value > 0 ? 2 : 2 * Math.abs(value)
    return clamp((val -1) * .4, -1, 1)
  })
  return arr
}

const getLeaky = (x) => {
  const arr = x.map(value => {
    return clamp(value > 0 ? value : value * .28, -1, 1)
  })
  return arr
}

const getGelu = (x) => {
  const arr = x.map(value => {
    return clamp(0.5 * value * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (value + 0.044715 * Math.pow(value, 3)))), -1 ,1)
  })
  return arr
}

const getFold = (x) => {
  const arr = x.map(value => {
    return Math.sin(2 * value)
  })
  return arr
}

const getElu = (x) => {
  const arr = x.map(value => {
      return value > 0 ? .5 * Math.sqrt(value) : .3 * value
  })
  return arr
}

const getModulated = (x) => {
  const arr = x.map(value => {
    return .5 * (Math.sin(2 * Math.PI * .4 * value + (.5 * (Math.cos(2 * Math.PI * .7 * value + Math.PI/2)))))
  })
  return arr
}

const getCircular = (x) => {
  const theta = Math.PI * Math.PI/3
  const arr = x.map(value => {
    return 2 * Math.cos(value * theta) * Math.sin(value / theta)
  })
  return arr
}

export const curveTypes = { I        : getIdentity(x),
                            tanh     : getTanh(x),
                            sigmoid  : getSigmoid(x),
                            relu     : getRelu(x),
                            leaky    : getLeaky(x),
                            gelu     : getGelu(x),
                            fold     : getFold(x),
                            elu      : getElu(x), 
                            modulated: getModulated(x),
                            circular : getCircular(x)
                          }