import { describe, expect, test } from "bun:test";
import { selectBaseProtocol, selectSupportVector, shouldRecalibrate } from "../protocols";

describe("protocols", () => {
  test("selects base protocol", () => {
    expect(selectBaseProtocol("constancia", "Nível 2 — Estruturação")).toBe(
      "Continuidade Resiliente · Nível 2 — Estruturação",
    );
  });

  test("selects support vector by highest non-priority SVC", () => {
    expect(
      selectSupportVector("comportamento", {
        comportamento: 90,
        constancia: 45,
        gestao_pessoal: 70,
        controle_emocional: 55,
      }),
    ).toBe("gestao_pessoal");
  });

  test("applies recalibration rule", () => {
    expect(shouldRecalibrate({ missedCheckIns: 3, averageStability: 90 })).toBe(true);
    expect(shouldRecalibrate({ missedCheckIns: 0, averageStability: 44 })).toBe(true);
  });
});
