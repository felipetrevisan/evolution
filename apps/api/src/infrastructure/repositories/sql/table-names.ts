import type { UserScopedCollection } from "../user-scoped-repository";

export const scopedTableByCollection: Record<UserScopedCollection, string> = {
  cycles: "cycles",
  anamnese: "anamnese",
  bodyMeasurements: "body_measurements",
  triageSessions: "triage_sessions",
  investigations: "investigations",
  operationalAssessments: "operational_assessments",
  adaptiveProfiles: "adaptive_profiles",
  plans: "action_plans",
  checkins: "checkins",
  reports: "cycle_reports",
};
