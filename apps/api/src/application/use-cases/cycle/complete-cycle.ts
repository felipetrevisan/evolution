import { NotFoundError } from "../../../shared/errors/api-error";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { CycleRecord } from "./get-current-cycle";

export async function completeCycle(uid: string, repository: UserScopedRepository<CycleRecord>) {
  const cycle = await repository.getLatest(uid);

  if (!cycle) {
    throw new NotFoundError("Nenhum ciclo ativo encontrado.");
  }

  return repository.save(uid, cycle.id, {
    ...cycle,
    status: "completed",
    completedAt: new Date().toISOString(),
  });
}
