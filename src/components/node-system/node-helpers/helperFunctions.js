export const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

export const colorScheme = {Core: "#b16286", 
                            Source: "#8ec07c",
                            Effect: "#fabd2f",
                            Instrument: "#fb4934",
                            Component: "#b8bb26",
                            Signal: "#458588",
                            natural: "#777"
                            }



export const excludeFromPartial = ["PWMOscillator", "PulseOscillator"]
export const waves = ["sine", "square", "sawtooth", "triangle"]
export const noises = ["brown", "pink", "white"]