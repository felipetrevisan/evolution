export function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
