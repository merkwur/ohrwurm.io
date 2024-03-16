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
    }

  }

  const nodeOutputs: Record<string, Record<string, []>>= {
    Oscillator: {node: []},
    Destination: {node: []}
  }

  return { input: nodeInputs[name], output: nodeOutputs[name] }
}
