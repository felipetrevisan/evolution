import { describe, expect, test } from "bun:test";
import type { Auth } from "firebase-admin/auth";
import { extractBearerToken } from "../application/use-cases/auth/extract-bearer-token";
import { verifyFirebaseToken } from "../application/use-cases/auth/verify-firebase-token";
import { UnauthorizedError } from "../shared/errors/api-error";

describe("auth", () => {
  test("extracts bearer token from authorization header", () => {
    expect(extractBearerToken({ authorization: "Bearer abc123" })).toBe("abc123");
  });

  test("rejects missing or empty authorization header", () => {
    expect(() => extractBearerToken({})).toThrow(UnauthorizedError);
    expect(() => extractBearerToken({ authorization: "Bearer " })).toThrow(UnauthorizedError);
  });

  test("verifies Firebase token and extracts current user", async () => {
    const auth = {
      verifyIdToken: async () => ({ uid: "user_1", email: "user@example.com", name: "Maria" }),
    } as unknown as Auth;

    await expect(verifyFirebaseToken("token", auth)).resolves.toEqual({
      uid: "user_1",
      email: "user@example.com",
      name: "Maria",
    });
  });

  test("maps Firebase token errors to friendly unauthorized error", async () => {
    const auth = {
      verifyIdToken: async () => {
        throw new Error("expired");
      },
    } as unknown as Auth;

    await expect(verifyFirebaseToken("bad-token", auth)).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
