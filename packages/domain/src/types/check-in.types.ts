export type CheckInEntry = {
  date: string;
  completed: boolean;
  imWord?: string;
};

export type CheckInMode = "minimal" | "standard" | "recalibration";
