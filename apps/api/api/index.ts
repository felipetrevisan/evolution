import type { Elysia } from "elysia";

type NodeRequest = AsyncIterable<Buffer | string> & {
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
  method?: string;
  url?: string;
};

type NodeResponse = {
  end: (body?: Buffer | string) => void;
  setHeader: (name: string, value: number | string | string[]) => void;
  statusCode: number;
};

let appPromise: Promise<Elysia> | null = null;

export default async function handler(request: NodeRequest, response: NodeResponse) {
  setCorsHeaders(request, response);

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  const app = await getApp().catch((error: unknown) => {
    response.statusCode = 500;
    response.setHeader("content-type", "application/json; charset=utf-8");
    response.end(JSON.stringify({ error: serializeStartupError(error) }));
    return null;
  });

  if (!app) {
    return;
  }

  const webResponse = await app.handle(await toWebRequest(request));

  response.statusCode = webResponse.status;
  webResponse.headers.forEach((value, key) => {
    response.setHeader(key, value);
  });
  response.end(Buffer.from(await webResponse.arrayBuffer()));
}

function getApp() {
  appPromise ??= import("../src/app").then((module) => module.default);
  return appPromise;
}

function setCorsHeaders(request: NodeRequest, response: NodeResponse) {
  const origin = getHeader(request.headers, "origin") ?? "https://evolution.institutoez.com.br";

  response.setHeader("access-control-allow-origin", origin);
  response.setHeader("access-control-allow-credentials", "true");
  response.setHeader("access-control-allow-methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  response.setHeader("access-control-allow-headers", "Content-Type, Authorization");
  response.setHeader("vary", "Origin");
}

function getHeader(headers: NodeRequest["headers"], name: string) {
  const value = headers[name] ?? headers[name.toLowerCase()];

  return Array.isArray(value) ? value[0] : value;
}

function serializeStartupError(error: unknown) {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
    };
  }

  return { message: String(error) };
}

async function toWebRequest(request: NodeRequest) {
  const method = request.method ?? "GET";
  const headers = toWebHeaders(request.headers);
  const url = new URL(request.url ?? "/", `https://${headers.get("host") ?? "localhost"}`);
  const body = shouldReadBody(method) ? await readBody(request) : undefined;

  return new Request(url, {
    method,
    headers,
    ...(body ? { body } : {}),
  });
}

function toWebHeaders(headers: NodeRequest["headers"]) {
  const webHeaders = new Headers();

  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === "string") {
      webHeaders.set(key, value);
    } else if (Array.isArray(value)) {
      webHeaders.set(key, value.join(", "));
    }
  }

  return webHeaders;
}

function shouldReadBody(method: string) {
  return method !== "GET" && method !== "HEAD";
}

async function readBody(request: NodeRequest) {
  if (typeof request.body === "string") {
    return request.body;
  }

  if (request.body && typeof request.body === "object") {
    return JSON.stringify(request.body);
  }

  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return chunks.length > 0 ? Buffer.concat(chunks) : undefined;
}
