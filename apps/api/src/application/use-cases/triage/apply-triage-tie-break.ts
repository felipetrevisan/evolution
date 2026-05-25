import type { TriageTieBreakBodyDto } from "../../../presentation/dtos/triage.dto";
import { NotFoundError } from "../../../shared/errors/api-error";
import type { UserScopedRepository } from "../../repositories/base-repository";
import type { TriageSessionRecord } from "./record-triage-answer";

export async function applyTriageTieBreak(
  uid: string,
  dto: TriageTieBreakBodyDto,
  repository: UserScopedRepository<TriageSessionRecord>,
) {
  const session = await repository.getLatest(uid);

  if (!session) {
    throw new NotFoundError("Nenhuma sessão de triagem encontrada.");
  }

  return repository.save(uid, session.id, {
    ...session,
    updatedAt: new Date().toISOString(),
    result: {
      ...(typeof session.result === "object" && session.result ? session.result : {}),
      tieBreak: dto,
    },
  });
}
