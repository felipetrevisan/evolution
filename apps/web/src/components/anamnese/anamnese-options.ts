export type SelectOption<T extends string = string> = { label: string; value: T };

export const sexOptions = [
  { label: "Feminino", value: "feminino" },
  { label: "Masculino", value: "masculino" },
  { label: "Outro", value: "outro" },
] satisfies SelectOption[];

export const ageOptions = [
  { label: "18-24", value: "18_24" },
  { label: "25-34", value: "25_34" },
  { label: "35-44", value: "35_44" },
  { label: "45-54", value: "45_54" },
  { label: "55+", value: "55_plus" },
] satisfies SelectOption[];

export const availabilityOptions = [
  { label: "Menos de 2h", value: "menos_2h" },
  { label: "2-3h", value: "2_3h" },
  { label: "4-5h", value: "4_5h" },
  { label: "6h+", value: "6h_mais" },
] satisfies SelectOption[];

export const experienceOptions = [
  { label: "Nunca pratiquei", value: "nunca" },
  { label: "Iniciante", value: "iniciante" },
  { label: "Intermediário", value: "intermediario" },
  { label: "Avançado", value: "avancado" },
] satisfies SelectOption[];

export const weightHistoryOptions = [
  { label: "Estável", value: "estavel" },
  { label: "Ganho recente", value: "ganho_recente" },
  { label: "Perda recente", value: "perda_recente" },
  { label: "Oscilação frequente", value: "oscilacao_frequente" },
] satisfies SelectOption[];

export const desiredResultOptions = [
  { label: "Perda de gordura", value: "perda_gordura" },
  { label: "Ganho de massa", value: "ganho_massa" },
  { label: "Mais energia", value: "mais_energia" },
  { label: "Melhorar sono", value: "melhorar_sono" },
  { label: "Reduzir estresse", value: "reduzir_estresse" },
  { label: "Criar consistência", value: "criar_consistencia" },
] satisfies SelectOption[];

export const motivatorOptions = [
  { label: "Saúde e longevidade", value: "saude_longevidade" },
  { label: "Aparência e autoestima", value: "aparencia_autoestima" },
  { label: "Performance e energia", value: "performance_energia" },
  { label: "Exemplo para família", value: "exemplo_familia" },
  { label: "Superação pessoal", value: "superacao_pessoal" },
  { label: "Qualidade de vida", value: "qualidade_vida" },
] satisfies SelectOption[];
