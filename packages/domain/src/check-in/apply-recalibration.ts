export function applyRecalibration(planIntensity: number, shouldRecalibrate: boolean): number {
  return shouldRecalibrate ? Math.max(1, planIntensity - 1) : planIntensity;
}
