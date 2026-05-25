import {
  type AdaptiveProfileRecord,
  generateAdaptiveProfile,
} from "../../application/use-cases/adaptive-engine/generate-adaptive-profile";
import type { InvestigationRecord } from "../../application/use-cases/investigation/record-investigation-answer";
import type { OperationalAssessmentRecord } from "../../application/use-cases/operational-assessment/record-operational-answer";
import type { TriageSessionRecord } from "../../application/use-cases/triage/record-triage-answer";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";

export async function generateAdaptiveProfileController(currentUser: CurrentUser) {
  const repo = repositories();

  return generateAdaptiveProfile(currentUser.uid, {
    profiles: repo.scoped<AdaptiveProfileRecord>("adaptiveProfiles"),
    triageSessions: repo.scoped<TriageSessionRecord>("triageSessions"),
    investigations: repo.scoped<InvestigationRecord>("investigations"),
    operationalAssessments: repo.scoped<OperationalAssessmentRecord>("operationalAssessments"),
    anamnese: repo.anamnese,
  });
}
