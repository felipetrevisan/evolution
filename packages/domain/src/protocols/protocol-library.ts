import type { VectorKey } from "../types/vector.types";

export type ProtocolWeek = {
  week: number;
  objective: string;
  action: string;
  language: string;
};

export type ProtocolDefinition = {
  name: string;
  mechanism: string;
  goldenRule: string;
  weeks: ProtocolWeek[];
};

export const PROTOCOLS_BY_VECTOR: Record<VectorKey, ProtocolDefinition> = {
  comportamento: {
    name: "Ativação Progressiva",
    mechanism: "Dificuldade de transformar intenção em ação.",
    goldenRule: "Frequência vem antes de duração.",
    weeks: [
      week(
        1,
        "Estabelecer o gatilho inicial",
        "5 minutos de movimento ao acordar",
        "Apenas comece. Não precisa terminar.",
      ),
      week(
        2,
        "Estabilizar o horário",
        "10 minutos no mesmo horário",
        "O foco é por 10 minutos. O resto é bônus.",
      ),
      week(
        3,
        "Adicionar uma decisão prática",
        "15 minutos e uma decisão do dia",
        "Uma decisão prática hoje. Isso é clareza.",
      ),
      week(
        4,
        "Registrar o que funcionou",
        "20 minutos e registro simples",
        "Você está construindo disciplina real.",
      ),
      week(
        5,
        "Antecipar o próximo dia",
        "25 minutos e preparação na noite anterior",
        "A energia de amanhã começa hoje.",
      ),
      week(
        6,
        "Consolidar identidade de ação",
        "30 minutos e frase de identidade",
        "Você não tenta mais. Você faz acontecer.",
      ),
    ],
  },
  constancia: {
    name: "Continuidade Resiliente",
    mechanism: "Ciclo de interrupção, recomeço e abandono após falhas.",
    goldenRule: "Uma falha não encerra o ciclo; três dias sem retomada pedem reengajamento.",
    weeks: [
      week(
        1,
        "Criar frequência mínima",
        "3 presenças na semana",
        "Uma falha não apaga as outras presenças.",
      ),
      week(
        2,
        "Retomar rápido após falha",
        "4 presenças e retomada em 24h",
        "Constância se mede em semanas, não em dias.",
      ),
      week(
        3,
        "Evitar dia zero",
        "5 presenças com ação mínima quando necessário",
        "5 minutos ainda contam como progresso.",
      ),
      week(
        4,
        "Estabilizar atividade",
        "Manter 5 presenças com a mesma base",
        "Disciplina é manter, mesmo quando muda.",
      ),
      week(
        5,
        "Introduzir variação leve",
        "Variação sem quebrar frequência",
        "Energia vem da rotina que cabe na vida real.",
      ),
      week(
        6,
        "Aumentar autonomia",
        "Escolher horários e preservar frequência",
        "Você construiu clareza sobre o que funciona.",
      ),
    ],
  },
  gestao_pessoal: {
    name: "Estrutura Mínima Viável",
    mechanism: "Rotina reativa, desorganização e dificuldade de priorização.",
    goldenRule: "A estrutura precisa ser menor do que a vontade de controlar tudo.",
    weeks: [
      week(
        1,
        "Organizar o mínimo viável",
        "3 blocos fixos no dia",
        "Não organize tudo. Organize 3 coisas.",
      ),
      week(
        2,
        "Definir prioridade diária",
        "Bloco 1 como prioridade do dia",
        "Clareza é saber o que importa primeiro.",
      ),
      week(
        3,
        "Conectar estrutura e movimento",
        "Bloco 2 como movimento",
        "Disciplina vive nos objetos, não só na cabeça.",
      ),
      week(
        4,
        "Preparar o amanhã",
        "Bloco 3 como preparação noturna",
        "Foco no amanhã começa hoje.",
      ),
      week(
        5,
        "Revisar a semana",
        "Revisão semanal de 10 minutos",
        "A constância da revisão evita o caos.",
      ),
      week(
        6,
        "Adaptar o próprio sistema",
        "Ajustar a estrutura à realidade",
        "Você tem energia para criar sua própria estrutura.",
      ),
    ],
  },
  controle_emocional: {
    name: "Regulação Integrada",
    mechanism: "Estados emocionais modulam comportamento, rotina e decisão.",
    goldenRule: "Não suprimir emoção; separar emoção de decisão comportamental.",
    weeks: [
      week(
        1,
        "Identificar gatilho emocional",
        "Check-in diário: como estou?",
        "Clareza emocional é o primeiro passo.",
      ),
      week(
        2,
        "Nomear antes de agir",
        "Pausa de 2 minutos antes de decisões",
        "Nomear é ter foco. Agir sem nomear é reagir.",
      ),
      week(
        3,
        "Criar uma pausa de segurança",
        "Se houver gatilho, fazer pausa e beber água",
        "Disciplina também inclui pausar.",
      ),
      week(
        4,
        "Ampliar para mais contextos",
        "Usar a mesma pausa em 2 gatilhos",
        "Sua constância agora inclui o emocional.",
      ),
      week(
        5,
        "Registrar recuperação",
        "Notar quanto tempo levou para voltar",
        "Progresso é recuperar mais rápido.",
      ),
      week(
        6,
        "Separar estado e ação",
        "Decidir sem deixar o estado comandar",
        "Você tem energia para escolher apesar do estado.",
      ),
    ],
  },
};

export function getProtocolDefinition(vector: VectorKey) {
  return PROTOCOLS_BY_VECTOR[vector];
}

export function getProtocolWeek(vector: VectorKey, weekNumber: number): ProtocolWeek {
  const weekIndex = Math.min(Math.max(weekNumber, 1), 6) - 1;
  const weeks = PROTOCOLS_BY_VECTOR[vector].weeks;
  const firstWeek = weeks[0];

  if (!firstWeek) {
    throw new Error(`Protocol without weeks for vector ${vector}.`);
  }

  return weeks[weekIndex] ?? firstWeek;
}

function week(
  weekNumber: number,
  objective: string,
  action: string,
  language: string,
): ProtocolWeek {
  return {
    action,
    language,
    objective,
    week: weekNumber,
  };
}
