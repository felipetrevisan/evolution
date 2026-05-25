import { applyRecalibration, clamp } from "@evolution/domain";
import type { CheckInBodyDto } from "../../../presentation/dtos/check-in.dto";
import { createId, todayIso } from "../../../shared/validation/id";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { ActionPlanRecord } from "../action-plan/generate-action-plan";
import type { CycleRecord } from "../cycle/get-current-cycle";

export type CheckInRecord = {
  id: string;
  uid: string;
  createdAt: string;
  date: string;
  completedStatus: "completed" | "partial" | "not_completed";
  emotionalState?: "calm" | "neutral" | "difficult";
  energy: number;
  mood: number;
  adherence: number;
  note?: string;
  stability: number;
  imWord?: string;
  recalibration?: {
    targetIntensity: number;
    messages: string[];
  };
};

export async function saveCheckIn(
  uid: string,
  dto: CheckInBodyDto,
  repositories: {
    checkins: UserScopedRepository<CheckInRecord>;
    cycles: UserScopedRepository<CycleRecord>;
    plans: UserScopedRepository<ActionPlanRecord>;
  },
) {
  const [history, plan] = await Promise.all([
    repositories.checkins.list(uid, 45),
    repositories.plans.getLatest(uid),
    repositories.cycles.getLatest(uid),
  ]);
  const completedStatus =
    dto.completedStatus ?? (dto.adherence === 0 ? "not_completed" : "completed");
  const adherence =
    dto.adherence ??
    (completedStatus === "completed" ? 100 : completedStatus === "partial" ? 50 : 0);
  const energy = dto.energy ?? (dto.emotionalState === "difficult" ? 35 : 70);
  const mood = dto.mood ?? (dto.emotionalState === "difficult" ? 30 : 70);
  const previousFailures = history
    .slice(0, 2)
    .filter((entry) => entry.completedStatus === "not_completed").length;
  const difficultStreak = history
    .slice(0, 2)
    .filter((entry) => entry.emotionalState === "difficult").length;
  const shouldReduceTarget = completedStatus === "not_completed" && previousFailures >= 1;
  const targetIntensity = applyRecalibration(10, shouldReduceTarget);
  const messages = [
    ...(shouldReduceTarget ? ["Meta reduzida em 20% pelos próximos 3 dias."] : []),
    ...(history.length >= 10 &&
    history.slice(0, 10).every((entry) => entry.completedStatus === "completed")
      ? ["Você pode experimentar um desafio opcional de +10%."]
      : []),
    ...(dto.emotionalState === "difficult" && difficultStreak >= 1
      ? ["Hoje pede suporte e menor fricção, não mais cobrança."]
      : []),
    ...(plan?.days?.length === 45 && history.length >= 3
      ? ["Se houver queda operacional, revise sua área de autogestão e ajustes nesta semana."]
      : []),
  ];
  const record: CheckInRecord = {
    id: createId("checkin"),
    uid,
    createdAt: new Date().toISOString(),
    date: dto.date ?? todayIso(),
    completedStatus,
    ...(dto.emotionalState ? { emotionalState: dto.emotionalState } : {}),
    energy,
    mood,
    adherence,
    ...(dto.note ? { note: dto.note } : {}),
    stability: clamp(energy * 0.35 + mood * 0.3 + adherence * 0.35),
    ...(messages.length > 0 ? { recalibration: { targetIntensity, messages } } : {}),
  };

  return repositories.checkins.save(uid, record.id, record);
}
