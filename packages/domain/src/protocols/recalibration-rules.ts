export type RecalibrationRuleInput = {
  missedCheckIns: number;
  averageStability: number;
};

export function shouldRecalibrate(input: RecalibrationRuleInput): boolean {
  return input.missedCheckIns >= 3 || input.averageStability < 45;
}
