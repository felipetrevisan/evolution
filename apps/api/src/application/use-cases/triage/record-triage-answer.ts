import {
  SELECOES_OBRIGATORIAS,
  type TriageSelection,
} from "../../../../../../packages/domain/src/index.ts";
import type { TriageAnswerBodyDto } from "../../../presentation/dtos/triage.dto";
import { ApiError } from "../../../shared/errors/api-error";
import { createId } from "../../../shared/validation/id";
import type { UserScopedRepository } from "../../repositories/base-repository";

export type TriageSessionRecord = {
  id: string;
  uid: string;
  createdAt: string;
  updatedAt: string;
  status: "in_progress" | "completed";
  answers: TriageSelection[];
  result?: unknown;
};

export async function recordTriageAnswer(
  uid: string,
  dto: TriageAnswerBodyDto,
  repository: UserScopedRepository<TriageSessionRecord>,
) {
  const existing = dto.sessionId ? await repository.get(uid, dto.sessionId) : null;
  const now = new Date().toISOString();
  if (dto.selections.length !== SELECOES_OBRIGATORIAS) {
    throw new ApiError("INVALID_TRIAGE_SELECTION", "Selecione exatamente 6 alternativas.", 422);
  }

  const nextAnswers = [
    ...(existing?.answers ?? []).filter((answer) => answer.questionId !== dto.questionId),
    ...dto.selections.map((selection) => ({
      questionId: dto.questionId,
      alternativeId: selection.alternativeId,
      vector: selection.vector,
      ...(dto.layer ? { layer: dto.layer } : {}),
    })),
  ];
  const record: TriageSessionRecord = {
    id: existing?.id ?? dto.sessionId ?? createId("triage"),
    uid,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    status: "in_progress",
    answers: nextAnswers,
  };

  return repository.save(uid, record.id, record);
}
