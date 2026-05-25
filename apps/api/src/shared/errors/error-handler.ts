import { fail } from "../http/api-response";
import { ApiError } from "./api-error";

type StatusSetter = (code: number) => unknown;

function errorField(error: unknown, field: "code" | "status" | "all" | "message"): unknown {
  return typeof error === "object" && error !== null && field in error
    ? (error as Record<string, unknown>)[field]
    : undefined;
}

export function handleError(error: unknown, status: StatusSetter) {
  if (error instanceof ApiError) {
    status(error.status);
    return fail(error.code, error.message, error.details);
  }

  if (errorField(error, "code") === "VALIDATION") {
    status(422);
    return fail("VALIDATION_ERROR", "Dados inválidos.", errorField(error, "all"));
  }

  const code = errorField(error, "code");

  if (typeof code === "string" && code.startsWith("auth/")) {
    status(401);
    return fail("UNAUTHORIZED", "Sessão inválida ou expirada.");
  }

  if (typeof code === "string" && code.startsWith("firestore/")) {
    status(503);
    return fail("PERSISTENCE_ERROR", "Não foi possível acessar os dados agora.");
  }

  const errorStatus = errorField(error, "status");
  status(typeof errorStatus === "number" ? errorStatus : 500);
  return fail("INTERNAL_ERROR", "Erro interno do servidor.");
}
