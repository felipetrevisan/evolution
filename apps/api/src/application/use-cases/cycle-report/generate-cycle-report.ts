import { createId } from "../../../shared/validation/id";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { CheckInRecord } from "../check-in/save-check-in";
import type { CycleRecord } from "../cycle/get-current-cycle";

export type CycleReportRecord = {
  id: string;
  uid: string;
  createdAt: string;
  cycleId: string;
  summary: string;
  streak: number;
  adherence: number;
  completedGoals: number;
  beforeAfter: {
    before?: unknown;
    after?: unknown;
  };
  vectorEvolution: unknown[];
  recommendations: string[];
};

export async function generateCycleReport(
  uid: string,
  cycle: CycleRecord,
  repositories: {
    reports: UserScopedRepository<CycleReportRecord>;
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
  const [checkins, bodyMeasurements, triage] = await Promise.all([
    repositories.checkins.list(uid, 45),
    repositories.bodyMeasurements.list(uid, 45),
    repositories.triageSessions.getLatest(uid),
  ]);
  const completed = checkins.filter((entry) => entry.completedStatus !== "not_completed");
  const record: CycleReportRecord = {
    id: createId("report"),
    uid,
    createdAt: new Date().toISOString(),
    cycleId: cycle.id,
    summary: "Relatório de ciclo gerado com base nos check-ins, evolução corporal e vetores.",
    streak: countStreak(checkins),
    adherence: checkins.length > 0 ? Math.round((completed.length / checkins.length) * 100) : 0,
    completedGoals: completed.length,
    beforeAfter: {
      before: bodyMeasurements.at(-1) ?? null,
      after: bodyMeasurements[0] ?? null,
    },
    vectorEvolution: triage?.result ? [triage.result] : [],
    recommendations: [
      "Manter o vetor prioritário como foco de abertura do próximo ciclo.",
      "Revisar as ações com menor aderência antes de aumentar intensidade.",
    ],
  };

  return repositories.reports.save(uid, record.id, record);
}

function countStreak(entries: CheckInRecord[]): number {
  let streak = 0;

  for (const entry of entries) {
    if (entry.completedStatus === "not_completed") {
      break;
    }
    streak += 1;
  }

  return streak;
}
