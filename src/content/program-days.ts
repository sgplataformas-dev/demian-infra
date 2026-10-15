// Conteudo (placeholder) de cada um dos 28 dias do programa, ja estruturado
// com as ramificacoes que a VSL promete — so falta o Demian entregar o
// material real pra substituir os REPLACE_ME_*. A logica de qual variacao
// mostrar pra cada usuaria mora em program-engine.ts (resolveContent).
import {
  diaDaFase,
  resolveContent,
  type ContentRule,
  type ProgramProfile,
} from "@/content/program-engine";

export type DayContent = {
  titulo: string;
  resumo: string;
  // Receita, rotina ou janela de jejum do dia — o que muda por ramificacao.
  conteudoPrincipal: string;
  // "Troca" (o que tirar / o que colocar no lugar), quando a fase tiver isso.
  trocaOuDica?: string;
};

export type ProgramDayDef = {
  diaGeral: number; // 1-28
  rules: ContentRule<DayContent>[];
};

function buildSelarDay(diaGeral: number): ProgramDayDef {
  const d = diaDaFase(diaGeral);
  return {
    diaGeral,
    rules: [
      {
        when: { intestino: "preso" },
        content: {
          titulo: `Selar — Dia ${d}`,
          resumo:
            "Receita de exemplo para fechar os furos da parede do intestino (intestino preso).",
          conteudoPrincipal: "REPLACE_ME_RECEITA_SELAR_INTESTINO_PRESO",
        },
      },
      {
        when: { intestino: "solto" },
        content: {
          titulo: `Selar — Dia ${d}`,
          resumo:
            "Receita de exemplo para fechar os furos da parede do intestino (intestino solto).",
          conteudoPrincipal: "REPLACE_ME_RECEITA_SELAR_INTESTINO_SOLTO",
        },
      },
    ],
  };
}

function buildDesarmarDay(diaGeral: number): ProgramDayDef {
  const d = diaDaFase(diaGeral);
  return {
    diaGeral,
    rules: [
      {
        when: { turno: "dia" },
        content: {
          titulo: `Desarmar — Dia ${d}`,
          resumo:
            "7 dias sem acucar, farinha branca e ultraprocessados. Jejum de 12h ajustado pro turno do dia.",
          conteudoPrincipal: "REPLACE_ME_JANELA_JEJUM_TURNO_DIA",
          trocaOuDica: "REPLACE_ME_TROCA_DO_DIA",
        },
      },
      {
        when: { turno: "madrugada" },
        content: {
          titulo: `Desarmar — Dia ${d}`,
          resumo:
            "7 dias sem acucar, farinha branca e ultraprocessados. Jejum de 12h ajustado pro turno da madrugada.",
          conteudoPrincipal: "REPLACE_ME_JANELA_JEJUM_TURNO_MADRUGADA",
          trocaOuDica: "REPLACE_ME_TROCA_DO_DIA",
        },
      },
    ],
  };
}

function buildLimparDay(diaGeral: number): ProgramDayDef {
  const d = diaDaFase(diaGeral);
  return {
    diaGeral,
    rules: [
      {
        when: {},
        content: {
          titulo: `Limpar — Dia ${d}`,
          resumo: "Rotina de sono profundo + alimentos anti-inflamatorios.",
          conteudoPrincipal: "REPLACE_ME_ROTINA_SONO_PADRAO",
        },
      },
      {
        when: { sono: "ruim" },
        content: {
          titulo: `Limpar — Dia ${d}`,
          resumo: "Rotina ajustada para quem dorme mal.",
          conteudoPrincipal: "REPLACE_ME_ROTINA_SONO_RUIM",
        },
      },
      {
        when: { sono: "acorda_de_madrugada" },
        content: {
          titulo: `Limpar — Dia ${d}`,
          resumo: "Rotina ajustada para quem acorda de madrugada.",
          conteudoPrincipal: "REPLACE_ME_ROTINA_ACORDA_DE_MADRUGADA",
        },
      },
      {
        // Regra mais especifica: sono ruim E remedio que afeta o sono —
        // vence sobre a regra que so olha `sono: "ruim"`.
        when: { sono: "ruim", remediosAfetamSono: true },
        content: {
          titulo: `Limpar — Dia ${d}`,
          resumo: "Rotina ajustada para quem dorme mal e toma remedio que interfere no sono.",
          conteudoPrincipal: "REPLACE_ME_ROTINA_SONO_RUIM_COM_REMEDIO",
        },
      },
    ],
  };
}

function buildRepovoarDay(diaGeral: number): ProgramDayDef {
  const d = diaDaFase(diaGeral);
  return {
    diaGeral,
    rules: [
      {
        when: { lactose: "tolera" },
        content: {
          titulo: `Repovoar — Dia ${d}`,
          resumo: "Fermentado caseiro (com leite) + receita com fibra.",
          conteudoPrincipal: "REPLACE_ME_FERMENTADO_COM_LEITE",
        },
      },
      {
        when: { lactose: "intolerante" },
        content: {
          titulo: `Repovoar — Dia ${d}`,
          resumo: "Fermentado caseiro sem leite + receita com fibra.",
          conteudoPrincipal: "REPLACE_ME_FERMENTADO_SEM_LEITE",
        },
      },
    ],
  };
}

export const PROGRAM_DAYS: ProgramDayDef[] = [
  ...Array.from({ length: 7 }, (_, i) => buildSelarDay(i + 1)),
  ...Array.from({ length: 7 }, (_, i) => buildDesarmarDay(i + 8)),
  ...Array.from({ length: 7 }, (_, i) => buildLimparDay(i + 15)),
  ...Array.from({ length: 7 }, (_, i) => buildRepovoarDay(i + 22)),
];

export function getDayDef(diaGeral: number): ProgramDayDef {
  const index = Math.min(Math.max(Math.trunc(diaGeral), 1), PROGRAM_DAYS.length) - 1;
  return PROGRAM_DAYS[index]!;
}

export function resolveDayContent(diaGeral: number, profile: ProgramProfile): DayContent {
  return resolveContent(getDayDef(diaGeral).rules, profile);
}

export type VslContentItem = {
  id: string;
  titulo: string;
  resumo: string;
};

// Os conteudos que a VSL cita e promete — biblioteca pesquisavel, conteudo
// real vem do Demian.
export const VSL_CONTENT: VslContentItem[] = [
  {
    id: "teste-7-dias",
    titulo: "Teste dos 7 dias",
    resumo: "Como saber se o intestino esta selando.",
  },
  {
    id: "alimentos-feira",
    titulo: "Os 2 alimentos de feira que fecham os furos",
    resumo: "Menos de R$ 10, faceis de achar.",
  },
  { id: "pior-hora-doce", titulo: "Pior hora do dia para comer doce", resumo: "" },
  { id: "nunca-depois-20h", titulo: "O que nunca comer depois das 20h", resumo: "" },
  { id: "fruta-fora-cafe", titulo: "A fruta que nao vai no cafe da manha", resumo: "" },
  {
    id: "iogurte-mercado",
    titulo: "Qual iogurte de mercado escolher (e qual deixar)",
    resumo: "",
  },
  { id: "ritual-10-minutos", titulo: "Ritual dos 10 minutos", resumo: "Para quem acorda as 3h." },
  {
    id: "ingrediente-escondido",
    titulo: "O ingrediente escondido no rotulo",
    resumo: "Pao de forma, molho pronto.",
  },
  {
    id: "salvacao-tarde",
    titulo: "A salvacao da tarde",
    resumo: "7 dias sem acucar sem passar vontade.",
  },
  { id: "alimento-todo-dia", titulo: "O alimento que toda paciente come todo dia", resumo: "" },
  { id: "horarios-sem-cafe", titulo: "2 horarios em que nunca tomar cafe", resumo: "" },
  {
    id: "vontade-doce-tarde",
    titulo: "Como fazer a vontade de doce da tarde sumir",
    resumo: "",
  },
];
