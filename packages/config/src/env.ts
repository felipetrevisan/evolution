export function requiredEnv(name: string, source: Record<string, string | undefined>): string {
  const value = source[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function optionalEnv(
  name: string,
  source: Record<string, string | undefined>,
  fallback = "",
): string {
  return source[name] ?? fallback;
}
