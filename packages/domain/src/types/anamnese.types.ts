export type AnamneseInput = {
  weightKg: number;
  heightCm: number;
  weeklyAvailability: WeeklyAvailability;
  experienceLevel: ExperienceLevel;
  hasWeightOscillation?: boolean;
  hasHealthCondition?: boolean;
  hasSystemicImpactB02?: boolean;
};

export type WeeklyAvailability = "menos_2h" | "2_3h" | "4_5h" | "6h_mais";

export type ExperienceLevel = "nunca" | "iniciante" | "intermediario" | "avancado";

export type BmiClassification =
  | "Abaixo do peso"
  | "Peso normal"
  | "Sobrepeso"
  | "Obesidade grau I"
  | "Obesidade grau II"
  | "Obesidade grau III";

export type BmiValidationResult = {
  valid: boolean;
  warnings: string[];
};
