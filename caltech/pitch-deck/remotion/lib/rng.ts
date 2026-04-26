// Deterministic PRNG + value noise for per-frame halftone rendering.
// Every clip frame must render identically given the same seed.

export function mulberry32(seed: number) {
  let a = (seed >>> 0) || 1;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// 2D value noise with smoothstep interpolation, seed-stable.
export function makeNoise(seed: number) {
  const rand = mulberry32(seed);
  const gridSize = 64;
  const grid = new Float32Array(gridSize * gridSize);
  for (let i = 0; i < grid.length; i++) grid[i] = rand();

  const smooth = (t: number) => t * t * (3 - 2 * t);

  return (x: number, y: number) => {
    const fx = ((x % gridSize) + gridSize) % gridSize;
    const fy = ((y % gridSize) + gridSize) % gridSize;
    const x0 = Math.floor(fx);
    const y0 = Math.floor(fy);
    const x1 = (x0 + 1) % gridSize;
    const y1 = (y0 + 1) % gridSize;
    const sx = smooth(fx - x0);
    const sy = smooth(fy - y0);
    const a = grid[y0 * gridSize + x0];
    const b = grid[y0 * gridSize + x1];
    const c = grid[y1 * gridSize + x0];
    const d = grid[y1 * gridSize + x1];
    return (
      a * (1 - sx) * (1 - sy) +
      b * sx * (1 - sy) +
      c * (1 - sx) * sy +
      d * sx * sy
    );
  };
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const easeInOut = (t: number) => {
  const tt = clamp01(t);
  return tt < 0.5 ? 2 * tt * tt : 1 - Math.pow(-2 * tt + 2, 2) / 2;
};
export const easeOut = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
