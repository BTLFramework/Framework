import { exercises } from "../lib/exerciseLibrary";

/**
 * Returns an array filtered by region + phase.
 * @param {string} region  "neck" | "back" | "upper-limb" | "lower-limb"
 * @param {string} phase   "RESET" | "EDUCATE" | "REBUILD"
 */
export function useExercises(region, phase) {
  return exercises.filter((ex) => ex.region === region && ex.phase === phase);
} 