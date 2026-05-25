import { extractBearerToken } from "../../application/use-cases/auth/extract-bearer-token";
import { verifyFirebaseToken } from "../../application/use-cases/auth/verify-firebase-token";
import { loadApiEnv } from "../env/api-env";
import { getFirebaseAuth } from "../firebase/admin";
import type { CurrentUser } from "./current-user";

export async function requireCurrentUser(
  headers: Record<string, string | undefined>,
): Promise<CurrentUser> {
  const currentUser = await verifyFirebaseToken(extractBearerToken(headers), getFirebaseAuth());
  const email = currentUser.email?.toLowerCase();
  const isEnvAdmin = email ? loadApiEnv().adminEmails.includes(email) : false;

  return {
    ...currentUser,
    ...(isEnvAdmin ? { role: "admin" as const } : {}),
  };
}
