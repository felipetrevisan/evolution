import { createApp } from "./app";

const app = createApp();

export function handleVercelRequest(request: Request) {
  return app.handle(normalizeRequestPath(request));
}

function normalizeRequestPath(request: Request) {
  const url = new URL(request.url);

  if (url.pathname === "/api") {
    url.pathname = "/";
  }

  if (url.pathname.startsWith("/api/")) {
    url.pathname = url.pathname.slice(4);
  }

  return new Request(url, request);
}
