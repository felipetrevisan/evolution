import { ForbiddenError } from "../../shared/errors/api-error";
import { loadApiEnv } from "../env/api-env";
import { repositories } from "../repositories/repository-factory";
import { requireCurrentUser } from "./require-current-user";

export async function requireAdminUser(headers: Record<string, string | undefined>) {
  const currentUser = await requireCurrentUser(headers);

  if (currentUser.role === "admin") {
    await repositories().users.upsert(currentUser.uid, {
      ...(currentUser.email ? { email: currentUser.email } : {}),
      role: "admin",
    });
    return currentUser;
  }

  if (currentUser.email && loadApiEnv().adminEmails.includes(currentUser.email.toLowerCase())) {
    await repositories().users.upsert(currentUser.uid, {
      email: currentUser.email,
      role: "admin",
    });
    return { ...currentUser, role: "admin" as const };
  }

  const profile = await repositories().users.get(currentUser.uid);

  if (profile?.role !== "admin") {
    throw new ForbiddenError("Acesso restrito ao administrador.");
  }

  return { ...currentUser, role: "admin" as const };
}
