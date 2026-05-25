import type { UserScopedRepository } from "../../repositories/base-repository";
import type { TriageSessionRecord } from "./record-triage-answer";

export async function getCurrentTriageResult(
  uid: string,
  repository: UserScopedRepository<TriageSessionRecord>,
) {
  return repository.getLatest(uid);
}
