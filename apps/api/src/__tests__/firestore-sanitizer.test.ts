import { describe, expect, test } from "bun:test";
import { sanitizeForFirestore } from "../infrastructure/repositories/firestore-sanitizer";

describe("firestore sanitizer", () => {
  test("removes undefined optional fields before persistence", () => {
    const payload = sanitizeForFirestore({
      weightKg: 50,
      heightCm: 150,
      waistCm: undefined,
      femaleHealth: {
        cycleRegularity: "regular",
        pregnancyOrPostpartum: undefined,
      },
      tags: ["ok", undefined],
    });

    expect(payload as unknown).toEqual({
      weightKg: 50,
      heightCm: 150,
      femaleHealth: {
        cycleRegularity: "regular",
      },
      tags: ["ok"],
    });
  });
});
