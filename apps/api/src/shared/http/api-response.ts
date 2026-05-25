export type ApiSuccess<TData, TMeta = Record<string, unknown>> = {
  success: true;
  data: TData;
  meta: TMeta;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function ok<TData, TMeta = Record<string, unknown>>(
  data: TData,
  meta = {} as TMeta,
): ApiSuccess<TData, TMeta> {
  return {
    success: true,
    data,
    meta,
  };
}

export function fail(code: string, message: string, details?: unknown): ApiFailure {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  };
}
