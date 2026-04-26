// Mirrors app/globals.css — keep in sync by hand.
// HackTech register: ivory + deep indigo + muted sepia.
export const palette = {
  ivory: "#f7f5f0",
  ivoryHi: "#fdfcf8",
  ink: "#1d1a17",
  smoke: "#3d3832",
  graphite: "#6b5d4c",
  slate: "#8a847a",
  accent: "#3730a3",
  accentDeep: "#1e1b6e",
  accentSoft: "#6d65d4",
  activationWarm: "#c44569",
  activationHot: "#f5a142",
  red: "#c44569",
  hair: "rgba(29,26,23,0.09)",
  hairStrong: "rgba(29,26,23,0.16)",
} as const;

export const dotColors: ReadonlyArray<readonly [number, number, number]> = [
  [29, 26, 23],
  [61, 56, 50],
  [107, 93, 76],
  [138, 132, 122],
  [109, 101, 212],
  [55, 48, 163],
];

export const pickDot = (t: number) =>
  dotColors[Math.floor(Math.abs(t) * dotColors.length) % dotColors.length];
