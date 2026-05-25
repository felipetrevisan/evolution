import { applyTriageTieBreak } from "../../application/use-cases/triage/apply-triage-tie-break";
import { completeTriage } from "../../application/use-cases/triage/complete-triage";
import { getCurrentTriageResult } from "../../application/use-cases/triage/get-current-triage-result";
import { getCurrentTriageSession } from "../../application/use-cases/triage/get-current-triage-session";
import { getTriageQuestions } from "../../application/use-cases/triage/get-triage-questions";
import {
  recordTriageAnswer,
  type TriageSessionRecord,
} from "../../application/use-cases/triage/record-triage-answer";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";
import type { TriageAnswerBodyDto, TriageTieBreakBodyDto } from "../dtos/triage.dto";

function triageRepository() {
  return repositories().scoped<TriageSessionRecord>("triageSessions");
}

export async function recordTriageAnswerController(
  currentUser: CurrentUser,
  body: TriageAnswerBodyDto,
) {
  return recordTriageAnswer(currentUser.uid, body, triageRepository());
}

export async function triageQuestionsController() {
  return getTriageQuestions(repositories().adminConfig);
}

export async function currentTriageSessionController(currentUser: CurrentUser) {
  return getCurrentTriageSession(currentUser.uid, triageRepository());
}

export async function completeTriageController(currentUser: CurrentUser) {
  const config = await getTriageQuestions(repositories().adminConfig);

  return completeTriage(currentUser.uid, triageRepository(), config.questions);
}

export async function triageTieBreakController(
  currentUser: CurrentUser,
  body: TriageTieBreakBodyDto,
) {
  return applyTriageTieBreak(currentUser.uid, body, triageRepository());
}

export async function currentTriageResultController(currentUser: CurrentUser) {
  return getCurrentTriageResult(currentUser.uid, triageRepository());
}
