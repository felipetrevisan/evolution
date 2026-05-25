import type { CurrentUser } from "../../../infrastructure/auth/current-user";
import type { ProfileBodyDto } from "../../../presentation/dtos/profile.dto";
import type { UserRepository } from "../../repositories/user-repository";

export async function upsertProfile(
  currentUser: CurrentUser,
  dto: ProfileBodyDto,
  repository: UserRepository,
) {
  return repository.upsert(currentUser.uid, {
    ...(currentUser.email ? { email: currentUser.email } : {}),
    ...((dto.name ?? currentUser.name) ? { name: dto.name ?? currentUser.name } : {}),
    ...(dto.photoUrl ? { photoUrl: dto.photoUrl } : {}),
    ...(dto.birthDate ? { birthDate: dto.birthDate } : {}),
    ...(dto.gender ? { gender: dto.gender } : {}),
    ...(dto.goals ? { goals: dto.goals } : {}),
  });
}
