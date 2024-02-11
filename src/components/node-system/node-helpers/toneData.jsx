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
    parameters: getNodeParameters(name, type),
  }  

  return {...tones, [id]: newToneObject}
}



export const invokeTriggerEvent = (triggerData, tones, nodes) => {
  if (!triggerData.instruments || triggerData.instruments.length <= 0) {
    return
  }
  
  if (triggerData.notes) {
    let noteDuration = (60 / triggerData.bpm)
    const instruments = Object.keys(nodes).filter(node => triggerData.instruments.includes(nodes[node].id));
    
    if (Array.isArray(triggerData.notes)) {
      noteDuration /= triggerData.notes.length

      if (instruments.length > 1) {
        for (let i = 0; i < triggerData.notes.length; i++) {
          setTimeout(() => {
            if (triggerData.probabilities[i] > Math.random()) {
              instruments.forEach(instrument => {
                if (instrument.includes("Oscillator")) {
                  tones[instrument].tone.frequency.rampTo(triggerData.notes[i], noteDuration * triggerData.durations[i])
                } else {
                  tones[instrument].tone.triggerAttackRelease(triggerData.notes[i], noteDuration * triggerData.durations[i]);
                }
              })
            }
          }, i * noteDuration * 1000); 
        } 
      } else {
        for (let i = 0; i < triggerData.notes.length; i++) {
          setTimeout(() => {
            if (triggerData.probabilities[i] > Math.random()) {
              if (instruments[0].includes("Oscillator")) {
                tones[instruments[0]].tone.frequency.rampTo(triggerData.notes[i], noteDuration * triggerData.durations[i])
              } else {
                tones[instruments[0]].tone.triggerAttackRelease(triggerData.notes[i], noteDuration * triggerData.durations[i]);
              }
            }
          }, i * noteDuration * 1000); 
        }
      }
    }
  }
};

export const connectToneObjects = (from, to, which, nodes) => {
  if (from.includes("Transport")) return

  
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

export const disposeToneNode = (id, tones) => {
  if (tones[id].name === "Transport") return
  if (tones[id].name !== "Destination") {
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
    console.log("shoot")
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
  if (name === "Destiantion") {
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

  const {frequency, ...commonModulatorParams} = commonOscParams

  const nodeParams = {

    Core: {
      Destination: null,
      Transport: {bpm: 120, notes: null, time: 0},
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
        phase: 0, 
        modulationFrequency: 220, 
        modulator: {detune: 0, phase: 0, partialCount: 0}
      },
      PulseOscillator: {
        start: false,
        
        detune: 0,
        frequency: 440,
        phase: 0,
        width: 0
      },
      Noise: {
        noise: null
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
        modulationType: "sine",
        modulator: {...commonModulatorParams}
      }, 

      LFO: {
        start: false,
        frequency: 1,
        min: -1,
        max: 1,
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
    envelope: {...envelope},
    portamento: 0,
    oscillator: {...OmniOscillator},
    
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
        harmonicity: 1,
        modulationEnvelope: {...envelope},
        modulator: {...OmniOscillator},
        carrierOscillatorType: "osc",
        modulatorOscillatorType: "osc"
      }, 
      Synth: {
        ...commonSynthParams,
        oscillatorType: "osc"
      }, 
      DuoSynth: {
        voice0: {...monoSynthParams},
        voice1: {...monoSynthParams},
        oscillatorType0: "osc",
        oscillatorType1: "osc"
      }, 
      FMSynth: {
        ...commonSynthParams, 
        modulationIndex: 1, 
        envelope: {...envelope},
        modulationEnvelope: {...envelope},  
        modulator: {...commonOscParams}, 
        carrierOscillatorType: "osc",
        modulatorOscillatorType: "osc"
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
        ...monoSynthParams,
        oscillatorType: "osc"

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
        volume: 0, 
        oscillatorType: "osc"
      }, 
     
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
      Tremolo: {depth: .2, frequency: 440, spread: 0, type: "sine", wet: 1},
      Vibrato: {depth:.2, frequency: 1, type: "sine", wet: 1},

    }
    const ComponentParams = {
      AmplitudeEnvelope: {...envelope},
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
        reduction: 0, 
        release: .2, 
        threshold: 0
      },
      Convolver: {normalize: true},
      CrossFade: {fade: .5},
      DCMeter: {},
      EQ3: {low: 0, lowFrequency: 120, mid: 0, high: 0, highFrequency: 4096, Q: 1},
      Envelope: {...envelope},
      FFT: {normalRange: true, smoothing: 0},
      FeedbackCombFilter: {delayTime: .2, resonance: .5},
      Filter: {...filterParams},
      Follower: {smoothing: 0},
      FrequencyEnvelope: {...envelope, octaves: 1},
      Gate: {smoothing: 0, threshold: 0},
      Limiter: {reduction: 0, threshold: 0},
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
      Recorder: {state: "stopped", },
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
      Pow: {},
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
    attack:             {type: "knob",  min: 0,        max: 1,      multiplier: .01 ,   float: true ,  unit: null   },
    decay:              {type: "knob",  min: 0,        max: 1,      multiplier: .01 ,   float: true ,  unit: null   },
    sustain:            {type: "knob",  min: 0,        max: 1,      multiplier: .01 ,   float: true ,  unit: null   },
    release:            {type: "knob",  min: 0,        max: Infinity, multiplier: .01,  float: true ,  unit: null   },
    detune:             {type: "slider",  min: -1200,  max: 1200,   multiplier:  1   ,  float: false,  unit: "cents"   },
    portamento:         {type: "slider",  min: 0,      max: 1,      multiplier: .001 ,  float: true ,  unit: null   },
    frequency:          {type: "slider",  min: 1,      max: 8192,   multiplier: 1    ,  float: false,  unit: "Hz"   },
    phase:              {type: "slider",  min: 0,      max: 360,    multiplier: 1    ,  float: false,  unit: "\u00b0"   },
    modulationFrequency:{type: "slider",  min: .1,     max: 440,    multiplier: .1   ,  float: true ,  unit: "Hz"   },
    pitchDecay:         {type: "slider",  min: 0,      max: 1,      multiplier: .001 ,  float: true ,  unit: null   },
    harmonicity:        {type: "slider",  min: .1,     max: 10,     multiplier: .001 ,  float: true ,  unit: "mf/cf"   },
    octaves:            {type: "slider",  min: 0,      max: 8,      multiplier: .001 ,  float: true ,  unit: null   },
    width:              {type: "slider",  min: -1,     max: 1,      multiplier: .01  ,  float: true ,  unit: null   },
    spread:             {type: "slider",  min: -1200,  max: 100,    multiplier: 1    ,  float: false,  unit: null   },
    partialCount:       {type: "slider",  min: 0,      max: 24,     multiplier: 1    ,  float: false,  unit: null   },
    gain:               {type: "slider",  min: 0.01,      max: 1,      multiplier: 0.01 ,  float: true ,  unit: null   },
    count:              {type: "slider",  min: 1,      max: 12,     multiplier: 1    ,  float: false,  unit: null   },
    resonance:          {type: "slider",  min: 0,      max: 7000,   multiplier:  1   ,  float: false,  unit: null   },
    modulationIndex:    {type: "slider",  min: 1,      max: 100,    multiplier:  1   ,  float: false,  unit: null   },
    dampening:          {type: "slider",  min: 1,      max: 7000,   multiplier:  1   ,  float: false,  unit: null   },
    baseFrequency:      {type: "slider",  min: 20,     max: 8192,   multiplier: 1    ,  float: false,  unit: "Hz"   },
    attackCurve:        {type: "select",  value: ["linear", "exponential", "sine", "cosine", "bounce", "ripple", "step"]},
    releaseCurve:       {type: "select",  value: ["linear", "exponential", "sine", "cosine", "bounce", "ripple", "step"]},
    decayCurve:         {type: "select",  value: ["linear", "exponential"]},
    pan:                {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    knee:               {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    ratio:              {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    threshold:          {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    volume:             {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    Q:                  {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    low:                {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    lowFrequency:       {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    mid:                {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    high:               {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    highFrequency:      {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
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
    panningModel:       {type: "select",  value: ["equalpower, HRTF"]},
    rolloffFactor:      {type: "slider",  min: .1,     max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    bits:               {type: "slider",  min: 1,      max: 20,     multiplier:  .01 ,  float: true ,  unit: null   },
    bpm:                {type: "slider",  min: 1,      max: 999,    multiplier:   1 ,   float: false,  unit: "bpm"  },
    length:             {type: "slider",  min: 1,      max: 8,      multiplier:   1 ,   float: false , unit: null   },
    wet:                {type: "slider",  min: 0,      max: 1,      multiplier:   .01 , float: true  , unit: null   },
    feedback:           {type: "slider",  min: 0,      max: 1,      multiplier:   .01 , float: true  , unit: null   },
    p:                  {type: "slider",  min: 0,      max: 1,      multiplier:   .01 , float: true  , unit: null   },
    d:                  {type: "slider",  min: 0,      max: 1,      multiplier:   .01 , float: true  , unit: null   },
    orientationX:       {type: "slider",  min: -Infinity, max: Infinity,     multiplier:  1 ,  float: false ,  unit: "cm"   },
    orientationY:       {type: "slider",  min: -Infinity, max: Infinity,     multiplier:  1 ,  float: false ,  unit: "cm"   },
    orientationZ:       {type: "slider",  min: -Infinity, max: Infinity,     multiplier:  1 ,  float: false ,  unit: "cm"   },
    positionX:          {type: "slider",  min: -Infinity, max: Infinity,     multiplier:  1 ,  float: false ,  unit: "cm"   },
    positionY:          {type: "slider",  min: -Infinity, max: Infinity,     multiplier:  1 ,  float: false ,  unit: "cm"   },
    positionZ:          {type: "slider",  min: -Infinity, max: Infinity,     multiplier:  1 ,  float: false ,  unit: "cm"   },

}

export const LFOStates = {
                  frequency:          {type: "slider",   min: .1,        max: 10,     multiplier: .1      , float: true   },
                  min:                {type: "slider",   min: -10000,    max: 10000,  multiplier: 1       , float: false  },
                  max:                {type: "slider",   min: -10000,    max: 10000,  multiplier: 1       , float: false  },
                  amplitude:          {type: "slider",   min: .001,      max: 1,      multiplier: .001    , float: true   },
                  
}

