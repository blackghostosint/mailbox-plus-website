/**
 * Deterministic 32-bit bitwise string hashing function.
 * Converts an input seed string into a deterministic 32-bit integer.
 * Pure, synchronous function with zero external runtime dependencies.
 */
export function hashString(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
