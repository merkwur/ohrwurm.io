import { menuContent } from "./nodelist"

export const isConnectionValid = (from, which, to, toType) => {
  console.log(from, which, to, toType)
  if (menuContent.Signal.includes(to)) return true
  if (from === "MIDI") return connectionData[from].includes(toType) || connectionData[from].includes(to)
  if (from === "Transport") return connectionData[from].includes(which)
  if (from === "Gain") return true
  if (from === "LFO") return true
  if (from && which === "node") return true
  if (from !== "Transport" && which === "x" || which === "y") return true
  if (from !== "LFO" && which !== "node") return false
  
}

const connectionData = {
  Transport: ["detune", "frequency", "trigger"], 
  MIDI: ["Instrument", "Envelope"]
}