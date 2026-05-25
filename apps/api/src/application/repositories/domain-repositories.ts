import type { UserScopedRecord, UserScopedRepository } from "./base-repository";

export type CycleRecord = UserScopedRecord & {
  status?: "active" | "completed";
  startedAt?: string;
  completedAt?: string;
  durationDays?: number;
};

export type AnamneseRecord = UserScopedRecord & {
  payload?: unknown;
  bmi?: number;
  bmiCategory?: string;
  flags?: string[];
  currentCycleId?: string;
};

export type BodyMeasurementRecord = UserScopedRecord & {
  payload?: unknown;
  bmi?: number;
  bmiCategory?: string;
  warnings?: string[];
  cycleId?: string;
};

export type TriageRecord = UserScopedRecord & {
  status?: "in_progress" | "completed";
  answers?: unknown[];
  result?: unknown;
};

export type InvestigationRecord = UserScopedRecord & {
  status?: "in_progress" | "completed";
  answers?: unknown[];
  output?: unknown;
};

export type OperationalAssessmentRecord = UserScopedRecord & {
  status?: "in_progress" | "completed";
  values?: unknown[];
  result?: unknown;
};

export type AdaptiveProfileRecord = UserScopedRecord & {
  dominantVector?: string;
  adaptiveLevel?: string;
  protocols?: string[];
};

export type ActionPlanRecord = UserScopedRecord & {
  status?: "active" | "completed";
  days?: unknown[];
};

export type CheckinRecord = UserScopedRecord & {
  date?: string;
  energy?: number;
  mood?: number;
  adherence?: number;
};

export type CycleReportRecord = UserScopedRecord & {
  cycleId?: string;
  summary?: string;
};

export type CycleRepository = UserScopedRepository<CycleRecord>;
export type AnamneseRepository = UserScopedRepository<AnamneseRecord>;
export type BodyMeasurementRepository = UserScopedRepository<BodyMeasurementRecord>;
export type TriageRepository = UserScopedRepository<TriageRecord>;
export type InvestigationRepository = UserScopedRepository<InvestigationRecord>;
export type OperationalAssessmentRepository = UserScopedRepository<OperationalAssessmentRecord>;
export type AdaptiveProfileRepository = UserScopedRepository<AdaptiveProfileRecord>;
export type ActionPlanRepository = UserScopedRepository<ActionPlanRecord>;
export type CheckinRepository = UserScopedRepository<CheckinRecord>;
export type CycleReportRepository = UserScopedRepository<CycleReportRecord>;
