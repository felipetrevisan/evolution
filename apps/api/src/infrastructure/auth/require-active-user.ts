import { getSubscriptionAccess } from "../../application/use-cases/subscription/subscription-access";
import { ForbiddenError } from "../../shared/errors/api-error";
import { repositories } from "../repositories/repository-factory";
import type { CurrentUser } from "./current-user";

export async function requireActiveUser(currentUser: CurrentUser) {
  if (currentUser.role === "admin") {
    return currentUser;
  }

  const profile = await repositories().users.get(currentUser.uid);
  const subscription = getSubscriptionAccess(profile);

  if (profile?.role === "admin" || subscription.canAccess) {
    const role = profile?.role ?? currentUser.role;
    return {
      ...currentUser,
      ...(role ? { role } : {}),
    };
  }

  throw new ForbiddenError("Assinatura ativa necessária para acessar o sistema.");
}
