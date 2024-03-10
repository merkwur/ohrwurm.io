import { menuContent } from "./nodelist"

export const isConnectionValid = (from, which, to, fromType) => {
  console.log(from, which, to)
  if (menuContent.Signal.includes(to)) return true
  if (from === "Transport") return connectionData[from].includes(which)
  if (from === "Gain") return true
  if (from === "LFO") return true
  if (from && which === "node") return true
  if (from !== "Transport" && which === "x" || which === "y") return true
  if (from !== "LFO" && which !== "node") return false
  
}

const connectionData = {
  Transport: ["detune", "frequency", "trigger"], 

}