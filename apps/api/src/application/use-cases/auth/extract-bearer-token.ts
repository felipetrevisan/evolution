import { UnauthorizedError } from "../../../shared/errors/api-error";

export function extractBearerToken(headers: Record<string, string | undefined>): string {
  const header = headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token) {
    throw new UnauthorizedError();
  }

  return token;
}
