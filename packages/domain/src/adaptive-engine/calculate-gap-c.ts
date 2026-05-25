import type { GapCInput } from "../types/adaptive-engine.types";

const availabilityScores: Record<GapCInput["weeklyAvailability"], number> = {
  menos_2h: 15,
  "2_3h": 10,
  "4_5h": 5,
  "6h_mais": 0,
};

const experienceScores: Record<GapCInput["experienceLevel"], number> = {
  nunca: 10,
  iniciante: 5,
  intermediario: 2,
  avancado: 0,
};

export function calculateGapC(input: GapCInput): number {
  return (
    availabilityScores[input.weeklyAvailability] +
    experienceScores[input.experienceLevel] +
    (input.hasWeightOscillation ? 5 : 0) +
    (input.hasHealthCondition ? 5 : 0) +
    (input.hasSystemicImpactB02 ? 5 : 0)
  );
}
