import type { AdaptiveLevel } from "./adaptive-engine.types";
import type { VectorKey } from "./vector.types";

export type PlanDay = {
  day: number;
  week: number;
  focus: string;
  microAction: string;
  supportAction: string;
  regulationAction: string;
  message: string;
  protocol: string;
  checkpoint: boolean;
};

export type PlanWeek = {
  week: number;
  title: string;
  objective: string;
  base: {
    vector: VectorKey;
    action: string;
    frequency: string;
    language: string;
  };
  support: {
    vector: VectorKey;
    action: string;
    frequency: string;
    language: string;
  };
  regulation: {
    action: string;
    frequency: string;
  };
};

export type ActionPlan = {
  durationDays: number;
  priorityVector: VectorKey;
  supportVector: VectorKey;
  regulationVector: VectorKey;
  adaptiveLevel: AdaptiveLevel;
  weeks: PlanWeek[];
  days: PlanDay[];
};

export type PlanSummary = {
  title: string;
  priorityVector: VectorKey;
  totalCheckpoints: number;
};
