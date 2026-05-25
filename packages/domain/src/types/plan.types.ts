import type { AdaptiveLevel } from "./adaptive-engine.types";
import type { VectorKey } from "./vector.types";

export type PlanDay = {
  day: number;
  focus: string;
  microAction: string;
  message: string;
  protocol: string;
  checkpoint: boolean;
};

export type ActionPlan = {
  durationDays: number;
  priorityVector: VectorKey;
  adaptiveLevel: AdaptiveLevel;
  days: PlanDay[];
};

export type PlanSummary = {
  title: string;
  priorityVector: VectorKey;
  totalCheckpoints: number;
};
