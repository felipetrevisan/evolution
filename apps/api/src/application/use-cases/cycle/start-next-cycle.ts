import { createId } from "../../../shared/validation/id";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { CycleRecord } from "./get-current-cycle";

export async function startNextCycle(uid: string, repository: UserScopedRepository<CycleRecord>) {
  const record: CycleRecord = {
    id: createId("cycle"),
    uid,
    createdAt: new Date().toISOString(),
    status: "active",
    startedAt: new Date().toISOString(),
  };

  return repository.save(uid, record.id, record);
}
