export const clamp = (num, min, max) => Math.min(Math.max(num, min), max)

export const colorScheme = {Core: "#d3869b", 
                            Source: "#8ec07c",
                            Effect: "#fa882f",  //#fabd2f was the original gruvbox color
                            Instrument: "#fb4934",
                            Component: "#b8bb26",
                            Signal: "#458588",
                            natural: "#777777"
                            }



export const excludeFromPartial = ["PWMOscillator", "PulseOscillator"]
export const waves = ["sine", "square", "sawtooth", "triangle"]
export const noises = ["brown", "pink", "white"]