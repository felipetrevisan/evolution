import { completeOperationalAssessment } from "../../application/use-cases/operational-assessment/complete-operational-assessment";
import { getCurrentOperationalAssessment } from "../../application/use-cases/operational-assessment/get-current-operational-assessment";
import {
  type OperationalAssessmentRecord,
  recordOperationalAnswer,
} from "../../application/use-cases/operational-assessment/record-operational-answer";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";
import type { OperationalAnswerBodyDto } from "../dtos/operational-assessment.dto";

function operationalRepository() {
  return repositories().scoped<OperationalAssessmentRecord>("operationalAssessments");
}

export async function recordOperationalAnswerController(
  currentUser: CurrentUser,
  body: OperationalAnswerBodyDto,
) {
  return recordOperationalAnswer(currentUser.uid, body, operationalRepository());
}

export async function currentOperationalAssessmentController(currentUser: CurrentUser) {
  const repo = repositories();
  const triage = await repo.triageSessions.getLatest(currentUser.uid);
  const result = triage?.result as { fvaPriority?: { vector?: string } } | undefined;

  return getCurrentOperationalAssessment(
    currentUser.uid,
    {
      assessments: operationalRepository(),
      adminConfig: repo.adminConfig,
    },
    result?.fvaPriority?.vector,
  );
}

export async function completeOperationalAssessmentController(currentUser: CurrentUser) {
  return completeOperationalAssessment(currentUser.uid, {
    assessments: operationalRepository(),
    adminConfig: repositories().adminConfig,
  });
}
