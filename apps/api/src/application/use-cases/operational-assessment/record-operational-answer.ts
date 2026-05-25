import type { OperationalAnswer } from "@evolution/domain";
import type { OperationalAnswerBodyDto } from "../../../presentation/dtos/operational-assessment.dto";
import { ApiError } from "../../../shared/errors/api-error";
import { createId } from "../../../shared/validation/id";
import type { UserScopedRepository } from "../../repositories/base-repository";

export type OperationalAssessmentRecord = {
  id: string;
  uid: string;
  createdAt: string;
  updatedAt: string;
  status: "in_progress" | "completed";
  values: OperationalAnswer[];
  attentionAnswers?: Array<{ questionId: string; value: boolean }>;
  result?: unknown;
};

export async function recordOperationalAnswer(
  uid: string,
  dto: OperationalAnswerBodyDto,
  repository: UserScopedRepository<OperationalAssessmentRecord>,
) {
  const existing = dto.assessmentId ? await repository.get(uid, dto.assessmentId) : null;
  const now = new Date().toISOString();
  const hasLikertAnswer = dto.questionId !== undefined && dto.value !== undefined;
  const hasAttentionAnswer =
    dto.attentionQuestionId !== undefined && dto.attentionValue !== undefined;

  if (!hasLikertAnswer && !hasAttentionAnswer) {
    throw new ApiError("INVALID_OPERATIONAL_ANSWER", "Resposta operacional inválida.", 422);
  }

  const nextValues = [...(existing?.values ?? [])];
  const nextAttention = [...(existing?.attentionAnswers ?? [])];

  if (hasLikertAnswer) {
    const questionId = dto.questionId as number;
    const value = dto.value as OperationalAnswer["value"];
    const previousIndex = nextValues.findIndex((answer) => answer.questionId === questionId);

    if (previousIndex >= 0) {
      nextValues[previousIndex] = { questionId, value };
    } else {
      nextValues.push({ questionId, value });
    }
  }

  if (hasAttentionAnswer) {
    const questionId = dto.attentionQuestionId as string;
    const value = dto.attentionValue as boolean;
    const previousIndex = nextAttention.findIndex((answer) => answer.questionId === questionId);

    if (previousIndex >= 0) {
      nextAttention[previousIndex] = { questionId, value };
    } else {
      nextAttention.push({ questionId, value });
    }
  }

  const record: OperationalAssessmentRecord = {
    id: existing?.id ?? dto.assessmentId ?? createId("operational"),
    uid,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    status: "in_progress",
    values: nextValues,
    attentionAnswers: nextAttention,
  };

  return repository.save(uid, record.id, record);
}
