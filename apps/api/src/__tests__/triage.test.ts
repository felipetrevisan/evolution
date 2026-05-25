import { describe, expect, test } from "bun:test";
import type { VectorKey } from "@evolution/domain";
import { completeTriage } from "../application/use-cases/triage/complete-triage";
import { getCurrentTriageSession } from "../application/use-cases/triage/get-current-triage-session";
import {
  recordTriageAnswer,
  type TriageSessionRecord,
} from "../application/use-cases/triage/record-triage-answer";
import { ApiError } from "../shared/errors/api-error";
import { createMemoryRepository } from "./test-repository";

const vectors: VectorKey[] = [
  "comportamento",
  "constancia",
  "gestao_pessoal",
  "controle_emocional",
];

describe("triage use cases", () => {
  test("rejects answers with fewer than six selections", async () => {
    const repository = createMemoryRepository<TriageSessionRecord>();

    await expect(
      recordTriageAnswer(
        "user_1",
        {
          questionId: 1,
          selections: [{ alternativeId: "a1", vector: "comportamento" }],
        },
        repository,
      ),
    ).rejects.toBeInstanceOf(ApiError);
  });

  test("completes valid triage session with diagnostic result", async () => {
    const repository = createMemoryRepository<TriageSessionRecord>();
    let sessionId: string | undefined;

    for (let questionId = 1; questionId <= 6; questionId += 1) {
      const saved = await recordTriageAnswer(
        "user_1",
        {
          ...(sessionId ? { sessionId } : {}),
          questionId,
          selections: Array.from({ length: 6 }, (_, index) => ({
            alternativeId: `q${questionId}_${index}`,
            vector: vectors[index % vectors.length] as VectorKey,
          })),
        },
        repository,
      );
      sessionId = saved.id;
    }

    const completed = await completeTriage("user_1", repository);

    expect(completed.status).toBe("completed");
    expect(completed.result).toBeTruthy();
  });

  test("completes answers saved across separate sessions", async () => {
    const repository = createMemoryRepository<TriageSessionRecord>();

    for (let questionId = 1; questionId <= 6; questionId += 1) {
      await recordTriageAnswer(
        "user_1",
        {
          questionId,
          selections: Array.from({ length: 6 }, (_, index) => ({
            alternativeId: `q${questionId}_${index}`,
            vector: vectors[index % vectors.length] as VectorKey,
          })),
        },
        repository,
      );
    }

    const completed = await completeTriage("user_1", repository);

    expect(completed.status).toBe("completed");
    expect((completed.answers as unknown[]).length).toBe(36);
  });

  test("returns in-progress triage answers merged by question", async () => {
    const repository = createMemoryRepository<TriageSessionRecord>();

    for (let questionId = 1; questionId <= 3; questionId += 1) {
      await recordTriageAnswer(
        "user_1",
        {
          questionId,
          selections: Array.from({ length: 6 }, (_, index) => ({
            alternativeId: `q${questionId}_${index}`,
            vector: vectors[index % vectors.length] as VectorKey,
          })),
        },
        repository,
      );
    }

    const session = await getCurrentTriageSession("user_1", repository);

    expect(session?.status).toBe("in_progress");
    expect(session?.answers.length).toBe(18);
  });
});
