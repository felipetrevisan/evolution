import { ConfigurationError } from "../../../shared/errors/api-error";
import { createId } from "../../../shared/validation/id";
import type { AdminConfigRepository } from "../../repositories/admin-config-repository";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { OperationalAssessmentRecord } from "./record-operational-answer";

export async function getCurrentOperationalAssessment(
  uid: string,
  repositories: {
    assessments: UserScopedRepository<OperationalAssessmentRecord>;
    adminConfig: AdminConfigRepository;
  },
  priorityVector?: string,
) {
  const questions = await repositories.adminConfig.getOperationalQuestions();

  if (!questions) {
    throw new ConfigurationError("Autoavaliação operacional não configurada no banco de dados.");
  }

  const existing = await repositories.assessments.getLatest(uid);

  if (existing) {
    return {
      ...existing,
      priorityVector,
      questions,
      attentionQuestions: [
        { id: "health_attention", text: "Há alguma condição de saúde que exige atenção hoje?" },
        { id: "emotional_attention", text: "Há algum fator emocional intenso nesta semana?" },
      ],
    };
  }

  const now = new Date().toISOString();
  const record: OperationalAssessmentRecord = {
    id: createId("operational"),
    uid,
    createdAt: now,
    updatedAt: now,
    status: "in_progress",
    values: [],
  };

  await repositories.assessments.save(uid, record.id, record);
  return getCurrentOperationalAssessment(uid, repositories, priorityVector);
}
