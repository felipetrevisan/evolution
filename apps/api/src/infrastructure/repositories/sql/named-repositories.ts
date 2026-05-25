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
import type { SqlClient } from "../../database/sql-client";
import { createSqlUserScopedRepository } from "./sql-user-scoped-repository";

export function createSqlCycleRepository(sql: SqlClient): CycleRepository {
  return createSqlUserScopedRepository(sql, "cycles");
}

export function createSqlAnamneseRepository(sql: SqlClient): AnamneseRepository {
  return createSqlUserScopedRepository(sql, "bodyMeasurements");
}

export function createSqlBodyMeasurementRepository(sql: SqlClient): BodyMeasurementRepository {
  return createSqlUserScopedRepository(sql, "bodyMeasurements");
}

export function createSqlTriageRepository(sql: SqlClient): TriageRepository {
  return createSqlUserScopedRepository(sql, "triageSessions");
}

export function createSqlInvestigationRepository(sql: SqlClient): InvestigationRepository {
  return createSqlUserScopedRepository(sql, "investigations");
}

export function createSqlOperationalAssessmentRepository(
  sql: SqlClient,
): OperationalAssessmentRepository {
  return createSqlUserScopedRepository(sql, "operationalAssessments");
}

export function createSqlAdaptiveProfileRepository(sql: SqlClient): AdaptiveProfileRepository {
  return createSqlUserScopedRepository(sql, "adaptiveProfiles");
}

export function createSqlActionPlanRepository(sql: SqlClient): ActionPlanRepository {
  return createSqlUserScopedRepository(sql, "plans");
}

export function createSqlCheckinRepository(sql: SqlClient): CheckinRepository {
  return createSqlUserScopedRepository(sql, "checkins");
}

export function createSqlCycleReportRepository(sql: SqlClient): CycleReportRepository {
  return createSqlUserScopedRepository(sql, "reports");
}
