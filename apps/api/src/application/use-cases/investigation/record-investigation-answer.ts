import type {
  InvestigationAnswer,
  VectorKey,
} from "../../../../../../packages/domain/src/index.ts";
import type { GenericAnswerBodyDto } from "../../../presentation/dtos/answer.dto";
import { ApiError, ConfigurationError, NotFoundError } from "../../../shared/errors/api-error";
import { createId } from "../../../shared/validation/id";
import type { AdminConfigRepository } from "../../repositories/admin-config-repository";
import type { UserScopedRepository } from "../../repositories/base-repository";
import { getNextQuestionFromTree } from "./investigation-flow";

export type InvestigationRecord = {
  id: string;
  uid: string;
  createdAt: string;
  updatedAt: string;
  status: "in_progress" | "completed";
  priorityVector: VectorKey;
  answers: InvestigationAnswer[];
  output?: unknown;
};

export async function recordInvestigationAnswer(
  uid: string,
  dto: GenericAnswerBodyDto,
  repositories: {
    investigations: UserScopedRepository<InvestigationRecord>;
    adminConfig: AdminConfigRepository;
  },
) {
  const existing = dto.sessionId
    ? await repositories.investigations.get(uid, dto.sessionId)
    : await repositories.investigations.getLatest(uid);

  if (!existing) {
    throw new NotFoundError("Inicie a investigação antes de responder.");
  }

  const questionTree = await repositories.adminConfig.getInvestigationQuestions(
    existing.priorityVector,
  );

  if (!questionTree) {
    throw new ConfigurationError("Investigação não configurada no banco de dados.");
  }

  const currentQuestion = getNextQuestionFromTree(questionTree, existing.answers);
  if (!currentQuestion || currentQuestion.id !== dto.questionId) {
    throw new ApiError(
      "INVALID_INVESTIGATION_STEP",
      "Pergunta da investigação fora de ordem.",
      422,
    );
  }

  const selectedOption = currentQuestion.options.find((option) => option.id === String(dto.answer));
  if (!selectedOption) {
    throw new ApiError("INVALID_INVESTIGATION_ANSWER", "Selecione uma alternativa válida.", 422);
  }

  const now = new Date().toISOString();
  const nextAnswers = [
    ...existing.answers.filter((answer) => answer.questionId !== dto.questionId),
    { questionId: dto.questionId, answer: selectedOption.id },
  ];

  const record: InvestigationRecord = {
    id: existing.id ?? dto.sessionId ?? createId("investigation"),
    uid,
    createdAt: existing.createdAt ?? now,
    updatedAt: now,
    status: "in_progress",
    priorityVector: existing.priorityVector,
    answers: nextAnswers,
  };

  return {
    ...(await repositories.investigations.save(uid, record.id, record)),
    currentQuestion: getNextQuestionFromTree(questionTree, record.answers),
    questionTree,
  };
}
