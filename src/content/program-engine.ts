// Motor de regras do programa de 28 dias (4 fases de 7 dias: Selar, Desarmar,
// Limpar, Repovoar). A ideia: as respostas da usuaria (perfil de ramificacao)
// selecionam, dentro de uma biblioteca de conteudo APROVADA PELO DEMIAN, qual
// variacao mostrar em cada dia — a IA so entra depois, pra escrever a
// apresentacao em cima do conteudo ja escolhido pelas regras (nunca pra
// decidir o conteudo em si).
//
// Este arquivo e generico (tipos + resolver); o conteudo real de cada dia
// fica em program-days.ts, hoje com placeholders ate o Demian entregar o
// material.

export type IntestinoTipo = "preso" | "solto";
export type Turno = "dia" | "madrugada";
export type QualidadeSono = "bom" | "ruim" | "acorda_de_madrugada";
export type Lactose = "tolera" | "intolerante";

export type ProgramProfile = {
  intestino: IntestinoTipo;
  turno: Turno;
  sono: QualidadeSono;
  lactose: Lactose;
  remediosAfetamSono: boolean;
};

// Toda chave aqui e opcional: uma regra so testa as condicoes que declarar,
// e uma regra com `when: {}` funciona como padrao (bate com qualquer perfil).
export type RuleCondition = Partial<{
  intestino: IntestinoTipo;
  turno: Turno;
  sono: QualidadeSono;
  lactose: Lactose;
  remediosAfetamSono: boolean;
}>;

export type ContentRule<T> = {
  when: RuleCondition;
  content: T;
};

const CONDITION_KEYS = ["intestino", "turno", "sono", "lactose", "remediosAfetamSono"] as const;

function matchesProfile(when: RuleCondition, profile: ProgramProfile): boolean {
  return CONDITION_KEYS.every((key) => {
    const expected = when[key];
    if (expected === undefined) return true;
    return profile[key] === expected;
  });
}

function specificity(when: RuleCondition): number {
  return CONDITION_KEYS.filter((key) => when[key] !== undefined).length;
}

/**
 * Resolve qual conteudo mostrar para um perfil, dado um conjunto de regras.
 * Regra mais especifica (mais condicoes declaradas) vence; em empate, a
 * ultima declarada na lista vence — isso permite escrever uma regra padrao
 * (`when: {}`) no topo e overrides mais especificos depois dela.
 *
 * Lanca erro se nenhuma regra bater — toda lista de regras deve ter pelo
 * menos uma regra padrao (`when: {}`) para nunca deixar a usuaria sem
 * conteudo.
 */
export function resolveContent<T>(rules: ContentRule<T>[], profile: ProgramProfile): T {
  const candidates = rules.filter((rule) => matchesProfile(rule.when, profile));
  if (candidates.length === 0) {
    throw new Error(
      "Nenhuma regra correspondeu ao perfil e nenhuma regra padrao (when: {}) foi definida.",
    );
  }
  candidates.sort((a, b) => specificity(a.when) - specificity(b.when));
  return candidates[candidates.length - 1]!.content;
}

export type PhaseId = "selar" | "desarmar" | "limpar" | "repovoar";

export type PhaseDef = {
  id: PhaseId;
  numero: number;
  nome: string;
  subtitulo: string;
  diaInicio: number; // dia geral (1-28), inclusive
  diaFim: number; // dia geral (1-28), inclusive
};

export const PHASES: PhaseDef[] = [
  {
    id: "selar",
    numero: 1,
    nome: "Selar",
    subtitulo: "Receitas que fecham os furos da parede do intestino",
    diaInicio: 1,
    diaFim: 7,
  },
  {
    id: "desarmar",
    numero: 2,
    nome: "Desarmar",
    subtitulo: "7 dias sem acucar, farinha branca e ultraprocessados",
    diaInicio: 8,
    diaFim: 14,
  },
  {
    id: "limpar",
    numero: 3,
    nome: "Limpar",
    subtitulo: "Sono profundo + alimentos anti-inflamatorios",
    diaInicio: 15,
    diaFim: 21,
  },
  {
    id: "repovoar",
    numero: 4,
    nome: "Repovoar",
    subtitulo: "Fermentados caseiros + receitas com fibra",
    diaInicio: 22,
    diaFim: 28,
  },
];

export const TOTAL_DIAS_PROGRAMA = 28;

export function clampDiaGeral(diaGeral: number): number {
  return Math.min(Math.max(Math.trunc(diaGeral), 1), TOTAL_DIAS_PROGRAMA);
}

export function phaseForDay(diaGeral: number): PhaseDef {
  const dia = clampDiaGeral(diaGeral);
  return (
    PHASES.find((fase) => dia >= fase.diaInicio && dia <= fase.diaFim) ?? PHASES[PHASES.length - 1]!
  );
}

export function diaDaFase(diaGeral: number): number {
  const fase = phaseForDay(diaGeral);
  return clampDiaGeral(diaGeral) - fase.diaInicio + 1;
}

/** Dia geral do programa (1-28) a partir da data de inicio, ou null se o programa ja acabou (>28 dias). */
export function diaGeralDesdeInicio(startedAt: Date, hoje: Date = new Date()): number | null {
  const msPorDia = 24 * 60 * 60 * 1000;
  const diasCorridos = Math.floor((hoje.getTime() - startedAt.getTime()) / msPorDia);
  const diaGeral = diasCorridos + 1;
  if (diaGeral > TOTAL_DIAS_PROGRAMA) return null;
  return clampDiaGeral(diaGeral);
}

export type Milestone = {
  dia: number;
  titulo: string;
  descricao: string;
};

// Marcos da garantia citados na VSL.
export const MILESTONES: Milestone[] = [
  {
    dia: 7,
    titulo: "Barriga desincha",
    descricao: "O intestino volta a funcionar com regularidade.",
  },
  { dia: 14, titulo: "Menos vontade de doce", descricao: "A dor de cabeca tambem diminui." },
  { dia: 21, titulo: "Dorme a noite inteira", descricao: "Menos nevoa mental durante o dia." },
  { dia: 28, titulo: "Crises mais fracas e espacadas", descricao: "" },
  { dia: 60, titulo: "Voce vai se reconhecer de novo", descricao: "" },
];

export function nextMilestone(diasDesdeInicio: number): Milestone | null {
  return MILESTONES.find((m) => m.dia > diasDesdeInicio) ?? null;
}

export function reachedMilestones(diasDesdeInicio: number): Milestone[] {
  return MILESTONES.filter((m) => m.dia <= diasDesdeInicio);
}

export type BonusItem = {
  id: string;
  titulo: string;
  descricao: string;
};

// Os "6 presentes" — so para quem comprou com bonus. Conteudo real fica com
// o Demian; aqui so os titulos/descricoes ja confirmados por ele.
export const BONUS_ITEMS: BonusItem[] = [
  {
    id: "anti-crise-24h",
    titulo: "Protocolo Anti-Crise de 24 Horas",
    descricao: "O que comer, evitar e fazer nas primeiras 24h de uma crise.",
  },
  {
    id: "livro-medicina-aromatica",
    titulo: "Medicina Aromatica no Intestino",
    descricao: "Livro digital do Demian.",
  },
  {
    id: "sinergias-sono",
    titulo: "Sinergias do Sono Profundo",
    descricao: "Oleos para o travesseiro e para a sola do pe.",
  },
  {
    id: "guia-intestino-preso",
    titulo: "Guia do Intestino Preso",
    descricao: "Bebida da manha, posicao no vaso.",
  },
  {
    id: "cardapio-familia",
    titulo: "Cardapio da Familia Sem Acucar",
    descricao: "Receitas que a familia inteira come.",
  },
  {
    id: "guia-familia",
    titulo: "Guia pro Marido e pra Familia",
    descricao: "Explica que a dor nao e frescura e o que fazer na crise.",
  },
];

export const CRISIS_BONUS_ID = "anti-crise-24h";

export function findBonusItem(id: string): BonusItem | undefined {
  return BONUS_ITEMS.find((item) => item.id === id);
}
