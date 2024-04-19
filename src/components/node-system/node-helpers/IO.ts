interface Socket {
  input: {} | undefined
  output: {} | undefined
}

export const getSockets = (name: string): Socket => {
  const nodeInputs: Record<string, Record<string, null | string[]>> = {
    Oscillator: {
      frequency: null, 
      detune: null
    },
    Destination: {
      node: []
    },
    channel: {
      pan: null, 
      volume: null, 
      node: null
    }

  }

  const nodeOutputs: Record<string, Record<string, []>>= {
    Oscillator: {node: []},
    Destination: {node: []},
    
  }
  if (name.includes("channel")) {
    return  { input: nodeInputs["channel"], output: nodeOutputs["channel"] }
  } else {
    return { input: nodeInputs[name], output: nodeOutputs[name] }
  }
}
