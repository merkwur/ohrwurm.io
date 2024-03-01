export const isConnectionValid = (from, to) => {
  if (from === "LFO") return true
  if (from && to === "node") return true
  if (from !== "Transport" && to === "x" || to === "y") return true
  if (from !== "LFO" && to !== "node") return false
  console.log(`The connection cannot be established between ${from} and ${to}`)
  return connectionData[from].includes(to)
}

const connectionData = {
  Transport: ["detune", "frequency", "trigger"], 

}