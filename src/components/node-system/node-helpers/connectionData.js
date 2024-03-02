export const isConnectionValid = (from, to) => {
  if (from === "Transport") return connectionData[from].includes(to)
  if (from === "Gain") return true
  if (from === "LFO") return true
  if (from && to === "node") return true
  if (from !== "Transport" && to === "x" || to === "y") return true
  if (from !== "LFO" && to !== "node") return false
  
}

const connectionData = {
  Transport: ["detune", "frequency", "trigger"], 

}