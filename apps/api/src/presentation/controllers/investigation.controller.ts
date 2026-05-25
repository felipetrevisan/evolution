import { completeInvestigation } from "../../application/use-cases/investigation/complete-investigation";
import { getCurrentInvestigation } from "../../application/use-cases/investigation/get-current-investigation";
import {
  type InvestigationRecord,
  recordInvestigationAnswer,
} from "../../application/use-cases/investigation/record-investigation-answer";
import type { TriageSessionRecord } from "../../application/use-cases/triage/record-triage-answer";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";
import type { GenericAnswerBodyDto } from "../dtos/answer.dto";

function investigationRepository() {
  return repositories().scoped<InvestigationRecord>("investigations");
}

function triageRepository() {
  return repositories().scoped<TriageSessionRecord>("triageSessions");
}

export async function recordInvestigationAnswerController(
  currentUser: CurrentUser,
  body: GenericAnswerBodyDto,
) {
  return recordInvestigationAnswer(currentUser.uid, body, {
    investigations: investigationRepository(),
    adminConfig: repositories().adminConfig,
  });
}

export async function currentInvestigationController(currentUser: CurrentUser) {
  return getCurrentInvestigation(currentUser.uid, {
    investigations: investigationRepository(),
    triageSessions: triageRepository(),
    adminConfig: repositories().adminConfig,
  });
}

export async function completeInvestigationController(currentUser: CurrentUser) {
  return completeInvestigation(currentUser.uid, {
    investigations: investigationRepository(),
    adminConfig: repositories().adminConfig,
  });
}
