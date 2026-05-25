import type { UserScopedRepository } from "../../repositories/base-repository";
import type { CheckInRecord } from "../check-in/save-check-in";
import type { CycleRecord } from "../cycle/get-current-cycle";
import { type CycleReportRecord, generateCycleReport } from "./generate-cycle-report";

export async function getCurrentCycleReport(
  uid: string,
  repositories: {
    reports: UserScopedRepository<CycleReportRecord>;
    cycles: UserScopedRepository<CycleRecord>;
    checkins: UserScopedRepository<CheckInRecord>;
    bodyMeasurements: UserScopedRepository<{ id: string; uid: string; createdAt: string }>;
    triageSessions: UserScopedRepository<{
      id: string;
      uid: string;
      createdAt: string;
      result?: unknown;
    }>;
  },
) {
  const [report, cycle] = await Promise.all([
    repositories.reports.getLatest(uid),
    repositories.cycles.getLatest(uid),
  ]);

  if (report) {
    return report;
  }

  if (cycle && getCycleDay(cycle) >= 45) {
    return generateCycleReport(uid, cycle, repositories);
  }

  return null;
}

function getCycleDay(cycle: CycleRecord): number {
  const startedAt = cycle.startedAt ?? cycle.createdAt;
  return Math.min(
    45,
    Math.max(1, Math.floor((Date.now() - new Date(startedAt).getTime()) / 86_400_000) + 1),
  );
}
