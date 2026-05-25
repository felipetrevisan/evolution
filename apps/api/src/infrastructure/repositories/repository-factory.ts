import { getSqlClient } from "../database/sql-client";
import { loadApiEnv } from "../env/api-env";
import { getFirestoreDb } from "../firebase/admin";
import { createAdminConfigRepository } from "./admin-config-repository";
import {
  createActionPlanRepository,
  createAdaptiveProfileRepository,
  createAnamneseRepository,
  createBodyMeasurementRepository,
  createCheckinRepository,
  createCycleReportRepository,
  createCycleRepository,
  createInvestigationRepository,
  createOperationalAssessmentRepository,
  createTriageRepository,
} from "./firebase/named-repositories";
import {
  createSqlActionPlanRepository,
  createSqlAdaptiveProfileRepository,
  createSqlAnamneseRepository,
  createSqlBodyMeasurementRepository,
  createSqlCheckinRepository,
  createSqlCycleReportRepository,
  createSqlCycleRepository,
  createSqlInvestigationRepository,
  createSqlOperationalAssessmentRepository,
  createSqlTriageRepository,
} from "./sql/named-repositories";
import { createSqlUserRepository } from "./sql/sql-user-repository";
import { createSqlUserScopedRepository } from "./sql/sql-user-scoped-repository";
import { createUserRepository } from "./user-repository";
import { createUserScopedRepository, type UserScopedCollection } from "./user-scoped-repository";

export function repositories() {
  return loadApiEnv().persistence.driver === "sql" ? sqlRepositories() : firestoreRepositories();
}

function sqlRepositories() {
  const sql = getSqlClient();

  return {
    users: createSqlUserRepository(sql),
    cycles: createSqlCycleRepository(sql),
    anamnese: createSqlAnamneseRepository(sql),
    bodyMeasurements: createSqlBodyMeasurementRepository(sql),
    triageSessions: createSqlTriageRepository(sql),
    investigations: createSqlInvestigationRepository(sql),
    operationalAssessments: createSqlOperationalAssessmentRepository(sql),
    adaptiveProfiles: createSqlAdaptiveProfileRepository(sql),
    plans: createSqlActionPlanRepository(sql),
    checkins: createSqlCheckinRepository(sql),
    reports: createSqlCycleReportRepository(sql),
    adminConfig: createAdminConfigRepository(getFirestoreDb()),
    scoped<TRecord extends { id: string; uid: string; createdAt: string }>(
      collection: UserScopedCollection,
    ) {
      return createSqlUserScopedRepository<TRecord>(sql, collection);
    },
  };
}

function firestoreRepositories() {
  const db = getFirestoreDb();

  return {
    users: createUserRepository(db),
    cycles: createCycleRepository(db),
    anamnese: createAnamneseRepository(db),
    bodyMeasurements: createBodyMeasurementRepository(db),
    triageSessions: createTriageRepository(db),
    investigations: createInvestigationRepository(db),
    operationalAssessments: createOperationalAssessmentRepository(db),
    adaptiveProfiles: createAdaptiveProfileRepository(db),
    plans: createActionPlanRepository(db),
    checkins: createCheckinRepository(db),
    reports: createCycleReportRepository(db),
    adminConfig: createAdminConfigRepository(db),
    scoped<TRecord extends { id: string; uid: string; createdAt: string }>(
      collection: UserScopedCollection,
    ) {
      return createUserScopedRepository<TRecord>(db, collection);
    },
  };
}
