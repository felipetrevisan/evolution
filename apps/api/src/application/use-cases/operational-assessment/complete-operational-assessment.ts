import {
  calculateOperationalScore,
  classifyBlockStatus,
  type OperationalAnswer,
  type OperationalQuestion,
  roundTo,
} from "@evolution/domain";
import { ApiError, ConfigurationError, NotFoundError } from "../../../shared/errors/api-error";
import type { AdminConfigRepository } from "../../repositories/admin-config-repository";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { OperationalAssessmentRecord } from "./record-operational-answer";

export async function completeOperationalAssessment(
  uid: string,
  repositories: {
    assessments: UserScopedRepository<OperationalAssessmentRecord>;
    adminConfig: AdminConfigRepository;
  },
) {
  const [assessment, questions] = await Promise.all([
    repositories.assessments.getLatest(uid),
    repositories.adminConfig.getOperationalQuestions(),
  ]);

  if (!assessment) {
    throw new NotFoundError("Nenhuma autoavaliação operacional em andamento.");
  }

  if (!questions) {
    throw new ConfigurationError("Autoavaliação operacional não configurada no banco de dados.");
  }

  const requiredQuestionIds = questions.map((question) => question.id);
  const answeredQuestionIds = new Set(assessment.values.map((answer) => answer.questionId));
  const missingQuestionIds = requiredQuestionIds.filter((id) => !answeredQuestionIds.has(id));

  if (missingQuestionIds.length > 0) {
    throw new ApiError(
      "INVALID_OPERATIONAL_ASSESSMENT",
      "Responda todas as perguntas antes de continuar.",
      422,
      {
        answered: answeredQuestionIds.size,
        missing: missingQuestionIds,
        required: requiredQuestionIds.length,
      },
    );
  }

  const score = calculateOperationalScore(assessment.values);
  const blockScores = {
    X: calculateDynamicBlockScore(assessment.values, questions, "X"),
    Y: calculateDynamicBlockScore(assessment.values, questions, "Y"),
    Z: calculateDynamicBlockScore(assessment.values, questions, "Z"),
  };

  return repositories.assessments.save(uid, assessment.id, {
    ...assessment,
    status: "completed",
    updatedAt: new Date().toISOString(),
    values: assessment.values,
    result: {
      score,
      blocks: {
        X: { ...blockScores.X, status: classifyBlockStatus(blockScores.X.normalized) },
        Y: { ...blockScores.Y, status: classifyBlockStatus(blockScores.Y.normalized) },
        Z: { ...blockScores.Z, status: classifyBlockStatus(blockScores.Z.normalized) },
      },
    },
  });
}

function calculateDynamicBlockScore(
  answers: OperationalAnswer[],
  questions: OperationalQuestion[],
  block: "X" | "Y" | "Z",
) {
  const questionIds = questions
    .filter((question) => question.block === block)
    .map((question) => question.id);
  const raw = answers
    .filter((answer) => questionIds.includes(answer.questionId))
    .reduce((sum, answer) => sum + answer.value, 0);

  return {
    raw,
    normalized: roundTo(((raw - 4) / 20) * 100, 2),
  };
}
