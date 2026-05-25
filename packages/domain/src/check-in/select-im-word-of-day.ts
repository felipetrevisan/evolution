const words = ["clareza", "presença", "ritmo", "constância", "ajuste", "foco"];

export function selectImWordOfDay(day: number): string {
  return words[(Math.max(1, day) - 1) % words.length] ?? "foco";
}
