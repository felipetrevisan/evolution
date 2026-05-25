import { getCheckinMode, selectImWordOfDay } from "@evolution/domain";
import { todayIso } from "../../../shared/validation/id";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { ActionPlanRecord } from "../action-plan/generate-action-plan";
import type { CycleRecord } from "../cycle/get-current-cycle";
import type { CheckInRecord } from "./save-check-in";

export async function getTodayCheckIn(
  uid: string,
  repositories: {
    checkins: UserScopedRepository<CheckInRecord>;
    cycles: UserScopedRepository<CycleRecord>;
    plans: UserScopedRepository<ActionPlanRecord>;
  },
) {
  const [entries, cycle, plan] = await Promise.all([
    repositories.checkins.list(uid, 45),
    repositories.cycles.getLatest(uid),
    repositories.plans.getLatest(uid),
  ]);
  const today = todayIso();
  const existing = entries.find((entry) => entry.date === today) ?? null;
  const day = getCycleDay(cycle);
  const failures = entries
    .slice(0, 2)
    .filter((entry) => entry.completedStatus === "not_completed").length;
  const mode = day <= 14 ? "simple" : "expanded";

  return {
    existing,
    mode,
    cycleDay: day,
    domainMode: getCheckinMode({ streak: countStreak(entries), shouldRecalibrate: failures >= 2 }),
    imWord: selectImWordOfDay(day),
    microGoal: getMicroGoal(plan, day),
    recalibrationMessages: existing?.recalibration?.messages ?? [],
  };
}

export async function getCheckInHistory(
  uid: string,
  repository: UserScopedRepository<CheckInRecord>,
) {
  return repository.list(uid, 30);
}

function getCycleDay(cycle: CycleRecord | null): number {
  const startedAt = cycle?.startedAt ?? cycle?.createdAt;

  if (!startedAt) {
    return 1;
  }

  const elapsed = Date.now() - new Date(startedAt).getTime();
  return Math.min(45, Math.max(1, Math.floor(elapsed / 86_400_000) + 1));
}

function getMicroGoal(plan: ActionPlanRecord | null, day: number): string {
  const dayPlan = plan?.days?.[day - 1] as { focus?: string } | undefined;
  return dayPlan?.focus ?? "Manter a menor ação viável do plano de hoje.";
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
