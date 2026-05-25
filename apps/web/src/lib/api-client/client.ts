import { getIdToken } from "@/lib/firebase-client/auth";
import type { ApiEnvelope } from "./types";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export class ApiClientError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

type RequestOptions<TBody> = {
  method?: "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
  body?: TBody;
  auth?: boolean;
};

export async function apiRequest<TResponse, TBody = unknown>(
  path: string,
  options: RequestOptions<TBody> = {},
): Promise<TResponse> {
  const token = options.auth === false ? null : await getIdToken();
  const request: RequestInit = {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(options.body ? { body: JSON.stringify(options.body) } : {}),
  };
  const response = await fetch(`${apiUrl}${path}`, request);
  const envelope = (await response.json()) as ApiEnvelope<TResponse>;

  if (!envelope.success) {
    throw new ApiClientError(envelope.error.code, envelope.error.message, envelope.error.details);
  }

  return envelope.data;
}

export async function apiUpload<TResponse>(
  path: string,
  formData: FormData,
  onProgress?: (progress: number) => void,
): Promise<TResponse> {
  const token = await getIdToken();

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress?.(Math.round((event.loaded / event.total) * 100));
      }
    };

    request.onload = () => {
      try {
        const envelope = JSON.parse(request.responseText) as ApiEnvelope<TResponse>;

        if (!envelope.success) {
          reject(
            new ApiClientError(envelope.error.code, envelope.error.message, envelope.error.details),
          );
          return;
        }

        onProgress?.(100);
        resolve(envelope.data);
      } catch {
        reject(new ApiClientError("INVALID_RESPONSE", "Não foi possível concluir a ação."));
      }
    };

    request.onerror = () => {
      reject(new ApiClientError("NETWORK_ERROR", "Não foi possível enviar a imagem."));
    };

    request.open("POST", `${apiUrl}${path}`);
    if (token) {
      request.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    request.send(formData);
  });
}
