import { exercises } from "../lib/exerciseLibrary";

/**
 * Returns an array of exercises filtered by region + phase.
 * @param {string} region  "Neck" | "Low Back / SI Joint" | "Shoulder" | "Hip / Groin" | etc.
 * @param {string} phase   "Reset" | "Educate" | "Rebuild"
 */
export function useExercises(region, phase) {
  return exercises.filter((ex) => ex.region === region && ex.phase === phase);
} 