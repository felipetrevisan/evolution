import { getCurrentCycleReport } from "../../application/use-cases/cycle-report/get-current-cycle-report";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";

export async function currentCycleReportController(currentUser: CurrentUser) {
  const repo = repositories();
  return getCurrentCycleReport(currentUser.uid, {
    reports: repo.scoped("reports"),
    cycles: repo.scoped("cycles"),
    checkins: repo.scoped("checkins"),
    bodyMeasurements: repo.scoped("bodyMeasurements"),
    triageSessions: repo.scoped("triageSessions"),
  });
}
