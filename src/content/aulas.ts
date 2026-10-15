import aula1Fase1Thumb from "@/assets/aula1-fase1-thumb.webp";
import fase1Banner from "@/assets/fase1-banner.webp";
import fase2Banner from "@/assets/fase2-banner.jpg";
import fase3Banner from "@/assets/fase3-banner.png";
import aulaBrigadeiro from "@/assets/aula2-brigadeiro.jpg";
import aulaNhoque from "@/assets/aula3-nhoque.jpg";
import aulaDoceBiomassa from "@/assets/aula4-doce-biomassa.jpg";
import aulaChevry from "@/assets/aula5-chevry.jpg";
import almoco1 from "@/assets/almoco-1-panqueca-beterraba.jpg";
import almoco2 from "@/assets/almoco-2-mocoto-cogumelos.jpg";
import almoco3 from "@/assets/almoco-3-file-5-graos.jpg";
import almoco4 from "@/assets/almoco-4-quiabo-agridoce.jpg";
import almoco5 from "@/assets/almoco-5-panqueca-ora-pro-nobis.jpg";
import almoco6 from "@/assets/almoco-6-almondega-quinoa.jpg";
import almoco7 from "@/assets/almoco-7-strogonoff-abobrinha.jpg";
import almoco8 from "@/assets/almoco-8-biomassa-nhoque.jpg";
import cafe1 from "@/assets/cafe-1-chips-banana.jpg";
import cafe2 from "@/assets/cafe-2-drink-tpm.jpg";
import cafe3 from "@/assets/cafe-3-semente-abobora.jpg";
import cafe4 from "@/assets/cafe-4-leite-vegetal.jpg";
import jantar1 from "@/assets/jantar-1-risoto-quinoa.jpg";
import jantar2 from "@/assets/jantar-2-arroz-negro.jpg";
import jantar3 from "@/assets/jantar-3-enroladinho-almeirao.jpg";
import jantar4 from "@/assets/jantar-4-macarrao-abobrinha.jpg";
import pastas1 from "@/assets/pastas-1-molho-beterraba.jpg";
import pastas2 from "@/assets/pastas-2-chevry.jpg";
import pastas3 from "@/assets/pastas-3-maionese-dente-leao.jpg";
import pastas4 from "@/assets/pastas-4-erva-baleeira.jpg";
import pastas5 from "@/assets/pastas-5-pasta-amendoim.jpg";
import pastas6 from "@/assets/pastas-6-tahine.jpg";
import sobremesa1 from "@/assets/sobremesa-1-adocante-natural.jpg";
import sobremesa2 from "@/assets/sobremesa-2-sorbet-manga.jpg";
import sobremesa3 from "@/assets/sobremesa-3-doce-biomassa.jpg";
import sobremesa4 from "@/assets/sobremesa-4-brigadeiro-natural.jpg";
import fase2Aula1 from "@/assets/fase2-1-iogurte-parte1.jpg";
import fase2Aula2 from "@/assets/fase2-2-iogurte-parte2.jpg";
import audioIogurte from "@/assets/audio-iogurte-bariatrico.ogg";
import bonus1Tintura from "@/assets/bonus1-tintura.jpg";
import bonus1Aloe from "@/assets/bonus1-aloe.jpg";
import bonus1Espinheira from "@/assets/bonus1-espinheira.jpg";
import bonus1Tonico from "@/assets/bonus1-tonico.jpg";

// PLACEHOLDER CONTENT — este catálogo de aulas é genérico e serve apenas
// para manter a estrutura de dados (categorias/módulos/aulas) funcionando
// enquanto o produto real do cliente Demian não é definido.
// Substitua títulos, descrições, vturbId e URLs de PDF pelo conteúdo real.

export type MaterialExtra = {
  titulo: string;
  url: string;
  descricao?: string;
};

export type CtaConfig = {
  label: string;
  to: string;
};

export type Aula = {
  id: string;
  titulo: string;
  descricao: string;
  duracao?: string;
  videoUrl: string;
  pdfUrl?: string;
  thumbnailUrl?: string;
  materiais?: MaterialExtra[];
  cta?: CtaConfig;
  vturbId?: string;
  /** Exceção pontual: materiais aparecem embaixo do texto em "Sobre", sem a aba "Materiais Extras" separada. */
  materiaisEmbaixoSobre?: boolean;
};

export type Modulo = {
  id: string; // usado como "série"
  numero?: number;
  titulo: string;
  subtitulo?: string;
  descricao: string;
  liberada: boolean;
  bannerUrl?: string;
  materiais?: MaterialExtra[];
  audio?: { url: string; mensagem: string };
  aulas: Aula[];
};

export type Categoria = {
  slug: string;
  titulo: string;
  modulos: Modulo[];
};

const vazio = { videoUrl: "", pdfUrl: "" };
const PLACEHOLDER_TEXT = "Texto de exemplo — substituir pelo conteúdo real do cliente.";

export const CATEGORIAS: Categoria[] = [
  {
    slug: "protocolo",
    titulo: "Programa de Exemplo",
    modulos: [
      {
        id: "fase-1",
        numero: 1,
        titulo: "Fase 1",
        subtitulo: "Subtítulo de exemplo da Fase 1",
        descricao: PLACEHOLDER_TEXT,
        liberada: true,
        bannerUrl: fase1Banner,
        aulas: [
          {
            id: "fase-1-intro",
            titulo: "Aula 1: Introdução de exemplo",
            descricao: PLACEHOLDER_TEXT,
            duracao: "12:40",
            cta: { label: "Iniciar Fase 1", to: "/hoje" },
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: aula1Fase1Thumb,
            materiais: [
              {
                titulo: "Material de exemplo 1",
                url: "REPLACE_ME_PDF_URL",
                descricao: "PDF com o resumo da aula (placeholder).",
              },
              {
                titulo: "Material de exemplo 2",
                url: "REPLACE_ME_PDF_URL",
                descricao: "PDF com o plano completo (placeholder).",
              },
            ],
            materiaisEmbaixoSobre: true,
            ...vazio,
          },
        ],
      },
      {
        id: "fase-2",
        numero: 2,
        titulo: "Fase 2",
        subtitulo: "Subtítulo de exemplo da Fase 2",
        descricao: PLACEHOLDER_TEXT,
        liberada: true,
        bannerUrl: fase2Banner,
        audio: {
          url: audioIogurte,
          mensagem: "Mensagem de áudio de exemplo — substituir pelo conteúdo real do cliente.",
        },
        aulas: [
          {
            id: "fase-2-iogurte-parte1",
            titulo: "Aula 1 — Exemplo Parte 1",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: fase2Aula1,
            materiais: [
              {
                titulo: "Material de exemplo — explicação escrita",
                url: "REPLACE_ME_PDF_URL",
                descricao: "Passo a passo em PDF (placeholder).",
              },
              {
                titulo: "Material de exemplo — receitas",
                url: "REPLACE_ME_PDF_URL",
                descricao: "PDF com receitas (placeholder).",
              },
              {
                titulo: "Material de exemplo — tabela",
                url: "REPLACE_ME_PDF_URL",
                descricao: "Tabela em PDF (placeholder).",
              },
            ],
            materiaisEmbaixoSobre: true,
            ...vazio,
          },
          {
            id: "fase-2-iogurte-parte2",
            titulo: "Aula 2 — Exemplo Parte 2",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: fase2Aula2,
            materiais: [
              {
                titulo: "Material de exemplo — receitas",
                url: "REPLACE_ME_PDF_URL",
                descricao: "PDF com receitas (placeholder).",
              },
            ],
            materiaisEmbaixoSobre: true,
            ...vazio,
          },
        ],
      },
      {
        id: "fase-3",
        numero: 3,
        titulo: "Fase 3",
        subtitulo: "Subtítulo de exemplo da Fase 3",
        descricao: PLACEHOLDER_TEXT,
        liberada: true,
        bannerUrl: fase3Banner,
        aulas: [
          {
            id: "fase-3-brigadeiro",
            titulo: "Aula 1 — Exemplo de Receita A",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: aulaBrigadeiro,
            ...vazio,
          },
          {
            id: "fase-3-nhoque",
            titulo: "Aula 2 — Exemplo de Receita B",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: aulaNhoque,
            ...vazio,
          },
          {
            id: "fase-3-doce-biomassa",
            titulo: "Aula 3 — Exemplo de Receita C",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: aulaDoceBiomassa,
            ...vazio,
          },
          {
            id: "fase-3-chevry",
            titulo: "Aula 4 — Exemplo de Receita D",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: aulaChevry,
            ...vazio,
          },
        ],
      },
    ],
  },
  {
    slug: "colageno",
    titulo: "Módulo Bônus de Exemplo",
    modulos: [
      {
        id: "colageno-natural",
        numero: 1,
        titulo: "Módulo Bônus de Exemplo",
        subtitulo: "Subtítulo de exemplo",
        descricao: PLACEHOLDER_TEXT,
        liberada: true,
        materiais: [
          {
            titulo: "Material de exemplo — PDF",
            url: "REPLACE_ME_PDF_URL",
            descricao: "Material completo em PDF (placeholder).",
          },
          {
            titulo: "Material de exemplo — receitas",
            url: "REPLACE_ME_PDF_URL",
            descricao: "Receitas em PDF (placeholder).",
          },
          {
            titulo: "Material de exemplo — receita única",
            url: "REPLACE_ME_PDF_URL",
            descricao: "Receita passo a passo em PDF (placeholder).",
          },
        ],
        aulas: [
          {
            id: "colageno-teorica",
            titulo: "Aula Teórica — Exemplo",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            materiais: [
              {
                titulo: "Material de exemplo — PDF",
                url: "REPLACE_ME_PDF_URL",
                descricao: "Material completo em PDF (placeholder).",
              },
            ],
            ...vazio,
          },
          {
            id: "colageno-pratica",
            titulo: "Aula Prática — Exemplo",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            materiais: [
              {
                titulo: "Material de exemplo — PDF",
                url: "REPLACE_ME_PDF_URL",
                descricao: "Material completo em PDF (placeholder).",
              },
            ],
            ...vazio,
          },
        ],
      },
    ],
  },
  {
    slug: "bonus",
    titulo: "Bônus",
    modulos: [
      {
        id: "bonus-1-farmacia",
        numero: 1,
        titulo: "Bônus 1 — Exemplo",
        descricao: PLACEHOLDER_TEXT,
        liberada: true,
        aulas: [
          {
            id: "bonus-1-tintura",
            titulo: "Aula 1 — Exemplo A",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: bonus1Tintura,
            ...vazio,
          },
          {
            id: "bonus-1-pomada-aloe",
            titulo: "Aula 2 — Exemplo B",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: bonus1Aloe,
            ...vazio,
          },
          {
            id: "bonus-1-fermentando-espinheira",
            titulo: "Aula 3 — Exemplo C",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: bonus1Espinheira,
            ...vazio,
          },
          {
            id: "bonus-1-tonico-capilar",
            titulo: "Aula 4 — Exemplo D",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: bonus1Tonico,
            ...vazio,
          },
        ],
      },
      {
        id: "bonus-2-cafe",
        numero: 2,
        titulo: "Bônus 2 — Exemplo",
        descricao: PLACEHOLDER_TEXT,
        liberada: true,
        aulas: [
          {
            id: "bonus-2-chips-banana",
            titulo: "Aula 1 — Exemplo A",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: cafe1,
            ...vazio,
          },
          {
            id: "bonus-2-drink-tpm",
            titulo: "Aula 2 — Exemplo B",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: cafe2,
            ...vazio,
            materiais: [
              {
                titulo: "Material de exemplo (PDF)",
                url: "REPLACE_ME_PDF_URL",
                descricao: "Receita completa em PDF (placeholder).",
              },
            ],
          },
          {
            id: "bonus-2-semente-abobora",
            titulo: "Aula 3 — Exemplo C",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: cafe3,
            ...vazio,
          },
          {
            id: "bonus-2-leite-vegetal",
            titulo: "Aula 4 — Exemplo D",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: cafe4,
            ...vazio,
          },
        ],
      },
      {
        id: "bonus-3-almoco",
        numero: 3,
        titulo: "Bônus 3 — Exemplo",
        descricao: PLACEHOLDER_TEXT,
        liberada: true,
        aulas: [
          {
            id: "bonus-3-panqueca-beterraba",
            titulo: "Aula 1 — Exemplo A",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: almoco1,
            ...vazio,
          },
          {
            id: "bonus-3-mocoto-cogumelos",
            titulo: "Aula 2 — Exemplo B",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: almoco2,
            ...vazio,
          },
          {
            id: "bonus-3-file-5-graos",
            titulo: "Aula 3 — Exemplo C",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: almoco3,
            ...vazio,
          },
          {
            id: "bonus-3-quiabo-agridoce",
            titulo: "Aula 4 — Exemplo D",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: almoco4,
            ...vazio,
          },
          {
            id: "bonus-3-panqueca-ora-pro-nobis",
            titulo: "Aula 5 — Exemplo E",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: almoco5,
            ...vazio,
          },
          {
            id: "bonus-3-almondega-quinoa",
            titulo: "Aula 6 — Exemplo F",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: almoco6,
            ...vazio,
          },
          {
            id: "bonus-3-strogonoff-abobrinha",
            titulo: "Aula 7 — Exemplo G",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: almoco7,
            ...vazio,
          },
          {
            id: "bonus-3-biomassa-nhoque",
            titulo: "Aula 8 — Exemplo H",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: almoco8,
            ...vazio,
          },
        ],
      },
      {
        id: "bonus-4-jantar",
        numero: 4,
        titulo: "Bônus 4 — Exemplo",
        descricao: PLACEHOLDER_TEXT,
        liberada: true,
        aulas: [
          {
            id: "bonus-4-risoto-quinoa",
            titulo: "Aula 1 — Exemplo A",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: jantar1,
            ...vazio,
          },
          {
            id: "bonus-4-arroz-negro",
            titulo: "Aula 2 — Exemplo B",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: jantar2,
            ...vazio,
          },
          {
            id: "bonus-4-enroladinho-almeirao",
            titulo: "Aula 3 — Exemplo C",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: jantar3,
            ...vazio,
          },
          {
            id: "bonus-4-macarrao-abobrinha",
            titulo: "Aula 4 — Exemplo D",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: jantar4,
            ...vazio,
          },
        ],
      },
      {
        id: "bonus-5-sobremesas",
        numero: 5,
        titulo: "Bônus 5 — Exemplo",
        descricao: PLACEHOLDER_TEXT,
        liberada: true,
        aulas: [
          {
            id: "bonus-5-adocante-natural",
            titulo: "Aula 1 — Exemplo A",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: sobremesa1,
            ...vazio,
          },
          {
            id: "bonus-5-sorbet-manga",
            titulo: "Aula 2 — Exemplo B",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: sobremesa2,
            ...vazio,
          },
          {
            id: "bonus-5-doce-biomassa",
            titulo: "Aula 3 — Exemplo C",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: sobremesa3,
            ...vazio,
          },
          {
            id: "bonus-5-brigadeiro-natural",
            titulo: "Aula 4 — Exemplo D",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: sobremesa4,
            ...vazio,
          },
        ],
      },
      {
        id: "bonus-6-pastas-molhos",
        numero: 6,
        titulo: "Bônus 6 — Exemplo",
        descricao: PLACEHOLDER_TEXT,
        liberada: true,
        aulas: [
          {
            id: "bonus-6-molho-beterraba",
            titulo: "Aula 1 — Exemplo A",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: pastas1,
            ...vazio,
          },
          {
            id: "bonus-6-chevry",
            titulo: "Aula 2 — Exemplo B",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: pastas2,
            ...vazio,
          },
          {
            id: "bonus-6-maionese-dente-leao",
            titulo: "Aula 3 — Exemplo C",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: pastas3,
            ...vazio,
          },
          {
            id: "bonus-6-erva-baleeira",
            titulo: "Aula 4 — Exemplo D",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: pastas4,
            ...vazio,
          },
          {
            id: "bonus-6-pasta-amendoim",
            titulo: "Aula 5 — Exemplo E",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: pastas5,
            ...vazio,
          },
          {
            id: "bonus-6-tahine",
            titulo: "Aula 6 — Exemplo F",
            descricao: PLACEHOLDER_TEXT,
            vturbId: "REPLACE_ME_VTURB_PLAYER_ID",
            thumbnailUrl: pastas6,
            ...vazio,
          },
        ],
      },
    ],
  },
];

// Acesso plano para módulos e aulas
export const MODULOS: Modulo[] = CATEGORIAS.flatMap((c) => c.modulos);

export function findModulo(id: string): { modulo: Modulo; categoria: Categoria } | null {
  for (const c of CATEGORIAS) {
    const m = c.modulos.find((x) => x.id === id);
    if (m) return { modulo: m, categoria: c };
  }
  return null;
}

export function findAula(id: string): { aula: Aula; modulo: Modulo } | null {
  for (const c of CATEGORIAS) {
    for (const m of c.modulos) {
      const a = m.aulas.find((x) => x.id === id);
      if (a) return { aula: a, modulo: m };
    }
  }
  return null;
}

// Listas usadas no quiz da Fase 1 — agrupadas por categoria.
// PLACEHOLDER: conteúdo genérico de exemplo; substituir pelas categorias
// e itens reais do produto do cliente.
export type GrupoOpcoes = { categoria: string; emoji: string; itens: string[] };

export const ATNN_GRUPOS: GrupoOpcoes[] = [
  {
    categoria: "Categoria de Exemplo A",
    emoji: "🔸",
    itens: [
      "Item de exemplo A1",
      "Item de exemplo A2",
      "Item de exemplo A3",
    ],
  },
  {
    categoria: "Categoria de Exemplo B",
    emoji: "🔹",
    itens: [
      "Item de exemplo B1",
      "Item de exemplo B2",
      "Item de exemplo B3",
    ],
  },
  {
    categoria: "Categoria de Exemplo C",
    emoji: "🔶",
    itens: [
      "Item de exemplo C1",
      "Item de exemplo C2",
    ],
  },
];

export const ARI_GRUPOS: GrupoOpcoes[] = [
  {
    categoria: "Categoria de Exemplo D",
    emoji: "🔷",
    itens: [
      "Item de exemplo D1",
      "Item de exemplo D2",
      "Item de exemplo D3",
    ],
  },
  {
    categoria: "Categoria de Exemplo E",
    emoji: "🔺",
    itens: [
      "Item de exemplo E1",
      "Item de exemplo E2",
      "Item de exemplo E3",
    ],
  },
];

// Listas planas (compatibilidade com persistência existente).
export const ATNN_OPTIONS: string[] = ATNN_GRUPOS.flatMap((g) => g.itens);
export const ARI_OPTIONS: string[] = ARI_GRUPOS.flatMap((g) => g.itens);
