import * as Tone from "tone"

export const triggerEvents = () => {
  console.log("started")
  Tone.Transport.start()
}
export const stopEvents = () => {
  console.log("stopped")
  Tone.Transport.stop()
}
export const addToneObject = (id, name, type, tones) => {
  const newToneObject = {
    id, 
    name, 
    type,
    tone: getToneObject(name),
    parameters: getNodeParameters(name, type)
  }  

  return {...tones, [id]: newToneObject}
}

export const invokeTriggerEvent = (triggerData, nodes) => {
  if (!triggerData.instruments || triggerData.instruments.length <= 0) {
    return
  }
  if (triggerData.notes) {
    let noteDuration = (60 / triggerData.bpm)
    const instruments = nodes.filter(node => triggerData.instruments.includes(node.id));
    if (Array.isArray(triggerData.notes)) {
      noteDuration /= triggerData.notes.length

      if (instruments.length > 1) {
        for (let i = 0; i < triggerData.notes.length; i++) {
          setTimeout(() => {
            instruments.forEach(instrument => {
              instrument.Tone.triggerAttackRelease(triggerData.notes[i], noteDuration);
            })
          }, i * noteDuration * 1000); 
        } 
      } else {
        for (let i = 0; i < triggerData.notes.length; i++) {
          setTimeout(() => {
            instruments[0].Tone.triggerAttackRelease(triggerData.notes[i], noteDuration);
          }, i * noteDuration * 1000); 
        }
      }

    } else {
      if (instruments.length > 1) {
        console.log(instruments)
        instruments.forEach((instrument) => {
          instrument.Tone.triggerAttackRelease(triggerData.notes, noteDuration)
        })
      } else {
        instruments[0].Tone.triggerAttackRelease(triggerData.notes, noteDuration);
      }
    }
  }
};

export const connectToneObjects = (from, to, nodes) => {

  
  if (nodes[to].name !== "Destination") {
    nodes[from].tone.connect(nodes[to].tone)
  } else {
    nodes[from].tone.toDestination()
  }
}

export const disposeToneNode = (id, tones) => {
  if (tones[id].name !== "Destination") {
    tones[id].tone.dispose()
  }
}

export const disconnectToneNode = (from, to, nodes) => {
  console.log(`tone disconnection from ${from} to ${to}`)
  nodes[from].tone.disconnect(nodes[to].tone)
}

export const getToneObject = (nodeName ) => {
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
      return  new Tone.Follower(.25)
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
      return  new Tone.MembraneSynth({pitchDecay: 0})
    case "MetalSynth": 
      return  new Tone.MetalSynth()
    case "NoiseSynth": 
      return  new Tone.NoiseSynth()
    case "PluckSynth": 
      return  new Tone.PluckSynth()
    default:
      return null; // Return null for unknown node types or if no tone object is provided
  }
}

export const getNodeParameters = (name, type) => {
  console.log(name)
  if (name === "Destiantion" || name === "Transporter") {
    return null
  }

  const commonOscParams = {
      start: false,
      type: "sine",
      detune: 0,
      frequency: 440,
      phase: 0,
      partialCount: 0,
      partials: 0,
    
  }

  const commonSynthesizerParameters = {
    
  }

  

  const nodeParams = {

    Core: {
      Destination: null,
      Transporter: null,
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
        ...commonOscParams, 
        modulationFrequency: 220, 
      },
      PulseOscillator: {
        ...commonOscParams, 
        width: 0
      },
      Noise: {
        noise: null
      },
      AMOscillator: {
        ...commonOscParams,
        harmonicity: 1,
        modulationType: "square", 
      },
      FMOscillator: {
        ...commonOscParams, 
        harmonicity: 1,
        modulationIndex: 1,
        modulationType: "sine"
      }, 

      LFO: {
        frequency: 0,
        min: -10000,
        max: 10000,
        amplitude: 1,
      },      
    }, 
  }
  
  const OmniOscillator = {
    osc: {...nodeParams.Source.Oscillator}, 
    fat: {...nodeParams.Source.FatOscillator},
    pwm: {...nodeParams.Source.PWMOscillator}, 
    pulse: {...nodeParams.Source.PulseOscillator}, 
    am: {...nodeParams.Source.AMOscillator}, 
    fm: {...nodeParams.Source.FMOscillator},
  }

  const envelope = {
    attack: .1, 
    decay: .2,
    sustain: .5, 
    release: .6,
  }

  const commonSynthParams = {
    frequency: 440, 
    detune: 0, 
    envelope: {...envelope},
    portamento: 0,
    oscillator: {...OmniOscillator},
    volume: 0, 
  }

  const filterParams = {
    gain: .5, Q: 10,frequency: 440, rolloff: 0, type: "lowpass"
  }
  
  const monoSynthParams = {
    ...commonSynthParams,  
    filter: {...filterParams}, 
    filterEnvelope: {...envelope}
  }

  const InstrumentParams = {
      AMSynth: {
        ...commonSynthParams,
        envelope: {...envelope},
        modulationEnvelope: {...envelope},
        modulation: {...OmniOscillator},
      }, 
      Synth: {
        ...commonSynthParams
      }, 
      DuoSynth: {
        voice0: {...monoSynthParams},
        voice1: {...monoSynthParams}
      }, 
      FMSynth: {
        ...commonSynthParams, 
        modulationIndex: 1, 
        envelope: {...envelope},
        modulationEnvelope: {...envelope},  
        modulation: {...commonOscParams}
      }, 
      MembraneSynth: {
        ...commonSynthParams, 
        octaves: 1, 
        pitchDecay: 0, 
      }, 
      MetalSynth:{
        ...commonSynthParams, 
        modulationIndex: 1, 
        octaves: 1, 
        harmonicity: 1, 
      },
      MonoSynth: {
        ...monoSynthParams
      }, 
      NoiseSynth: {
        noise: "brown",
        ...envelope, 
        volume: 0, 
      }, 
      PluckSynth: {
        attackNoise: .1, 
        dampening: 0, 
        resonance: 0, 
        volume: 0,
      }, 
      PolySynth: {
        maxPolyphony: 1, 
        volume: 0
      }, 
      Synth: {
        ...commonSynthParams
      }
    }
    const EffectParams = {
      AutoFilter: {depth:0, ...filterParams, baseFrequency: 440, frequency: 220, wet: 1},
      AutoPanner: {depth: 0, frequency: 440, wet: 1},
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
      Chorus: {delayTime: .2, depth: 0, feedback: .2, frequency: 440, sperad: 0, wet:1 }, 
      Distortion: {distortoin: 1, wet:1},
      FeedbackDelay: {delayTime: .2, feedback: .2, wet:1},
      Freeverb:{dampening: .2, roomSize: .5, wet: 1},
      FrequencyShifter: {frequency: 440, wet: 1}, 
      JCReverb: {roomSize: .5, wet: 1},
      MidSideEffect: {wet: 1},
      Phaser: {baseFrequency: 440, frequency: 220, octaves: 1, Q: 1, wet: 1},
      PingPongDelay: {delayTime: .2, feedback: .2, wet: 1},
      PitchShift: {delayTime: .2, feedback: .2, pitch: 0, windowSize: .03},
      Reverb: {decay: .2, preDelay: 0, wet: 1},
      StereoWidener: {width: 0, wet: 1},
      Tremolo: {depth: .2, frequency: 440, spread: 0, type: "sine", wet: 1},
      Vibrato: {depth:.2, frequency: 1, type: "sine", wet: 1},

    }
    const ComponentParams = {
      AmplitudeEnvelope: {},
      Analyser: {},
      BiquadFilter: {},
      Channel: {},
      Compressor: {},
      Convolver: {},
      CrossFade: {},
      DCMeter: {},
      EQ3: {},
      Envelope: {},
      FFT: {},
      FeedbackCombFilter: {},
      Filter: {},
      Follower: {},
      FrequencyEnvelope: {},
      Gate: {},
      Limiter: {},
      LowpassCombFilter: {},
      Merge: {},
      Meter: {},
      MidSideCompressor: {},
      MidSideMerge: {},
      MidSideSplit: {},
      Mono: {},
      MultibandCompressor: {},
      MultibandSplit: {},
      OnePoleFilter: {},
      PanVol: {},
      Panner: {},
      Panner3D: {},
      PhaseShiftAllpass: {},
      Recorder: {},
      Solo: {},
      Split: {},
      Volume: {},
      Waveform: {},
    } 
   
    const SignalParams = {
      
      Abs: {},
      Add: {},
      AudioToGain: {},
      GainToAudio: {},
      GreaterThan: {},
      GreaterThanZero: {},
      Multiply: {},
      Negate: {},
      Pow: {},
      Scale: {},
      ScaleExp: {},
      Signal: {},
      Subtract: {},
      ToneConstantSource: {},
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




export const initialStates = { 
    attack:             { min: 0,      max: 1,      multiplier: .001 ,  float: true ,  unit: null   },
    decay:              { min: 0,      max: 1,      multiplier: .001 ,  float: true ,  unit: null   },
    sustain:            { min: 0,      max: 1,      multiplier: .001 ,  float: true ,  unit: null   },
    release:            { min: 0,      max: 1,      multiplier: .001 ,  float: true ,  unit: null   },
    detune:             { min: -1200,  max: 1200,   multiplier:  1   ,  float: false,  unit: "cents"   },
    portamento:         { min: 0,      max: 1,      multiplier: .001 ,  float: true ,  unit: null   },
    frequency:          { min: 20,     max: 8192,   multiplier: 1    ,  float: false,  unit: "Hz"   },
    phase:              { min: 0,      max: 360,    multiplier: 1    ,  float: false,  unit: "\u00b0"   },
    modulationFrequency:{ min: .1,     max: 440,    multiplier: .1   ,  float: true ,  unit: "Hz"   },
    pitchDecay:         { min: 0,      max: 1,      multiplier: .001 ,  float: true ,  unit: null   },
    harmonicity:        { min: .1,     max: 10,     multiplier: .001 ,  float: true ,  unit: "mf/cf"   },
    octaves:            { min: 0,      max: 8,      multiplier: .001 ,  float: true ,  unit: null   },
    width:              { min: -1,     max: 1,      multiplier: .01  ,  float: true ,  unit: null   },
    spread:             { min: -1200,  max: 100,    multiplier: 1    ,  float: false,  unit: null   },
    partialCount:       { min: 0,      max: 24,     multiplier: 1    ,  float: false,  unit: null   },
    gain:               { min: 0,      max: 1,      multiplier: 0.01 ,  float: true ,  unit: null   },
    count:              { min: 1,      max: 12,     multiplier: 1    ,  float: false,  unit: null   },
    resonance:          { min: 0,      max: 7000,   multiplier:  1   ,  float: false,  unit: null   },
    modulationIndex:    { min: 1,      max: 100,    multiplier:  1   ,  float: false,  unit: null   },
    dampening:          { min: 1,      max: 7000,   multiplier:  1   ,  float: false,  unit: null   },
    attackNoise:        { min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },

}

export const LFOStates = {
                  frequency:          {value:  1,   min: .1,        max: 10,     multiplier: .1      , float: true    ,centered: false, hasInput: true      },
                  min:                {value:  -1,  min: -10000,    max: 10000,  multiplier: 1       , float: false   ,centered: false, hasInput: false     },
                  max:                {value:  1,   min: -10000,    max: 10000,  multiplier: 1       , float: false   ,centered: false, hasInput: false     },
                  amplitude:          {value:  1,   min: .001,      max: 1,      multiplier: .001    , float: true    ,centered: false, hasInput: true     },
}