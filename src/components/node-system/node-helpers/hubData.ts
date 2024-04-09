import { Channel, Mixer } from "../../types/types";

const getMixIn = (which: number): Channel => ({
  id: which, 
  input: undefined, 
  pan: .5,
  volume: .8,
});

export const getMixer = (): Mixer => ({
  0: getMixIn(0),
  1: getMixIn(1),
  2: getMixIn(2),
  3: getMixIn(3),
  4: getMixIn(4),
  5: getMixIn(5),
  6: getMixIn(6),
  7: getMixIn(7),
});

