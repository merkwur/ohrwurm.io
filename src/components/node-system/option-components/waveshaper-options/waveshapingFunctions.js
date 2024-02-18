
const linspace = (start, stop, n) => {
  const step = (stop - start) / (n - 1)
  return new Float32Array(Array.from({length: n}, (_, i) => start + i * step))
}

const x = new Float32Array(linspace(-Math.PI, Math.PI, 64))


const getIdentity = (x) => { 
  return x
}

const getTanh = (x) => {
  const arr = x.map(value => {
    return Math.tanh(value)
  })
  return arr
}

const getSigmoid = (x) => {
  const arr = x.map(value => {
    return 1 / (1 - Math.exp(-value))
  }) 
  return arr
}

const getRelu = (x) => {
  const arr = x.map(value => {
    return value > 0 ? value : 0
  })
  return arr
}

const getLeaky = (x) => {
  const arr = x.map(value => {
    return value > 0 ? value : value * .08
  })
  return arr
}

const getGelu = (x) => {
  const arr = x.map(value => {
    return 0.5 * value * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (value + 0.044715 * Math.pow(value, 3))));
  })
  return arr
}

const getGaussian = (x) => {
  const arr = x.map(value => {
    return Math.exp(-x*x)
  })
  return arr
}

const getElu = (x) => {
  const arr = x.map(value => {
    return value > 0 ? value : .9 * (Math.exp(x) - 1)
  })
  return arr
}

const getSoftplus = (x) => {
  const arr = x.map(value => {
    return Math.log(1 + Math.exp(value))
  })
  return arr
}

export const identity  = getIdentity(x)
export const tanh      = getTanh(x)
export const sigmoid   = getSigmoid(x)
export const relu      = getRelu(x)
export const leaky     = getLeaky(x)
export const gelu      = getGelu(x)
export const gaussian  = getGaussian(x)
export const elu       = getElu(x)
export const softplus  = getSoftplus(x)