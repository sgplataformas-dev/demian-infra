// Base de conhecimento do assistente de IA do chat (server-only).
// PLACEHOLDER: o conteúdo real do produto do cliente Demian ainda não foi
// definido. Substitua os textos abaixo pela base de conhecimento oficial
// (materiais, protocolo, catálogo e dados de suporte) quando estiver pronta.
// A estrutura (4 constantes + getKnowledgeBase) deve ser mantida.

export const BASE_DE_DADOS = `## Base de Conhecimento — Placeholder

Texto de exemplo — substituir pelo conteúdo real do cliente.

Este documento deve reunir, quando disponível, o conteúdo oficial do
produto/protocolo do cliente (guias, planos, receitas, mecanismos de ação
etc.) para consulta do assistente de IA do chat.
`;

export const LISTA_DE_COMPRAS = `## Lista de Compras — Placeholder

Texto de exemplo — substituir pelo conteúdo real do cliente.
`;

export const AULAS_EM_VIDEO = `## Aulas em Vídeo do Aplicativo — Placeholder

Texto de exemplo — substituir pelo conteúdo real do cliente. Aqui devem
entrar os resumos das aulas em vídeo do catálogo, para o assistente poder
responder dúvidas sem precisar mandar o usuário para o suporte.
`;

export const SUPORTE = `## Suporte e Atendimento — Placeholder

Texto de exemplo — substituir pelo conteúdo real do cliente.

**WhatsApp do suporte:** REPLACE_ME_SUPPORT_PHONE

**Link de contato:** REPLACE_ME_SUPPORT_WHATSAPP_LINK

Responda sempre que o usuário perguntar por "suporte", "whatsapp", "atendimento", "ajuda humana", "falar com alguém", "dúvida sobre acesso" ou termos similares.
`;

export function getKnowledgeBase() {
  return `${BASE_DE_DADOS}\n\n===== LISTA DE COMPRAS INTELIGENTE =====\n\n${LISTA_DE_COMPRAS}\n\n===== AULAS EM VÍDEO DO APLICATIVO =====\n\n${AULAS_EM_VIDEO}\n\n===== SUPORTE E ATENDIMENTO =====\n\n${SUPORTE}`;
}
