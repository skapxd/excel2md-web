const REVEAL_ORIGIN_X = 0.92;
const REVEAL_ORIGIN_Y = 0.04;

type RevealGeometry = {
  origin: string;
  radius: number;
};

export function getRevealGeometry(): RevealGeometry {
  const { innerHeight, innerWidth } = window;
  const x = Math.round(innerWidth * REVEAL_ORIGIN_X);
  const y = Math.round(innerHeight * REVEAL_ORIGIN_Y);
  const radius = Math.ceil(Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)));

  return { origin: `${x}px ${y}px`, radius };
}
