type FirestoreValue =
  | null
  | boolean
  | number
  | string
  | FirestoreValue[]
  | { [key: string]: FirestoreValue };

export function sanitizeForFirestore<T>(value: T): T {
  return stripUndefined(value) as T;
}

function stripUndefined(value: unknown): FirestoreValue | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || typeof value !== "object") {
    return value as FirestoreValue;
  }

  if (Array.isArray(value)) {
    return value.map(stripUndefined).filter((item) => item !== undefined) as FirestoreValue[];
  }

  const entries = Object.entries(value)
    .map(([key, entryValue]) => [key, stripUndefined(entryValue)] as const)
    .filter(([, entryValue]) => entryValue !== undefined);

  return Object.fromEntries(entries) as { [key: string]: FirestoreValue };
}
