import {
  getCheckInHistory,
  getTodayCheckIn,
} from "../../application/use-cases/check-in/get-check-ins";
import {
  type CheckInRecord,
  saveCheckIn,
} from "../../application/use-cases/check-in/save-check-in";
import type { CurrentUser } from "../../infrastructure/auth/current-user";
import { repositories } from "../../infrastructure/repositories/repository-factory";
import type { CheckInBodyDto } from "../dtos/check-in.dto";

function checkInRepository() {
  return repositories().scoped<CheckInRecord>("checkins");
}

export async function saveCheckInController(currentUser: CurrentUser, body: CheckInBodyDto) {
  const repo = repositories();
  return saveCheckIn(currentUser.uid, body, {
    checkins: checkInRepository(),
    cycles: repo.scoped("cycles"),
    plans: repo.scoped("plans"),
  });
}

export async function todayCheckInController(currentUser: CurrentUser) {
  const repo = repositories();
  return getTodayCheckIn(currentUser.uid, {
    checkins: checkInRepository(),
    cycles: repo.scoped("cycles"),
    plans: repo.scoped("plans"),
  });
}

export async function checkInHistoryController(currentUser: CurrentUser) {
  return getCheckInHistory(currentUser.uid, checkInRepository());
}
