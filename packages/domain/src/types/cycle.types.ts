export type CycleStatus = "active" | "completed";

export type Cycle = {
  id: string;
  status: CycleStatus;
  day: number;
};
