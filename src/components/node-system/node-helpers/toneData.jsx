import * as Tone from "tone"


export const addToneObject = (id, name, type, tones) => {

  if (name === "Analyser") {
    const newToneObject = { 
      id, 
      name, 
      type,
      isTriggerConnected: false,
      tone: {x: getToneObject(name), y: getToneObject(name)},
      parameters: getNodeParameters(name, type),
    }  
    return {...tones, [id]: newToneObject}
  } else {

    const newToneObject = { 
      id, 
      name, 
      type,
      isTriggerConnected: false,
      tone: getToneObject(name),
      parameters: getNodeParameters(name, type),
    }  
  
    return {...tones, [id]: newToneObject}
  }
}



export const invokeTriggerEvent = (notes, durations, probabilities, instruments, bpm, tones) => {
  if (!Array.isArray(notes)) return 
  let noteDuration = 60 / (bpm * notes.length)
  
  notes.forEach((note, index) => {
    setTimeout(() => {
      if (Math.random() < probabilities[index]) {
        instruments.forEach((instrument, i) => {
          if (tones[instrument].name === "NoiseSynth" || tones[instrument].name.includes("Envelope")) {
            tones[instrument].tone.triggerAttackRelease( noteDuration * durations[index])
          } else if (tones[instrument].name.includes("Oscillator")) {
            tones[instrument].tone.frequency.rampTo(note, noteDuration * durations[index])
          }
          
          else {
            tones[instrument].tone.triggerAttackRelease(note, noteDuration * durations[index])
          }
        })
      }
    }, index * noteDuration * 1000)
  })
};

export const connectToneObjects = (from, to, which, nodes) => {
  if (from.includes("Transport")) {
    const newTone = {
      ...nodes, 
      [to]: {...nodes[to], isTriggerConnected: true}
    }
    return newTone
  }
  if (to.includes("Analyser")) {

    nodes[from].tone.connect(nodes[to].tone[which])
  
  }

  
  if (which === "node") {
    if (nodes[to].name !== "Destination") {
      nodes[from].tone.connect(nodes[to].tone)
    } else {
      nodes[from].tone.toDestination()
    }
  } else if (which === "trigger") {
    
  } else {
    if (which.includes("modulator")) {
      nodes[from].tone.connect(nodes[to].tone._modulator[which.split("_")[1]])
    } else {
      nodes[from].tone.connect(nodes[to].tone[which])
    }
  } 

}

export const disposeToneNode = (id, tones, nodes) => {
  if (!tones[id].tone) return
  if (tones[id].name === "Destination") {
    nodes[id].connection.forEach(fromId => {
      const fID = fromId.split(">")[0]
      tones[fID].tone.disconnect(tones[id].tone)
    })
  }
  if (tones[id].name === "Analyser") {
    tones[id].tone.x.dispose()
    tones[id].tone.y.dispose()
  } else if (tones[id].name !== "Destination") {
    tones[id].tone.dispose()
  }
}

export const disconnectToneNode = (from, to, which, nodes) => {
  if (from.includes("Transport")) return 
  console.log(`tone disconnection from ${from} to ${to}`)
  if (which === "node") {
    nodes[from].tone.disconnect(nodes[to].tone)
  } else if (which === "trigger"){

  } else {
    nodes[from].tone.disconnect(nodes[to].tone[which])
  }
}

export const getToneObject = ( nodeName ) => {
  switch (nodeName) {
    case "Clock":
      return {bpm: 120, timeSignature: 4}
    case "Gain":
      return new Tone.Gain(.5)
    case "Oscillator":
      return new Tone.Oscillator(440, "sine")
    case "AMOscillator":
        return  new Tone.AMOscillator(263.61, "sine") 
    case "FMOscillator":
        return  new Tone.FMOscillator(263.61, "sine") 
    case "FatOscillator":
      return new Tone.FatOscillator(440, "sine", 40)
    case "LFO":
      return  new Tone.LFO(1, 1, 1000) 
    case "Noise":
      return  new Tone.Noise("pink") 
    case "PWMOscillator":
      return  new Tone.PWMOscillator(440, .1) 
    case "OmniOscillator":
      return  new Tone.OmniOscillator(263.61, "pwm")
    case "PulseOscillator":
      return  new Tone.PulseOscillator(263.61, .1)
    case "AMSynth":
      return new Tone.AMSynth()
    case "Synth":
      return  new Tone.Synth()
    case "FMSynth":   
      return new Tone.FMSynth()
    case "DuoSynth":
      return new Tone.DuoSynth()
    case "AutoFilter":
      return  new Tone.AutoFilter(1, 263.61, 1) 
    case "AutoPanner":
      return  new Tone.AutoPanner("1n") 
    case "BitCrusher":
      return  new Tone.BitCrusher(1)
    case "Chebyshev":
      return  new Tone.Chebyshev(1)
    case "Chorus":
      return  new Tone.Chorus(1, .25, 1)
    case "Distortion":
      return  new Tone.Distortion(0)
    case "FrequencyShifter": 
      return  new Tone.FrequencyShifter(0)
    case "PitchShift":
      return  new Tone.PitchShift(0)
    case "Abs":
      return  new Tone.Abs()
    case "Add":
      return  new Tone.Add()
    case "AudioToGain":
      return  new Tone.AudioToGain()
    case "GainToAudio":
      return  new Tone.GainToAudio()
    case "GreaterThan":
      return  new Tone.GreaterThan(0)
    case "GreaterThanZero":
      return  new Tone.GreaterThanZero()
    case "Multiply":
      return  new Tone.Multiply(1)
    case "Negate":
      return  new Tone.Negate()
    case "Pow":
      return  new Tone.Pow(1)
    case "Scale":
      return  new Tone.Scale(0, 1)
    case "ScaleExp":
      return  new Tone.ScaleExp(0, 1, 1)
    case "Signal":
      return  new Tone.Signal(440, "frequency")
    case "Subtract":
      return  new Tone.Subtract(0)
    case "AmplitudeEnvelope":
      return  new Tone.AmplitudeEnvelope(.1, .2, .5, .6)
    case "Analyser": 
      return  new Tone.Analyser("waveform", 128)
    case "Channel": 
      return  new Tone.Channel(12, 0)
    case "Compressor": 
      return  new Tone.Compressor(-12, 5)
    case "CrossFade": 
      return  new Tone.CrossFade(0)
    case "EQ3": 
      return  new Tone.EQ3(0, 0, 0)
    case "Envelope": 
      return  new Tone.Envelope(.1, .2, .5, .6)
    case "FeedbackCombFilter": 
      return  new Tone.FeedbackCombFilter(.1, .2)
    case "Filter": 
      return  new Tone.Filter(263.61, "lowpass")
    case "Follower": 
      return  new Tone.Follower()
    case "FrequencyEnvelope": 
      return  new Tone.FrequencyEnvelope(.1, .2, .5, .6)
    case "Limiter": 
      return  new Tone.Limiter(-12)
    case "AutoWah": 
      return  new Tone.AutoWah(123, 1)
    case "FeedbackDelay": 
      return  new Tone.FeedbackDelay(.25, .5)
    case "Freeverb": 
      return  new Tone.FeedbackDelay(.5, .5)
    case "Phaser": 
      return  new Tone.Phaser(263.6, 0, 263.6)
    case "PingPongDelay": 
      return  new Tone.PingPongDelay(.25, .5)
    case "Reverb": 
      return  new Tone.Reverb(.78)
    case "Tremolo": 
      return  new Tone.Tremolo(5, 1)
    case "Vibrato": 
      return  new Tone.Vibrato(5, 1)
    case "MembraneSynth": 
      return  new Tone.MembraneSynth()
    case "MetalSynth": 
      return  new Tone.MetalSynth()
    case "NoiseSynth": 
      return  new Tone.NoiseSynth()
    case "PluckSynth": 
      return  new Tone.PluckSynth()
    case "MonoSynth":
      return new Tone.MonoSynth()
    case "WaveShaper":
      return new Tone.WaveShaper()
    case "Gate":
      return new Tone.Gate()
    case "PanVol":
      return new Tone.PanVol()
    case "Panner":
      return new Tone.Panner()
    case "Recorder": 
      return new Tone.Recorder()
    default:
      return null; // Return null for unknown node types or if no tone object is provided
  }
}

export const getNodeParameters = (name, type) => {
  if (name === "Destiantion") {
    return null
  }


  if (name === "Trigger") return null

  const commonOscParams = {
      start: false,
      type: "sine",
      detune: 0,
      frequency: 440,
      partialCount: 0,
      partials: 0,
    
  }

  const {frequency, start, ...commonModulatorParams} = commonOscParams
  commonModulatorParams.type = "square"
  const {detune, ...forfm} = commonModulatorParams

  const nodeParams = {
    Core: {
      Destination: null,
      Transport: {
        bpm: 120,
        probabilities: Array(8).fill([1]), 
        durations: Array(8).fill([1]), 
        strides: Array(8).fill(0), 
        lengths: Array(8).fill([1]), 
        keys: Array(8).fill(["C1"]),
        positions: Array.from(Array(8).keys())
      },
      Gain: {gain: .5}
    },

    Source: {
      Oscillator: {
        ...commonOscParams
      }, 
      FatOscillator: {
        ...commonOscParams,
        spread: 0,
        count: 1
      },
      PWMOscillator: {
        start: false,
        detune: 0,
        frequency: 440, 
        modulationFrequency: 220, 
      },
      PulseOscillator: {
        start: false,
        detune: 0,
        frequency: 440,
        width: 0
      },
      Noise: {
        start: false,
        type: "pink"
      },
      AMOscillator: {
        ...commonOscParams,
        harmonicity: 1,
        modulationType: "square", 
        modulator: {...commonModulatorParams}
      },
      FMOscillator: {
        ...commonOscParams, 
        harmonicity: 1,
        modulationIndex: 1,
        modulationType: "square",
        modulator: {...forfm}
      }, 

      LFO: {
        start: false,
        frequency: 1,
        min: -1,
        max: 1,
        amplitude: 1,
        type: "sine"
      },      
    }, 
  }

  const omniModNodeParams = {
      Oscillator: {
        type: "sine"
      }, 
      FatOscillator: {
        type: "sine",
        spread: 0,
        count: 1
      },
      PWMOscillator: {
        
        
      },
      PulseOscillator: {
        

      },
      AMOscillator: {
        type: "sine",
        modulationType: "square", 
        modulator: true
      },
      FMOscillator: {
        type: "sine",
        modulationType: "square",
        modulator: true

      },       
  }
    
  
  
  const OmniOscillator = {
    osc: {...nodeParams.Source.Oscillator}, 
    fat: {...nodeParams.Source.FatOscillator},
    pwm: {...nodeParams.Source.PWMOscillator}, 
    pulse: {...nodeParams.Source.PulseOscillator}, 
    am: {...commonOscParams, 
      harmonicity: 1, 
      modulationType: "square",
      modulator: true,

    }, 
    fm: {
      ...commonOscParams, 
      harmonicity: 1, 
      modulationIndex: 1,
      modulationType: "square",
      modulator: true
    },
  }

  const omniModOscillator = {
    osc: {...omniModNodeParams.Oscillator},
    fat: {...omniModNodeParams.FatOscillator},
    am: {...omniModNodeParams.AMOscillator},
    fm: {...omniModNodeParams.FMOscillator},
    pwm: {...omniModNodeParams.PWMOscillator},
    pulse: {...omniModNodeParams.PulseOscillator},
  }

  const envelope = {
    attack: .1, 
    attackCurve: "linear", 
    decay: .2,
    decayCurve: "linear",
    sustain: .5, 
    release: .6,
    releaseCurve: "linear",
    
  }

  const commonSynthParams = {
    type: "sine",
    frequency: 440, 
    detune: 0, 
    portamento: 0,
    
  }

  const commonModSynthParams = {
    type: "square", 
  }

  const filterParams = {
    gain: .5, Q: 1,frequency: 440, rolloff: 0, type: "filterTypes"
  }
  
  const monoSynthParams = {
    ...commonSynthParams,  
    filter: {...filterParams}, 
    filterEnvelope: {...envelope}
  }

  const InstrumentParams = {
    Synth: {
      synth: {...commonSynthParams},
      oscillatorType: "osc",
      oscillator: {...OmniOscillator},
      envelope: {...envelope},
      }, 
      MonoSynth: {
        synth: {...monoSynthParams},
        envelope: {...envelope},
        oscillator: {...OmniOscillator},
        oscillatorType: "osc"
      }, 
      MembraneSynth: {
        synth: {...commonSynthParams, octaves: 1, pitchDecay: .05}, 
        envelope: {...envelope},
        oscillator: {...OmniOscillator}
      }, 
      DuoSynth: {
        voice0: {...monoSynthParams, vibratoAmount: .5, vibratoRate: 40},
        voice1: {...monoSynthParams},
        envelope: {...envelope},
        modulationEnvelope: {...envelope},
        oscillator0: {...OmniOscillator},
        oscillator1: {...OmniOscillator},
        oscillatorType: "osc",
        modulationType: "osc"
      }, 
      PluckSynth: {
        synth: {
          attackNoise: .1, 
          dampening: 1000, 
          resonance: .5
       }
      }, 
      NoiseSynth: {
        synth: {},
        envelope: {...envelope}, 
        noiseTypes: ["brown", 'pink', "white"],
        noiseType: "white"
      }, 
      FMSynth: {
        synth: {...commonSynthParams, harmonicity: 1, modulationIndex: 1, modulationType: "square"}, 
        modulatorSynth: {...commonModSynthParams},
        envelope: {...envelope},
        modulationEnvelope: {...envelope},
        oscillator: {...OmniOscillator},  
        modulator: {...omniModOscillator}, 
        oscillatorType: "osc",
        modulationType: "osc", 
      }, 
      
      AMSynth: {
        synth: {...commonSynthParams, harmonicity: 1},
        modulatorSynth: {...commonModSynthParams},
        oscillator:{...OmniOscillator},
        envelope: {...envelope},
        modulationEnvelope: {...envelope},
        modulator: {...omniModOscillator},
        oscillatorType: "osc",
        modulationType: "osc",
      }, 
      MetalSynth:{
        synth: {...commonSynthParams, modulationIndex: 1, octaves: 1, harmonicity: 1}, 
        envelope: {...envelope},
      },

      PolySynth: {
        maxPolyphony: 1, 
        volume: 0, 
        oscillatorType: "osc"
      }, 
     
    }
    const EffectParams = {
      AutoFilter: {start: false, depth: 0.5, ...filterParams, octaves: 4, baseFrequency: 440, frequency: 220, wet: 1},
      AutoPanner: {start: false, depth: 0, frequency: 440, wet: 1},
      AutoWah: {
        baseFrequency: 440, 
        follower: 0, 
        gain: .5, 
        octaves: 1, 
        Q: 1, 
        sensitivity: 0,
        wet:1
      }, 
      BitCrusher: {bits: 1, wet:1},
      Chebyshev: {order: 1, wet:1},
      Chorus: {start: false, delayTime: .2, depth: 0.5, feedback: .2, frequency: 440, sperad: 0, wet:1}, 
      Distortion: {distortion: 1, wet:1},
      FeedbackDelay: {delayTime: .25, feedback: .5, wet:1},
      Freeverb:{dampening: .2, roomSize: .5, wet: 1},
      FrequencyShifter: {frequency: 440, wet: 1}, 
      JCReverb: {roomSize: .5, wet: 1},
      MidSideEffect: {wet: 1},
      Phaser: {baseFrequency: 440, frequency: 220, octaves: 1, Q: 1, wet: 1},
      PingPongDelay: {delayTime: .2, feedback: .2, wet: 1},
      PitchShift: {delayTime: .2, feedback: .2, pitch: 0, windowSize: .03},
      Reverb: {decay: .2, preDelay: 0, wet: 1},
      StereoWidener: {width: 0, wet: 1},
      Tremolo: {start:false, depth: .2, frequency: 440, spread: 0, wet: 1},
      Vibrato: {start:true, depth:.2, frequency: 1, wet: 1},

    }
    const ComponentParams = {
      AmplitudeEnvelope: {envelope: {...envelope}},
      Analyser: {size: 128, smoothing: 0, type: "fft"},
      BiquadFilter: {
        detune: 0, 
        gain: .5, 
        frequency: 440,
        Q: 1, 
        type: "lowpass"
      },
      Channel: {
        pan: 0, 
      },
      Compressor: {
        knee: 0,
        ratio: 1, 
        
        release: .2, 
        threshold: 0
      },
    
      EQ3: {low: 0, lowFrequency: 120, mid: 0, high: 0, highFrequency: 4096, Q: 1},
      Envelope: {envelope: {...envelope}},
      FFT: {normalRange: true, smoothing: 0},
      FeedbackCombFilter: {delayTime: .2, resonance: .5},
      Filter: {...filterParams},
      Follower: {smoothing: 0},
      FrequencyEnvelope: {envelope : {...envelope}, octaves: 1, baseFrequency: 120, exponent: 1},
      Gate: {smoothing: 0, threshold: 0},
      Limiter: {threshold: 0},
      LowpassCombFilter: {dampening: .2, delayTime: .2, resonance: 2.},
      Merge: {},
      Meter: {},
      MidSideCompressor: {},
      MidSideMerge: {},
      MidSideSplit: {},
      Mono: {},
      MultibandCompressor: {
        high: 0, 
        highFrequency: 4096, 
        mid: 0, 
        low: 0, 
        lowFrequency: 120
      },
      MultibandSplit: {
        low: 0, 
        lowFrequency: 120, 
        mid: 0, 
        high: 0, 
        highFrequency: 4096, 
        Q: 1,
      },
      OnePoleFilter: {frequency: 440, type: "lowpass"},
      PanVol: {pan: 0, volume: 0},
      Panner: {pan: 0},
      Panner3D: {
        coneInnerAngle: 0, 
        coneOuterAngle: 0, 
        coneOuterGain: 0, 
        distanceModel: "linear", 
        maxDistance: 1,
        orientationX: 1,
        orientationY: 1,
        orientationZ: 1,
        panningModel: "equalpower", 
        positionX: 0,
        positionY: 0,
        positionZ: 0, 
        rolloffFactor: .1, 
      },
      PhaseShiftAllpass: {offset90: .5},
      Recorder: {start: false },
      Solo: {},
      Split: {},
      Volume: {volume: 0},
      Waveform: {},
    } 
   
    const SignalParams = {
      
      Abs: {},
      Add: {addend: 0},
      AudioToGain: {},
      GainToAudio: {},
      GreaterThan: {comparator: 0},
      GreaterThanZero: {},
      Multiply: {factor: 1},
      Negate: {},
      Pow: {value: 1},
      Scale: {min: -1, max:1},
      ScaleExp: {min: -1, max: 1, exponent: 1},
      Signal: {},
      Subtract: {subtrahend: 0},
      ToneConstantSource: {curve: new Float32Array()},
      WaveShaper: {},
      Zero: {},


    }



  if (name === "OmniOscillator") {
    return OmniOscillator
  }
  if (type === "Instrument") {
    return InstrumentParams[name]
  }
  if (type === "Effect") {
    return EffectParams[name]
  }
  if (type === "Component") {
    return ComponentParams[name]
  }
  if (type === "Signal") {
    return SignalParams[name]
  }


  return nodeParams[type][name]
}  

// complete the states


export const initialStates = { 
    attack:             {type: "slider",  min: 0.01,        max: 1,      multiplier: .01 ,   float: true ,  unit: null, abbreviate: "a"   },
    decay:              {type: "slider",  min: 0.01,        max: 1,      multiplier: .01 ,   float: true ,  unit: null, abbreviate: "d"   },
    sustain:            {type: "slider",  min: 0.01,        max: 1,      multiplier: .01 ,   float: true ,  unit: null, abbreviate: "s"   },
    release:            {type: "slider",  min: 0,        max: 1, multiplier: .01,  float: true ,  unit: null, abbreviate: "r"   },
    detune:             {type: "slider",  min: -1200,  max: 1200,   multiplier:  1   ,  float: false,  unit: "cents"   },
    portamento:         {type: "slider",  min: 0,      max: 1,      multiplier: .001 ,  float: true ,  unit: null   },
    frequency:          {type: "slider",  min: 1,      max: 8192,   multiplier: 1    ,  float: false,  unit: "Hz"   },
    phase:              {type: "slider",  min: 0,      max: 360,    multiplier: 1    ,  float: false,  unit: "\u00b0"   },
    modulationFrequency:{type: "slider",  min: .1,     max: 440,    multiplier: .1   ,  float: true ,  unit: "Hz", abbreviate: "modFreq"  },
    distortion:         {type: "slider",  min: 0.01,        max: 1,      multiplier: .01 ,   float: true ,  unit: null   },
    pitchDecay:         {type: "slider",  min: 0,      max: .5,      multiplier: .001 ,  float: true ,  unit: null   },
    harmonicity:        {type: "slider",  min: .1,     max: 10,     multiplier: .001 ,  float: true ,  unit: "mf/cf"   },
    octaves:            {type: "slider",  min: 0.5,      max: 8,      multiplier: .001 ,  float: true ,  unit: null   },
    width:              {type: "slider",  min: -.98,     max: .98,      multiplier: .01  ,  float: true ,  unit: null   },
    spread:             {type: "slider",  min: 0,  max: 100,    multiplier: 1    ,  float: false,  unit: null   },
    partialCount:       {type: "slider",  min: 0,      max: 24,     multiplier: 1    ,  float: false,  unit: null   },
    gain:               {type: "slider",  min: 0.01,      max: 1,      multiplier: 0.01 ,  float: true ,  unit: null, abbreviate: "g"},
    count:              {type: "slider",  min: 1,      max: 12,     multiplier: 1    ,  float: false,  unit: null   },
    resonance:          {type: "slider",  min: 0,      max: .99,      multiplier:  .01   ,  float: true,  unit: null   },
    modulationIndex:    {type: "slider",  min: 1,      max: 100,    multiplier:  1   ,  float: false,  unit: null   },
    dampening:          {type: "slider",  min: 1,      max: 7000,   multiplier:  1   ,  float: false,  unit: null   },
    baseFrequency:      {type: "slider",  min: 20,     max: 8192,   multiplier: 1    ,  float: false,  unit: "Hz"   },
    attackCurve:        {type: "select",  value: ["linear", "exponential", "sine", "cosine", "bounce", "ripple", "step"]},
    releaseCurve:       {type: "select",  value: ["linear", "exponential", "sine", "cosine", "bounce", "ripple", "step"]},
    decayCurve:         {type: "select",  value: ["linear", "exponential"]},
    pan:                {type: "slider",  min: -1,     max: 1,     multiplier:  .01 ,  float: true ,  unit: null   },
    knee:               {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    ratio:              {type: "slider",  min: 1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    threshold:          {type: "slider",  min: -100,     max: 0,     multiplier:  .01 ,  float: true ,  unit: null   },
    sensitivity:        {type: "slider",  min: -96,    max: 96,     multiplier:   1 ,   float: false , unit: "db"   },
    pitch:              {type: "slider",  min: -96,    max: 96,     multiplier:   1 ,   float: false , unit: null   },
    order:              {type: "slider",  min:  1,    max: 100,     multiplier:   1 ,   float: false , unit: null   },
    Q:                  {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    low:                {type: "slider",  min: -48,     max: 48,     multiplier:  1 ,  float: false ,  unit: "db"   },
    lowFrequency:       {type: "slider",  min: .1,     max: 1200,     multiplier:  1 ,  float: false ,  unit: "Hz"   },
    mid:                {type: "slider",  min: -48,     max: 48,     multiplier:  1 ,  float: false ,  unit: "db"   },
    high:               {type: "slider",  min: -48,     max: 48,     multiplier:  1 ,  float: false ,  unit: "db"   },
    highFrequency:      {type: "slider",  min: 1200,     max: 8196,     multiplier:  1 ,  float: false ,  unit: "Hz"   },
    delayTime:          {type: "slider",  min: .1,     max: 1,     multiplier:  .01 ,  float: true ,  unit: null   },
    reduction:          {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    normalize:          {type: "boolean", min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    fade:               {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    smoothing:          {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    type:               {type: "select",  value: ["sine", "square", "sawtooth", "triangle"]},
    coneInnerAngle:     {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    coneOuterAngle:     {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    coneOuterGain:      {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    distanceModel:      {type: "select",  value: ["linear", "inverse", "exponential"]},
    maxDistance:        {type: "slider",  min: 1,     max: Infinity, multiplier:  1 ,  float: false ,  unit: "cm"   },
    addend:             {type: "slider",  min: -Infinity,     max: Infinity, multiplier:  .1 ,  float: true ,  unit: null, abbreviate: "+"   },
    subtrahend:         {type: "slider",  min: -Infinity,     max: Infinity, multiplier:  .1 ,  float: true ,  unit: null, abbreviate: "-"   },
    factor:             {type: "slider",  min: -Infinity,     max: Infinity, multiplier:  .1 ,  float: true ,  unit: null, abbreviate: "x"  },
    value:              {type: "slider",  min: -Infinity,     max: Infinity, multiplier:  .1 ,  float: true ,  unit: null, abbreviate: "val"  },
    min:                {type: "slider",  min: -Infinity,     max: Infinity, multiplier:  .1 ,  float: true ,  unit: null, abbreviate: "mn"  },
    max:                {type: "slider",  min: -Infinity,     max: Infinity, multiplier:  .1 ,  float: true ,  unit: null, abbreviate: "mx"  },
    exponent:           {type: "slider",  min: -Infinity,     max: Infinity, multiplier:  .1 ,  float: true ,  unit: null, abbreviate: "^"  },
    comparator:         {type: "slider",  min: -Infinity,     max: Infinity, multiplier:  .1 ,  float: true ,  unit: null, abbreviate: ">?"   },
    panningModel:       {type: "select",  value: ["equalpower, HRTF"]},
    noise:              {type: "select",  value: ["pink", "brown", "white"]},
    rolloffFactor:      {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    bits:               {type: "slider",  min: 1,      max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    wet:                {type: "slider",  min: 0,      max: 1,      multiplier:   .01 , float: true  , unit: null   },
    feedback:           {type: "slider",  min: 0,      max: 1,      multiplier:   .01 , float: true  , unit: null   },
    stride:             {type: "slider",  min: 0,     max: 8,      multiplier:   1 ,   float: false , unit: "x", abbreviate: "s"   },
    vibratoAmount:      {type: "slider",  min: 0,      max: 1,      multiplier:   .01 , float: true  , unit: null   },
    vibratoRate:        {type: "slider",  min: 1,      max: 8192,   multiplier: 1    ,  float: false,  unit: "Hz"   },
    depth:              {type: "slider",  min: 0,      max: 1,      multiplier:   .01 , float: true  , unit: null   },
    bpm:                {type: "slider",  min: 1,      max: 999,    multiplier:   1 ,   float: false,  unit: "bpm"  },
    lengths:            {type: "slider",  min: 1,      max: 8,      multiplier:   1 ,   float: false , unit: null, abbreviate: "l"   },
    probabilities:      {type: "slider",  min: 0,      max: 1,      multiplier:   .01 , float: true  , unit: null, abbreviate: "p"},
    durations:          {type: "slider",  min: 0,      max: 1,      multiplier:   .01 , float: true  , unit: null, abbreviate: "d"   },
    sequenceLength:     {type: "slider",  min: 0,      max: 1,      multiplier:   .01 , float: true  , unit: null, abbreviate: "sl"   },
    orientationX:       {type: "slider",  min: -Infinity, max: Infinity,     multiplier:  1 ,  float: false ,  unit: "cm"   },
    orientationY:       {type: "slider",  min: -Infinity, max: Infinity,     multiplier:  1 ,  float: false ,  unit: "cm"   },
    orientationZ:       {type: "slider",  min: -Infinity, max: Infinity,     multiplier:  1 ,  float: false ,  unit: "cm"   },
    positionX:          {type: "slider",  min: -Infinity, max: Infinity,     multiplier:  1 ,  float: false ,  unit: "cm"   },
    positionY:          {type: "slider",  min: -Infinity, max: Infinity,     multiplier:  1 ,  float: false ,  unit: "cm"   },
    positionZ:          {type: "slider",  min: -Infinity, max: Infinity,     multiplier:  1 ,  float: false ,  unit: "cm"   },
    filterTypes:        {type: "select",  value: ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"]},
}

export const LFOStates = {
                  frequency:          {type: "slider",   min: .1,        max: 1000,     multiplier: .1      , float: true   },
                  min:                {type: "slider",   min: -10000,    max: 10000,  multiplier: 1       , float: false  },
                  max:                {type: "slider",   min: -10000,    max: 10000,  multiplier: 1       , float: false  },
                  amplitude:          {type: "slider",   min: .001,      max: 1,      multiplier: .001    , float: true   },
                  type:               {type: "select",   value: ["sine", "square", "sawtooth", "triangle"]},
}

