import { completeCycle } from "../../application/use-cases/cycle/complete-cycle";
import {
  type CycleRecord,
  getCurrentCycle,
} from "../../application/use-cases/cycle/get-current-cycle";
import { startNextCycle } from "../../application/use-cases/cycle/start-next-cycle";
import { generateCycleReport } from "../../application/use-cases/cycle-report/generate-cycle-report";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";

function cycleRepository() {
  return repositories().scoped<CycleRecord>("cycles");
}

export async function currentCycleController(currentUser: CurrentUser) {
  return getCurrentCycle(currentUser.uid, cycleRepository());
}

export async function completeCycleController(currentUser: CurrentUser) {
  const repo = repositories();
  const cycle = await completeCycle(currentUser.uid, cycleRepository());
  await generateCycleReport(currentUser.uid, cycle, {
    reports: repo.scoped("reports"),
    checkins: repo.scoped("checkins"),
    bodyMeasurements: repo.scoped("bodyMeasurements"),
    triageSessions: repo.scoped("triageSessions"),
  });
  return cycle;
}

export async function startNextCycleController(currentUser: CurrentUser) {
  return startNextCycle(currentUser.uid, cycleRepository());
}
