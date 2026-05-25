import {
  buildCausalMap,
  resolveAbandonmentPattern,
  resolveContext,
  resolveOriginClassification,
  resolveSustainingFactor,
  resolveTrigger,
} from "@evolution/domain";
import { ApiError, ConfigurationError, NotFoundError } from "../../../shared/errors/api-error";
import type { AdminConfigRepository } from "../../repositories/admin-config-repository";
import type { UserScopedRepository } from "../../repositories/base-repository";
import { getNextQuestionFromTree } from "./investigation-flow";
import type { InvestigationRecord } from "./record-investigation-answer";

export async function completeInvestigation(
  uid: string,
  repositories: {
    investigations: UserScopedRepository<InvestigationRecord>;
    adminConfig: AdminConfigRepository;
  },
) {
  const investigation = await repositories.investigations.getLatest(uid);

  if (!investigation) {
    throw new NotFoundError("Nenhuma investigação em andamento.");
  }

  const questionTree = await repositories.adminConfig.getInvestigationQuestions(
    investigation.priorityVector,
  );

  if (!questionTree) {
    throw new ConfigurationError("Investigação não configurada no banco de dados.");
  }

  const currentQuestion = getNextQuestionFromTree(questionTree, investigation.answers);
  if (currentQuestion) {
    throw new ApiError(
      "INCOMPLETE_INVESTIGATION",
      "Conclua todas as perguntas da investigação.",
      422,
    );
  }

  const answers = new Map(
    investigation.answers.map((answer) => [answer.questionId, answer.answer]),
  );
  const originDetail = resolveOriginDetail(answers);
  const output = buildCausalMap({
    vector: investigation.priorityVector,
    origin: resolveOriginClassification(answers.get("X2")),
    ...(originDetail ? { originDetail } : {}),
    trigger: resolveTrigger(answers.get("Y2")),
    context: resolveContext(findFirstAnswer(answers, ["Y1a", "Y1b", "Y1c", "Y1d"])),
    abandonmentPattern: resolveAbandonmentPattern(
      findFirstAnswer(answers, ["Z1a", "Z1b", "Z1c", "Z1d"]),
    ),
    sustainingFactor: resolveSustainingFactor(answers.get("Z2")),
    hasPreviousFailedAttempt: answers.get("Z1") !== "Z1_C",
  });

  return repositories.investigations.save(uid, investigation.id, {
    ...investigation,
    status: "completed",
    updatedAt: new Date().toISOString(),
    output,
  });
}

function findFirstAnswer(answers: Map<string, string>, questionIds: string[]) {
  for (const questionId of questionIds) {
    const answer = answers.get(questionId);
    if (answer) return answer;
  }

  return undefined;
}

function resolveOriginDetail(answers: Map<string, string>) {
  const details: Record<string, string> = {
    X1a_A: "após mudança de rotina",
    X1a_B: "após estresse intenso",
    X1a_C: "após outra circunstância",
    X1b_A: "nos últimos 6 meses",
    X1b_B: "nos últimos 2-3 anos",
    X1b_C: "há mais tempo que consegue lembrar",
    X1c_A: "desde a infância",
    X1c_B: "desde a adolescência",
    X1c_C: "desde a vida adulta",
  };

  return details[findFirstAnswer(answers, ["X1a", "X1b", "X1c"]) ?? ""];
}
