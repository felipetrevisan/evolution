import { saveAnamnese } from "../../application/use-cases/anamnese/save-anamnese";
import { getOnboardingStatus } from "../../application/use-cases/onboarding/get-onboarding-status";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";
import type { AnamneseBodyDto } from "../dtos/anamnese.dto";

export async function saveAnamneseController(currentUser: CurrentUser, body: AnamneseBodyDto) {
  const repo = repositories();
  return saveAnamnese(currentUser.uid, body, {
    anamnese: repo.anamnese,
    bodyMeasurements: repo.bodyMeasurements,
    cycles: repo.cycles,
    users: repo.users,
  });
}

export async function onboardingStatusController(currentUser: CurrentUser) {
  const repo = repositories();

  return getOnboardingStatus(currentUser.uid, {
    cycles: repo.cycles,
    anamnese: repo.anamnese,
    bodyMeasurements: repo.bodyMeasurements,
    triageSessions: repo.triageSessions,
    investigations: repo.investigations,
    operationalAssessments: repo.operationalAssessments,
    adaptiveProfiles: repo.adaptiveProfiles,
    plans: repo.plans,
  });
}
