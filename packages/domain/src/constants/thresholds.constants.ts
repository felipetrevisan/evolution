export const BMI_CONFIRMATION_RANGE = {
  min: 10,
  max: 60,
} as const;

export const SCORE_CLASSIFICATION_THRESHOLDS = {
  minimal: 25,
  light: 50,
  moderate: 75,
  dominant: 100,
} as const;

export const SVC_CLASSIFICATION_THRESHOLDS = {
  minimal: 25,
  moderate: 50,
  high: 75,
  critical: 100,
} as const;

export const ADAPTIVE_LEVEL_THRESHOLDS = [25, 45, 65, 80, 100] as const;
