export type OperationalBlock = "X" | "Y" | "Z";

export type OperationalAnswer = {
  questionId: number;
  value: 1 | 2 | 3 | 4 | 5 | 6;
};

export type OperationalQuestion = {
  id: number;
  block: OperationalBlock;
  text: string;
};

export type BlockStatus = "Baixo Bloqueio" | "Bloqueio Moderado" | "Bloqueio Alto";

export type OperationalScore = {
  raw: number;
  normalized: number;
};
