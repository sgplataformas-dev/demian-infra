// PLACEHOLDER CONTENT: estrutura de um plano de 10 dias com 5 refeições por dia.
// Os textos abaixo são genéricos e devem ser substituídos pelo conteúdo real do cliente.
export type Refeicao = {
  titulo: string;
  nome?: string;
  descricao: string;
};

export type DiaPlano = {
  numero: number;
  tema: string;
  refeicoes: Refeicao[];
};

export const PLANO_INTRO = {
  titulo: "Plano de Exemplo — 10 Dias",
  subtitulo: "Subtítulo de exemplo — substituir pelo conteúdo real do cliente",
  descricao: "Texto de exemplo — substituir pelo conteúdo real do cliente.",
  regras: [
    "Regra de exemplo 1 — substituir pelo conteúdo real do cliente.",
    "Regra de exemplo 2 — substituir pelo conteúdo real do cliente.",
    "Regra de exemplo 3 — substituir pelo conteúdo real do cliente.",
  ],
};

const REFEICOES_PADRAO: Refeicao[] = [
  { titulo: "Café da Manhã", descricao: "Texto de exemplo — substituir pelo conteúdo real do cliente." },
  { titulo: "Lanche da Manhã", descricao: "Texto de exemplo — substituir pelo conteúdo real do cliente." },
  { titulo: "Almoço", descricao: "Texto de exemplo — substituir pelo conteúdo real do cliente." },
  { titulo: "Lanche da Tarde", descricao: "Texto de exemplo — substituir pelo conteúdo real do cliente." },
  { titulo: "Jantar", descricao: "Texto de exemplo — substituir pelo conteúdo real do cliente." },
];

export const PLANO_DIAS: DiaPlano[] = Array.from({ length: 10 }, (_, i) => ({
  numero: i + 1,
  tema: `Tema de exemplo do dia ${i + 1}`,
  refeicoes: REFEICOES_PADRAO.map((r) => ({ ...r })),
}));

export const INGREDIENTES_CORINGA: { titulo: string; itens: string[] }[] = [
  {
    titulo: "Categoria de exemplo 1",
    itens: [
      "Item de exemplo 1",
      "Item de exemplo 2",
      "Item de exemplo 3",
    ],
  },
  {
    titulo: "Categoria de exemplo 2",
    itens: [
      "Item de exemplo 1",
      "Item de exemplo 2",
      "Item de exemplo 3",
    ],
  },
  {
    titulo: "Categoria de exemplo 3",
    itens: [
      "Item de exemplo 1",
      "Item de exemplo 2",
      "Item de exemplo 3",
    ],
  },
];

export const NOTAS_FINAIS: string[] = [
  "Nota de exemplo 1 — substituir pelo conteúdo real do cliente.",
  "Nota de exemplo 2 — substituir pelo conteúdo real do cliente.",
  "Nota de exemplo 3 — substituir pelo conteúdo real do cliente.",
];
