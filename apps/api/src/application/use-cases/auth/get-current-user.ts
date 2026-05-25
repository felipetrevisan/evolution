import type { CurrentUser } from "../../../infrastructure/auth/current-user";
import type { UserRepository } from "../../repositories/user-repository";

export async function getCurrentUser(currentUser: CurrentUser, repository: UserRepository) {
  const existingProfile = await repository.get(currentUser.uid);
  const role = currentUser.role ?? existingProfile?.role ?? "user";
  const profile =
    existingProfile ??
    (await repository.upsert(currentUser.uid, {
      ...(currentUser.email ? { email: currentUser.email } : {}),
      ...(currentUser.name ? { name: currentUser.name } : {}),
      role,
      subscription: { status: "free" },
    }));
  const resolvedProfile =
    profile.role === role ? profile : await repository.upsert(currentUser.uid, { role });

  return {
    ...currentUser,
    role: resolvedProfile.role ?? role,
    profile: resolvedProfile,
  };
}
