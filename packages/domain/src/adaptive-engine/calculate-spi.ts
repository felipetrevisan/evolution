import { clamp, roundTo } from "../shared/math";

export function calculateSpi(svc: number, gapP: number, gapE: number, gapC: number): number {
  return roundTo(clamp(svc * 0.5 + gapP * 0.2 + Math.abs(gapE) * 0.2 + gapC * 0.1), 2);
}
