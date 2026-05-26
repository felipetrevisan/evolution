import type { TriageTieBreakBodyDto } from "../../../presentation/dtos/triage.dto";
import { ApiError, NotFoundError } from "../../../shared/errors/api-error";
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
  const result = typeof session.result === "object" && session.result ? session.result : {};
  const priorityKey = dto.layer === "FVA" ? "fvaPriority" : "imPriority";
  const priority = result[priorityKey as keyof typeof result] as
    | { tiedVectors?: string[] }
    | undefined;
  const tiedVectors = priority?.tiedVectors ?? [];

  if (!tiedVectors.includes(dto.vector)) {
    throw new ApiError("INVALID_TIE_BREAK", "Escolha uma opção empatada válida.", 422);
  }

  return repository.save(uid, session.id, {
    ...session,
    updatedAt: new Date().toISOString(),
    result: {
      ...result,
      [priorityKey]: {
        ...priority,
        vector: dto.vector,
        requiresUserChoice: false,
        tiedVectors,
      },
      tieBreak: dto,
    },
  });
}
