import type {
  DiagnosticSummary,
  InvestigationAnswer,
} from "../../../../../../packages/domain/src/index.ts";
import { ApiError, ConfigurationError, NotFoundError } from "../../../shared/errors/api-error";
import { createId } from "../../../shared/validation/id";
import type { AdminConfigRepository } from "../../repositories/admin-config-repository";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { TriageSessionRecord } from "../triage/record-triage-answer";
import { getNextQuestionFromTree } from "./investigation-flow";
import type { InvestigationRecord } from "./record-investigation-answer";

export async function getCurrentInvestigation(
  uid: string,
  repositories: {
    investigations: UserScopedRepository<InvestigationRecord>;
    triageSessions: UserScopedRepository<TriageSessionRecord>;
    adminConfig: AdminConfigRepository;
  },
) {
  const existing = await repositories.investigations.getLatest(uid);
  const priorityVector = existing?.priorityVector ?? (await getPriorityVector(uid, repositories));
  const questionTree = await repositories.adminConfig.getInvestigationQuestions(priorityVector);

  if (!questionTree) {
    throw new ConfigurationError("Investigação não configurada no banco de dados.");
  }

  if (existing) {
    return {
      ...existing,
      currentQuestion: getNextQuestionFromTree(questionTree, existing.answers),
      questionTree,
    };
  }

  const now = new Date().toISOString();
  const record: InvestigationRecord = {
    id: createId("investigation"),
    uid,
    createdAt: now,
    updatedAt: now,
    status: "in_progress",
    priorityVector,
    answers: [] satisfies InvestigationAnswer[],
  };

  await repositories.investigations.save(uid, record.id, record);

  return {
    ...record,
    currentQuestion: questionTree[0],
    questionTree,
  };
}

async function getPriorityVector(
  uid: string,
  repositories: {
    triageSessions: UserScopedRepository<TriageSessionRecord>;
  },
) {
  const triage = await repositories.triageSessions.getLatest(uid);
  const result = triage?.result as DiagnosticSummary | undefined;

  if (!result) {
    throw new NotFoundError("Conclua a triagem antes da investigação.");
  }

  if (result.fvaPriority.requiresUserChoice || !result.fvaPriority.vector) {
    throw new ApiError(
      "TRIAGE_TIE_BREAK_REQUIRED",
      "Escolha sua prioridade inicial no resultado da triagem antes de continuar.",
      409,
    );
  }

  if (result.imPriority.requiresUserChoice) {
    throw new ApiError(
      "TRIAGE_TIE_BREAK_REQUIRED",
      "Escolha seu foco de motivação no resultado da triagem antes de continuar.",
      409,
    );
  }
  return result.fvaPriority.vector;
}
