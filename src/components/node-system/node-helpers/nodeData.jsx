import {v4 as uuidv4} from "uuid"
import { addToneObject } from "./toneData"



export const addNode = (x, y, name, type, snapSize, nodes, tones) => {
  let id
  if (name !== "Transport") {
    id = name + ":" + uuidv4().split("-")[0]
  } else {
    id = name
  }
  const snappedX = (Math.floor(x / snapSize) * snapSize) + 5
  const snappedY = (Math.floor(y / snapSize) * snapSize) + 5
  const normX = Math.floor((snappedX-5) / 40)
  const normY = Math.floor((snappedY-5) / 40)
  const cellIndex = 48 * normY + normX 
  const reducedIndex = 24 * Math.floor(normY / 2) + Math.floor(normX / 2)
  const newNode = {
    id, 
    name, 
    size: getSize(name, type, snapSize*2 - 10),
    input: getInputs(name,type),  
    position: {x: snappedX, y: snappedY},
    cellIndices: {x: normX, y: normY},
    reducedIndex: reducedIndex,
    positionIndices: {x: Math.floor(normX/2), y: Math.floor(normY/2)},
    connection: [],
    cellIndex: cellIndex,
    type, 
  }

  const updatedNodes = {...nodes, [id]: newNode}
  const toneData = addToneObject(id, name, type, tones)
  return [updatedNodes, toneData]
}





export const deleteNode = (id, nodes, lines, tones) => {
  if (!nodes[id]) {
    throw new Error('Node ID not found');
  }
  
  const node = nodes[id];
  
  // Use reduce to iterate over connections and accumulate updates
  const [updatedNodes, updatedLines] = node.connection.reduce(
    ([currentNodes, currentLines], connectionId) => {
      const [newLines, newNodes] = deleteLine(connectionId, currentLines, currentNodes);
      return [newNodes, newLines];
    },
    [nodes, lines] // Initial values
    );
    
    const { [id]: __, ...updateTones} = tones
    // Now remove the node itself
    const { [id]: _, ...finalNodes } = updatedNodes;
  
    return [finalNodes, updatedLines, updateTones];
    
    
  }
  
  
  
  export const addLine = (lineProps, lines, nodes) => {

    // Validate input
    if (
      !lines || 
      !nodes ||
      !lineProps || 
      !lineProps.to || 
      !lineProps.from || 
      !lineProps.which 
      ) {
        throw new Error('Invalid line properties');
      }
      
      const fromId = lineProps.from;
      const toId = lineProps.to;
      const which = lineProps.which;
      
      // check for the capacity of an input
      if (!Array.isArray(nodes[toId].input[which]) && nodes[toId].input[which]) {
        console.log(`the ${which} input capacity is full!`)
        return [lines, nodes]
      }
      // Generate a unique identifier for the line
      const id = `${fromId}>${toId}=${which}`;
      
      // Check if the line already exists to avoid duplication
      if (lines[id]) {
        return [lines, nodes];
      }
      
      // Clone the nodes object to maintain immutability
      const newNodes = JSON.parse(JSON.stringify(nodes));
      
      // Ensure the node ids exist in the nodes object
      if (!newNodes[fromId] || !newNodes[toId]) {
        throw new Error('Node ID not found');
      }
      
      
      newNodes[fromId].connection.push(id);
      newNodes[toId].connection.push(id);
      
      if (which !== "node") {
        newNodes[toId].input[which] = fromId;
      } else {
        if (!Array.isArray(newNodes[toId].input[which])) {
      newNodes[toId].input[which] = [];
    }
    newNodes[toId].input[which].push(fromId);
  }
  
  // Clone the lines object to maintain immutability
  const newLines = { ...lines, [id]: lineProps };
  
  // call tone connections 
  

  return [newLines, newNodes];
}




export const deleteLine = (id, lines, nodes) => {
  if (!lines[id]) {
    throw new Error('Line ID not found');
  }
  
  const line = lines[id];
  const { [id]: _, ...updatedLines } = lines;
  
  // Ensure nodes for the line exist
  if (!nodes[line.from] || !nodes[line.to]) {
    throw new Error('Node ID not found');
  }
  
  // Clone the nodes object to maintain immutability
  const updatedNodes = JSON.parse(JSON.stringify(nodes));
  
  // Update connections for both 'from' and 'to' nodes
  
  updatedNodes[line.from].connection = updatedNodes[line.from].connection.filter(c => c !== id)
  updatedNodes[line.to  ].connection = updatedNodes[line.to  ].connection.filter(c => c !== id)
  
  if (line.which === "node")  {
    console.log(updatedNodes[line.to].input.node, id)
    updatedNodes[line.to].input.node = updatedNodes[line.to].input.node.filter(i => i !== line.from)
  } else {
    updatedNodes[line.to].input[line.which] = null
  }
  
  return [updatedLines, updatedNodes];
}




export const updateNodePositions = (id, x, y, nodes) => {

  const normX = (Math.floor(x / 40)) 
  const normY = (Math.floor(y / 40)) 
  const cellIndex = 48 * normY + normX
  const rx = Math.floor(normX/2)  
  const ry = Math.floor(normY/2)
  const reducedIndex = 24 * ry + rx

  // the only requirement here is the node.positionIndices
  // the rest of the props are here for debugging

  const updatedNodes = JSON.parse(JSON.stringify(nodes))
  updatedNodes[id].position.x = x
  updatedNodes[id].position.y = y
  updatedNodes[id].cellIndex = cellIndex
  updatedNodes[id].reducedIndex = reducedIndex
  updatedNodes[id].cellIndices.x = normX
  updatedNodes[id].cellIndices.y = normY
  updatedNodes[id].positionIndices.x = rx
  updatedNodes[id].positionIndices.y = ry
  
  return updatedNodes
}



export const getValidMoves = (x, y, id, nodes) => {
  let nx = x;
  let ny = y;
  const validMoves = [1, 1, 1, 1]
  
  for (const nodeKey of Object.keys(nodes)) {
    const node = nodes[nodeKey]; 
    if (node.id !== id) {
      if (node.cellIndices.x + 2 === nx && Math.abs(node.cellIndices.y - ny) < 2 || nx === 0) {
        validMoves[0] = 0
      }
      if (node.cellIndices.x - 2 === nx && Math.abs(node.cellIndices.y - ny) < 2 || nx === 48) {
        validMoves[2] = 0
      }
      if (node.cellIndices.y + 2 === ny && (node.cellIndices.x - nx) < 2 || ny === 0) {
        validMoves[1] = 0
      }
      if (node.cellIndices.y - 2 === ny && Math.abs(node.cellIndices.x - nx) < 2 || ny === 16) {
        validMoves[3] = 0
      }

    }
  }

  return validMoves;
};



export const updateLinePosition = (x, y, id, lines) => {
  
  const updateLines = JSON.parse(JSON.stringify(lines))
  Object.keys(updateLines).forEach(line => {
    
    if (line.includes(id)) {
      if (updateLines[line].from === id) {
        updateLines[line].sx += x;
        updateLines[line].sy += y;
      } else {
        updateLines[line].ex += x;
        updateLines[line].ey += y; 
      }
      
    }
  })
  return updateLines
}




const getSize = (name, type, snap) => {
  const single = {
    x: snap, y: snap
  }
  const double = {
    x: snap, y: snap*2+10
  }
  const quads = {
    x: snap * 2 + 10, y: snap * 2 + 10
  }
  const nodeSizeData = {

    Core: {
      Destination: {...single},
      Gain: {...single},
      Transport:  {...single}
    },
    Source: {
      Oscillator: {...single },
      FatOscillator: {...double },
      PulseOscillator: {...double },
      PWMOscillator: {...double },
      Noise: {...single },
      AMOscillator:{...double },
      FMOscillator: {...double },
      LFO: {...single }
    }, 
    Instrument: {
      AMSynth: {...double},
      FMSynth: {...double},
      DuoSynth: {...quads},
      MembraneSynth: {...double},
      MetalSynth: {...double},
      MonoSynth: {...double},
      NoiseSynth: {...double},
      PluckSynth: {...double},
      PolySynth: {...double},
      Synth: {...single}
    },
    Effect: {
      AutoFilter: {...single},
      AutoPanner: {...single},
      AutoWah: {...double},
      BitCrusher: {...single},
      Chebyshev: {...single},
      Chorus: {...single},
      Distortion:{...single},
      FeedbackDelay: {...single},
      Freeverb: {...single}, 
      FrequencyShifter: {...single}, 
      JCReverb:{...single}, 
      MidSideEffect:{...single},
      Phaser:{...single},
      PingPongDelay:{...single},
      PitchShift:{...single},
      Reverb:{...single},
      StereoWidener:{...single},
      Tremolo:{...single},
      Vibrato:{...single},
    }, 
    Component : {
      AmplitudeEnvelope:{...single},
      Analyser:{...single},
      BiquadFilter:{...single},
      Channel:{...single},
      Compressor:{...single},
      Convolver:{...single},
      CrossFade:{...single},
      DCMeter:{...single},
      EQ3:{...single},
      Envelope:{...single},
      FFT:{...single},
      FeedbackCombFilter:{...single},
      Filter:{...single},
      Follower:{...single},
      FrequencyEnvelope:{...single},
      Gate:{...single},
      Limiter:{...single},
      LowpassCombFilter:{...single},
      Merge:{...single},
      Meter:{...single},
      MidSideCompressor:{...single},
      MidSideMerge:{...single},
      MidSideSplit:{...single},
      Mono:{...single},
      MultibandCompressor:{...single},
      MultibandSplit:{...single},
      OnePoleFilter:{...single},
      PanVol:{...single},
      Panner:{...single},
      Panner3D:{...single},
      PhaseShiftAllpass:{...single},
      Recorder:{...single},
      Solo:{...single},
      Split:{...single},
      Volume:{...single},
      Waveform:{...single},
    }, 
    Signal: {
      Abs:{...single},
      Add:{...single},
      AudioToGain:{...single},
      GainToAudio:{...single},
      GreaterThan:{...single},
      GreaterThanZero:{...single},
      Multiply:{...single},
      Negate:{...single},
      Pow:{...single},
      Scale:{...single},
      ScaleExp:{...single},
      Signal:{...single},
      Subtract:{...single},
      ToneConstantSource:{...single},
      WaveShaper:{...single},
      Zero:{...single},
    }
  }
  return nodeSizeData[type][name]
}




const getInputs = (name, type) => {
  const commonOscillatorParams = {
    frequency: null, 
    detune: null
  }

  const commonSynthParams = {
    ...commonOscillatorParams
  }
  const nodeInputData = {
    Core: {
      Destination: {
        node: [],
      }, 
      Gain: {
        gain: null, 
        node: [] 
      },
      Transport: null, 
    },
    Source: {
      AMOscillator: {
        harmonicity: null,
        ...commonOscillatorParams, 
        "modulator_detune": null
      }, 
      Oscillator: {
        ...commonOscillatorParams
      }, 
      FMOscillator: {
        ...commonOscillatorParams,
        harmonicity: null, 
        modulationIndex: null,
        "modulator_detune": null
      }, 
      FatOscillator: {
        ...commonOscillatorParams, 
        spread: null
      }, 
      LFO: {
        frequency: null, 
        amplitude: null, 
      }, 
      Noise: null, 
      PWMOscillator: {
        ...commonOscillatorParams, 
        modulationFrquency: null,
        "modulator_detune": null
      }, 
      PulseOscillator: {
        ...commonOscillatorParams, 
        width: null
      }
    }, Instrument: {
      AMSynth: {
        ...commonSynthParams, 
        modulation: null, 
        harmonicity: null, 
        trigger: null,
      }, 
      FMSynth: {
        ...commonSynthParams,
        harmonicity: null, 
        modulation: null, 
        modulationIndex: null, 
        trigger: null
      }, 
      MembraneSynth: {
        ...commonSynthParams, 
        trigger: null
      }, 
      MetalSynth: {
        ...commonSynthParams, 
        harmonicity: null, 
        modulationIndex: null,
        octaves: null, 
        trigger: null

      }, 
      MonoSynth: {
        ...commonSynthParams,
        filterFrequency: null,
        filterGain: null, 
        trigger: null
      }, 
      NoiseSynth: {
        ...commonSynthParams, 
        trigger: null
      }, 
      PluckSynth: {
        ...commonSynthParams, 
        resonance: null, 
        trigger: null
      }, 
      PolySynth: {
        ...commonSynthParams, 
        maxPolyphony: null, 
        trigger: null
      }, 
      DuoSynth: {
        ...commonSynthParams, 
        vibratoAmount: null, 
        vibratoRate: null,
        trigger: null
      }, 
      Synth: {
        ...commonSynthParams,
        trigger: null
      }      
    }, Effect: {
      AutoFilter: {
        frequency: null, 
        filterFrequency: null,
        filterGain: null, 
        wet: null,
        node: null,
      }, 
      AutoPanner: {
        frequency: null, 
        wet: null, 
        node: null,
      }, 
      AutoWah: {
        gain: null, 
        wet: null, 
        Q: null, 
        node: null,
      }, 
      BitCrusher: {
        bits: null, 
        wet: null, 
        node: null,
      }, 
      Chebyshev: {
        wet: null, 
        node: null,
      }, 
      Chorus: {
        feedback: null, 
        frequency: null, 
        wet: null,         
        node: null,
      }, 
      Distortion: {
        wet: null, 
        node: null,
      }, 
      FeedbackDelay: {
        feedback: null, 
        wet: null,
        node: null,
      }, 
      Freeverb: {
        roomSize: null, 
        dampening: null, 
        wet: null, 
        node: null,
      },
      FrequencyShifter: {
        frequency: null, 
        wet: null, 
        node: null,
      },
      JCReverb: {
        roomSize: null, 
        wet: null,
        node: null,
      },
      MidSideEffect: {
        wet: null, 
        node: null,
      },
      Phaser: {
        Q: null, 
        octaves: null, 
        wet: null, 
        frequency: null,
        node: null,
      },
      PingPongDelay: {
        feedback: null, 
        wet: null, 
        node: null,
      },
      PitchShift: {
        feedback: null, 
        wet: null,
        node: null,
      },
      Reverb: {
        wet: null, 
        node: null,
      }, 
      StereoWidener: {
        width: null, 
        wet: null,
        node: null,
      },
      Tremolo: {
        depth: null, 
        wet: null,
        frequency: null, 
        node: null,
      },
      Vibrato: {
        frequency: null,
        depth: null, 
        wet: null,
        node: null,
      },
    }, 
      Component: {
        AmplitudeEnvelope: {trigger: null, node: null},
        Analyser: {node: null,}, 
        BiquadFilter: {node: null,}, 
        Channel:{
          pan: null,node: null,
        }, 
        Compressor:{
          knee: null, ratio: null, node: null,
        }, 
        Convolver: {
          node: null
        },
        CrossFade:{fade: null, a: null, b: null}, 
        DCMeter:{node: null,},
        EQ3:{Q: null, low: null, mid: null, high: null, node: null},
        Envelope:{node: null}, 
        FFT: {node: null},
        FeedbackCombFilter: {resonance: null,node: null},
        Filter: {frequency:null, gain: null, Q: null,}, 
        Follower: {node: null},
        FrequencyEnvelope: {trigger:null, node: null},
        Gate: {node: null}, 
        Limiter:{node: null},
        LowpassCombFilter: {resonance: null, node: null}, 
        Merge: {node: null}, 
        Meter: {node: null},
        MidSideCompressor: {knee: null, ratio: null,node: null}, 
        MidSideMerge: {node: null}, 
        MidSideSplit: {node: null}, 
        Mono: {node: null}, 
        MultibandCompressor: {low: null, mid:null, high: null,node: null},
        MultibandSplit: {low: null, mid: null, high: null, Q:null,node: null}, 
        OnePoleFilter: {frequency: null,node: null}, 
        PanVol: {pan: null, volume: null,node: null},
        Panner: {pan: null, node: null},
        Panner3D: {
          coneInnerAngle: null,
          coneOuterAngle: null, 
          coneOuterGain: null,
          orientationX: null,
          orientationY: null,
          orinetationZ: null,
          positionX: null, 
          positoinY: null,
          positoinZ: null,
          node: null}, 
        PhaseShiftAllpass: {offset90: null, node: null}, 
        Recorder: {node: null},
        Solo: {node: null}, 
        Split: {node: null},
        Volume: {node: null}, 
        Waveform: {node: null}
      }, 
      Signal: {
        Abs: {node: null}, 
        Add: {addend: null, node: null}, 
        AudioToGain: {node: null}, 
        GainToAudio: {node: null}, 
        GreaterThan: {node: null},
        GreaterThanZero: {node: null},
        Multiply: {factor: null, node: null},
        Negate: {node: null},
        Pow: {node: null}, 
        Scale: {node: null},
        ScaleExp: {node: null}, 
        Signal: {node: null}, 
        Subtract: {subtrahend: null, node: null}, 
        ToneConstantSource: {node: null}, 
        WaveShaper: {node: null},
        Zero: {node: null}
      }
    
  }

  return nodeInputData[type][name]
}

