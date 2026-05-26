import {
  type AdaptiveLevel,
  generateActionPlan as generateDomainActionPlan,
  selectImWordOfDay,
  type VectorKey,
} from "../../../../../../packages/domain/src/index.ts";
import type { ActionPlanBodyDto } from "../../../presentation/dtos/action-plan.dto";
import { NotFoundError } from "../../../shared/errors/api-error";
import { createId, todayIso } from "../../../shared/validation/id";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { AdaptiveProfileRecord } from "../adaptive-engine/generate-adaptive-profile";

export type ActionPlanRecord = {
  id: string;
  uid: string;
  createdAt: string;
  status: "active" | "completed";
  startDate: string;
  priorityVector: VectorKey;
  supportVector: VectorKey;
  regulationVector: VectorKey;
  adaptiveLevel?: string;
  spi?: number;
  protocolBase: string;
  imWords: string[];
  weeklyObjectives: Array<{ week: number; objective: string; protocol: string }>;
  days: unknown[];
};

export async function generateActionPlan(
  uid: string,
  dto: ActionPlanBodyDto,
  repositories: {
    plans: UserScopedRepository<ActionPlanRecord>;
    profiles: UserScopedRepository<AdaptiveProfileRecord>;
  },
) {
  const profile = await repositories.profiles.getLatest(uid);

  if (!profile) {
    throw new NotFoundError("Gere o perfil adaptativo antes do plano de ação.");
  }

  const startDate = dto.startDate ?? todayIso();
  const domainPlan = generateDomainActionPlan(
    profile.dominantVector,
    profile.adaptiveLevel as AdaptiveLevel,
  );
  const record: ActionPlanRecord = {
    id: createId("plan"),
    uid,
    createdAt: new Date().toISOString(),
    status: "active",
    startDate,
    priorityVector: profile.dominantVector,
    supportVector: profile.supportVector ?? profile.dominantVector,
    regulationVector: "controle_emocional",
    adaptiveLevel: profile.adaptiveLevel,
    ...(profile.spi ? { spi: profile.spi } : {}),
    protocolBase: profile.protocols[0] ?? "Plano adaptativo personalizado",
    imWords: Array.from({ length: 6 }, (_, index) => selectImWordOfDay(index + 1)),
    weeklyObjectives: domainPlan.days
      .filter((day) => day.day % 7 === 1)
      .slice(0, 6)
      .map((day) => ({
        week: Math.ceil(day.day / 7),
        objective: day.focus,
        protocol: day.protocol,
      })),
    days: domainPlan.days,
  };

  return repositories.plans.save(uid, record.id, record);
}
