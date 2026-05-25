import type { Firestore } from "firebase-admin/firestore";
import type {
  ActionPlanRepository,
  AdaptiveProfileRepository,
  AnamneseRepository,
  BodyMeasurementRepository,
  CheckinRepository,
  CycleReportRepository,
  CycleRepository,
  InvestigationRepository,
  OperationalAssessmentRepository,
  TriageRepository,
} from "../../../application/repositories";
import { createUserScopedRepository } from "../user-scoped-repository";

export function createCycleRepository(db: Firestore): CycleRepository {
  return createUserScopedRepository(db, "cycles");
}

export function createAnamneseRepository(db: Firestore): AnamneseRepository {
  return createUserScopedRepository(db, "bodyMeasurements");
}

export function createBodyMeasurementRepository(db: Firestore): BodyMeasurementRepository {
  return createUserScopedRepository(db, "bodyMeasurements");
}

export function createTriageRepository(db: Firestore): TriageRepository {
  return createUserScopedRepository(db, "triageSessions");
}

export function createInvestigationRepository(db: Firestore): InvestigationRepository {
  return createUserScopedRepository(db, "investigations");
}

export function createOperationalAssessmentRepository(
  db: Firestore,
): OperationalAssessmentRepository {
  return createUserScopedRepository(db, "operationalAssessments");
}

export function createAdaptiveProfileRepository(db: Firestore): AdaptiveProfileRepository {
  return createUserScopedRepository(db, "adaptiveProfiles");
}

export function createActionPlanRepository(db: Firestore): ActionPlanRepository {
  return createUserScopedRepository(db, "plans");
}

export function createCheckinRepository(db: Firestore): CheckinRepository {
  return createUserScopedRepository(db, "checkins");
}

export function createCycleReportRepository(db: Firestore): CycleReportRepository {
  return createUserScopedRepository(db, "reports");
}
