// PLACEHOLDER CONTENT: Guia de Adaptações Hipoalergênicas — estrutura genérica de
// trocas por dia. Substituir pelos dados reais do cliente quando definidos.
export type Troca = {
  refeicao: string; // deve casar com o titulo da refeição no plano
  alerta: "Castanha" | "Amendoim" | "Coco" | "Gergelim" | "Acesso";
  de: string;
  para: string;
};

export type TrocasDia = {
  dia: number;
  trocas: Troca[];
  nota?: string;
};

const ALERTAS: Troca["alerta"][] = ["Castanha", "Amendoim", "Coco", "Gergelim", "Acesso"];

export const TROCAS_POR_DIA: TrocasDia[] = Array.from({ length: 10 }, (_, i) => ({
  dia: i + 1,
  trocas: [
    {
      refeicao: "Café da Manhã",
      alerta: ALERTAS[i % ALERTAS.length],
      de: "Item de exemplo (original)",
      para: "Item de exemplo (substituto)",
    },
  ],
  nota: "Nota de exemplo — substituir pelo conteúdo real do cliente.",
}));

export const TROCAS_INTRO = {
  titulo: "Guia de Adaptações — Exemplo",
  descricao: "Texto de exemplo — substituir pelo conteúdo real do cliente.",
  principio: "Texto de exemplo — substituir pelo conteúdo real do cliente.",
};

export const TABELA_GERAL: { original: string; motivo: string; substituicao: string }[] = [
  {
    original: "Item de exemplo 1",
    motivo: "Categoria de exemplo",
    substituicao: "Substituto de exemplo 1",
  },
  {
    original: "Item de exemplo 2",
    motivo: "Categoria de exemplo",
    substituicao: "Substituto de exemplo 2",
  },
  {
    original: "Item de exemplo 3",
    motivo: "Categoria de exemplo",
    substituicao: "Substituto de exemplo 3",
  },
];

export const CORINGA_HIPO: { categoria: string; alerta: string; seguro: string }[] = [
  {
    categoria: "Categoria de exemplo 1",
    alerta: "Alerta de exemplo",
    seguro: "Opção segura de exemplo",
  },
  {
    categoria: "Categoria de exemplo 2",
    alerta: "Alerta de exemplo",
    seguro: "Opção segura de exemplo",
  },
];
