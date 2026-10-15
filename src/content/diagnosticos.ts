export type IntakeRespostas = {
  idade?: number;
  peso?: number;
  altura?: number;
  pesoDesejado?: number;
  objetivos?: string[];
  condicoes?: string[];
  usaMedicamentos?: "sim" | "nao";
  medicamentos?: string[];
  medicamentosOutro?: string;
  bristol?: string;
  frequenciaIntestinal?: string;
  qualidadeSono?: string;
  horasSono?: number;
  refeicoesPorDia?: string;
  cafeDaManha?: string;
  restricoesAlimentares?: string[];
  restricoesOutro?: string;
  alcool?: string;
  mlAgua?: number;
  /** Fase 1 — ATNNs/ARIs que a pessoa quer evitar (ex-quiz-fase-1, absorvido na anamnese). */
  evitarAtnn?: string[];
  evitarAri?: string[];
};

export type PerfilDiagnostico = {
  titulo: string;
  paragrafos: string[];
};

export function escolherPerfil(r: IntakeRespostas): PerfilDiagnostico {
  // Score-based sobre sinais do novo quiz
  let score = 0;

  // Intestino — Bristol
  if (r.bristol === "1" || r.bristol === "2") score += 2; // constipação
  if (r.bristol === "6" || r.bristol === "7") score += 2; // diarreia
  if (r.bristol === "3") score += 1;

  // Frequência intestinal
  if (r.frequenciaIntestinal === "menos_3") score += 2;
  if (r.frequenciaIntestinal === "3_5") score += 1;

  // Sono
  if (r.qualidadeSono === "ruim" || r.qualidadeSono === "insonia") score += 2;
  if (r.qualidadeSono === "regular") score += 1;
  if (typeof r.horasSono === "number" && r.horasSono < 6) score += 1;

  // Hábitos alimentares
  if (r.cafeDaManha === "nunca") score += 2;
  if (r.cafeDaManha === "raramente") score += 1;
  if (r.refeicoesPorDia === "1_3") score += 1;

  // Álcool
  if (r.alcool === "mais_3x") score += 2;
  if (r.alcool === "menos_2x") score += 1;

  // Água
  if (typeof r.mlAgua === "number" && r.mlAgua < 1000) score += 1;

  if (score >= 6) {
    return {
      titulo: "Perfil de Exemplo — Grau Moderado",
      paragrafos: [
        "Texto de exemplo — substituir pelo conteúdo real do cliente.",
        "Texto de exemplo — substituir pelo conteúdo real do cliente.",
        "Texto de exemplo — substituir pelo conteúdo real do cliente.",
        "Texto de exemplo — substituir pelo conteúdo real do cliente.",
      ],
    };
  }

  if (score <= 2) {
    return {
      titulo: "Perfil de Exemplo — Grau Leve",
      paragrafos: [
        "Texto de exemplo — substituir pelo conteúdo real do cliente.",
        "Texto de exemplo — substituir pelo conteúdo real do cliente.",
        "Texto de exemplo — substituir pelo conteúdo real do cliente.",
        "Texto de exemplo — substituir pelo conteúdo real do cliente.",
      ],
    };
  }

  return {
    titulo: "Perfil de Exemplo — Grau Inicial",
    paragrafos: [
      "Texto de exemplo — substituir pelo conteúdo real do cliente.",
      "Texto de exemplo — substituir pelo conteúdo real do cliente.",
      "Texto de exemplo — substituir pelo conteúdo real do cliente.",
      "Texto de exemplo — substituir pelo conteúdo real do cliente.",
    ],
  };
}

export const FASES = [
  { numero: 1, titulo: "Fase 1", liberaDia: 1 },
  { numero: 2, titulo: "Fase 2", liberaDia: 15 },
  { numero: 3, titulo: "Fase 3", liberaDia: 30 },
  { numero: 4, titulo: "Bônus", liberaDia: 45 },
];

export const OBJETIVOS_OPCOES = [
  "Perder peso",
  "Definição muscular",
  "Melhorar a saúde",
  "Elevar a autoestima",
];

export const CONDICOES_OPCOES = [
  "Diabetes",
  "Hipertensão",
  "Hipotireoidismo",
  "SOP (Síndrome dos Ovários Policísticos)",
  "Síndrome do intestino irritável",
  "Câncer",
  "Colesterol alto",
  "Ansiedade / Depressão",
  "Nenhuma das anteriores",
];

export const MEDICAMENTOS_OPCOES = [
  "Losartana / Anti-hipertensivo",
  "Metformina",
  "Levotiroxina (Puran / Synthroid)",
  "Omeprazol / Protetor gástrico",
  "Anticoncepcional",
  "Antidepressivo",
  "Sinvastatina / Atorvastatina",
  "Insulina",
  "Outro",
];

export const RESTRICOES_OPCOES = [
  "Intolerância à lactose",
  "Intolerância ao glúten",
  "Alergia a amendoim ou oleaginosas",
  "Outro",
  "Nenhuma",
];

export const BRISTOL_OPCOES = [
  { id: "1", titulo: "Tipo 1", descricao: "Bolinhas duras e separadas (constipação severa)" },
  { id: "2", titulo: "Tipo 2", descricao: "Formato de salsicha, mas com grumos (constipação leve)" },
  { id: "3", titulo: "Tipo 3", descricao: "Salsicha com rachaduras na superfície (normal)" },
  { id: "4", titulo: "Tipo 4", descricao: "Salsicha lisa e macia (ideal)" },
  { id: "5", titulo: "Tipo 5", descricao: "Pedaços macios com bordas definidas (transição para diarreia)" },
  { id: "6", titulo: "Tipo 6", descricao: "Pedaços moles e fofos (diarreia leve)" },
  { id: "7", titulo: "Tipo 7", descricao: "Totalmente líquido (diarreia severa)" },
];
