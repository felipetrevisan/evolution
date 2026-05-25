import type { UserScopedRepository } from "../../repositories/base-repository";

export type CycleRecord = {
  id: string;
  uid: string;
  createdAt: string;
  status: "active" | "completed";
  startedAt: string;
  completedAt?: string;
};

export async function getCurrentCycle(uid: string, repository: UserScopedRepository<CycleRecord>) {
  return repository.getLatest(uid);
}
