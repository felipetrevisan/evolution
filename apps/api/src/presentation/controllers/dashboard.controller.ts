import { getDashboard } from "../../application/use-cases/dashboard/get-dashboard";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";

export async function dashboardController(currentUser: CurrentUser) {
  const repo = repositories();

  return getDashboard(currentUser.uid, {
    cycles: repo.scoped("cycles"),
    plans: repo.scoped("plans"),
    checkins: repo.scoped("checkins"),
    profiles: repo.scoped("adaptiveProfiles"),
    bodyMeasurements: repo.scoped("bodyMeasurements"),
    triageSessions: repo.scoped("triageSessions"),
    operationalAssessments: repo.scoped("operationalAssessments"),
    users: repo.users,
  });
}
