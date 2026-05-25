import type { Auth } from "firebase-admin/auth";
import type { CurrentUser } from "../../../infrastructure/auth/current-user";
import { UnauthorizedError } from "../../../shared/errors/api-error";

export async function verifyFirebaseToken(token: string, auth: Auth): Promise<CurrentUser> {
  try {
    const decoded = await auth.verifyIdToken(token);

    return {
      uid: decoded.uid,
      ...(decoded.email ? { email: decoded.email } : {}),
      ...(decoded.name ? { name: decoded.name as string } : {}),
      ...(decoded.role === "admin" || decoded.admin === true ? { role: "admin" as const } : {}),
    };
  } catch {
    throw new UnauthorizedError("Token Firebase inválido ou expirado.");
  }
}
