export class ApiError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status = 400,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Autenticação necessária.") {
    super("UNAUTHORIZED", message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "Acesso não permitido.") {
    super("FORBIDDEN", message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Recurso não encontrado.") {
    super("NOT_FOUND", message, 404);
  }
}

export class ConfigurationError extends ApiError {
  constructor(message = "Configuração do servidor incompleta.") {
    super("CONFIGURATION_ERROR", message, 500);
  }
}
