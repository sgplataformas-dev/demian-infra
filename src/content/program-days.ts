// Conteudo real de cada um dos 28 dias do programa — receitas, rotinas e
// trocas aprovadas pelo Dr. Demian (Protocolo-Reset-Alivio-Intestinal-
// Fibromialgia.pdf). A logica de qual variacao mostrar pra cada usuaria mora
// em program-engine.ts (resolveContent).
//
// Avisos "sempre presentes" do Dr. Demian (menopausa, remedio pra dormir
// afeta o sono, diabetes afeta o jejum) aparecem na tela de diagnostico
// (uma vez, de forma clara) em vez de repetidos nos 7 dias de cada fase — o
// tipo DayContent so tem um slot de conteudo principal + uma dica, entao a
// variacao do DIA em si usa os eixos que realmente mudam receita/rotina
// (intestino, turno, qualidade do sono, se acorda de madrugada, lactose).
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

const CALDO_LEGUMES =
  "Almoço ou jantar (12h/19h) — Caldo de legumes com frango desfiado: cozinhe 1 peito de frango pequeno, 1 cenoura, 1 abobrinha, 1 chuchu e 1 pedaço de gengibre em 800 ml de água com 1 colher de azeite e sal moderado por 30 minutos; desfie o frango e amasse parte dos legumes no próprio caldo. Serve pra todos os tipos de intestino — ideal nos dias de barriga estufada. Pressão alta: use sal mínimo ou ervas. Sem frango: troque por peixe branco.";

function buildSelarDay(diaGeral: number): ProgramDayDef {
  const d = diaDaFase(diaGeral);
  const resumo =
    "Comida cozida e morna, mastigação devagar e horários fixos — o intestino gosta de rotina. " +
    "Dois alimentos de feira (menos de R$10) ajudam a fechar os furos do intestino: banana verde e inhame cozido e resfriado, ricos em amido resistente (butirato, combustível da parede intestinal).";
  const trocaSemana =
    "Regra da semana: evite crus em excesso, frituras, álcool e bebidas com gás. Beba água em pequenos goles ao longo do dia e coma sentada, sem celular, por pelo menos 20 minutos.";
  const trocaTeste =
    "Teste dos 7 dias: se pelo menos 3 destes 5 sinais melhoraram, seu intestino está respondendo — fezes tipo 3 ou 4 em 4 dos últimos 7 dias; menos barriga estufada no fim da tarde; menos gases e cólica; sono um pouco menos picado; dor média caiu ao menos 1 ponto. Se nada melhorar, tudo bem: avise seu médico e siga pra fase 2 com ajustes.";
  const trocaOuDica = d === 7 ? trocaTeste : trocaSemana;

  return {
    diaGeral,
    rules: [
      {
        when: { intestino: "preso" },
        content: {
          titulo: `Selar — Dia ${d}`,
          resumo,
          conteudoPrincipal:
            "Café da manhã (7h30) — Mingau de chia, linhaça e mamão: misture 1 colher de sopa de chia e 1 de linhaça dourada moída em 150 ml de água morna (ou leite vegetal sem açúcar) e deixe 10 minutos até formar gel; acrescente ½ mamão papaia amassado e canela a gosto. Dá volume às fezes e as hidrata — ideal pra intestino preso. Quem tem obstrução intestinal ou restrição médica de fibras não deve usar; troque o mamão por 1 pera cozida sem casca. " +
            CALDO_LEGUMES,
          trocaOuDica,
        },
      },
      {
        when: { intestino: "solto" },
        content: {
          titulo: `Selar — Dia ${d}`,
          resumo,
          conteudoPrincipal:
            "Café da manhã (7h30) — Creme de banana verde com canela: aqueça 150 ml de água ou leite vegetal sem açúcar e dissolva 2 colheres de sopa de biomassa de banana verde (ou 1 banana verde cozida e amassada) mexendo até engrossar, 3 a 4 minutos; finalize com canela. O amido resistente dá consistência às fezes — serve também pra gastrite, por ser suave. Diabetes: controle a glicemia e mantenha a porção em 1 colher e meia. Sem biomassa, use banana-da-terra cozida. " +
            CALDO_LEGUMES,
          trocaOuDica,
        },
      },
      {
        when: { intestino: "alterna" },
        content: {
          titulo: `Selar — Dia ${d}`,
          resumo,
          conteudoPrincipal:
            "Café da manhã (7h30) — Banana verde cozida e amassada (a mesma base do creme de banana verde, veja o preparo na receita de intestino solto) com canela, em quantidade pequena — intestino que alterna entre preso e solto responde melhor a porções menores de amido resistente, mantendo a regularidade dos horários de refeição acima de tudo. " +
            CALDO_LEGUMES,
          trocaOuDica: `${trocaOuDica} Mantenha os mesmos horários de refeição todos os dias — é o que mais ajuda quando o intestino alterna.`,
        },
      },
      {
        when: { intestino: "estufado" },
        content: {
          titulo: `Selar — Dia ${d}`,
          resumo,
          conteudoPrincipal:
            "Esta semana, priorize tudo cozido e morno (sopas, caldos, purês, ovos, frango, peixe, legumes macios) e evite cru em excesso — é o que mais reduz a barriga estufada. " +
            CALDO_LEGUMES,
          trocaOuDica: `${trocaOuDica} Pra barriga estufada: chá de hortelã ou erva-doce depois das refeições, e mastigação bem lenta.`,
        },
      },
    ],
  };
}

function buildDesarmarDay(diaGeral: number): ProgramDayDef {
  const d = diaDaFase(diaGeral);
  const resumo =
    "Sai o que inflama, entra a troca equivalente — sem troca, a dieta não se sustenta. Nunca tome café em jejum logo ao acordar (espere 30 a 60 min) nem depois das 14h.";
  const trocaOuDica =
    "Tira isso, coloca aquilo: pão de forma/biscoito \"integral\" → tapioca ou pão de queijo de mandioca; açúcar/refrigerante → água com limão ou chá; molho pronto/embutidos → molho caseiro de tomate; iogurte com sabor → iogurte natural sem açúcar. Regra dos 3 segundos no rótulo: olhe só os 3 primeiros ingredientes — se tiver açúcar (xarope de glicose, maltodextrina, dextrose) ali, deixe na prateleira. A pior hora pra doce é sozinha e de estômago vazio (manhã em jejum ou à noite); se for comer, que seja depois do almoço, com proteína e fibra.";

  const diabetesNota =
    " Diabetes: comece o jejum com 10 horas (não 12h) e só aumente com liberação médica — meça a glicemia e interrompa se sentir tremor, suor frio ou tontura.";

  return {
    diaGeral,
    rules: [
      {
        when: { turno: "dia" },
        content: {
          titulo: `Desarmar — Dia ${d}`,
          resumo,
          conteudoPrincipal:
            "Jejum de 12 horas: última refeição (jantar leve) às 19h30, primeira refeição às 7h30. Durante o jejum, só água e chá sem açúcar — nada de café com açúcar ou leite." +
            diabetesNota,
          trocaOuDica,
        },
      },
      {
        when: { turno: "madrugada" },
        content: {
          titulo: `Desarmar — Dia ${d}`,
          resumo,
          conteudoPrincipal:
            "Jejum de 12 horas ancorado no seu turno: última refeição ao fim do turno (~6h, antes de dormir de dia), primeira refeição ~18h ao acordar — conte 12h a partir da sua última refeição e mantenha o horário fixo. Luz forte no início do turno e óculos escuros na saída ajudam o corpo a entender quando é \"dia\" e \"noite\" pra você." +
            diabetesNota,
          trocaOuDica,
        },
      },
      {
        when: { turno: "nao_trabalha_fora" },
        content: {
          titulo: `Desarmar — Dia ${d}`,
          resumo,
          conteudoPrincipal:
            "Jejum de 12 horas: última refeição (jantar leve) às 19h, primeira refeição às 7h. Durante o jejum, só água e chá sem açúcar." +
            diabetesNota,
          trocaOuDica,
        },
      },
    ],
  };
}

const SOPA_ABOBORA =
  "Jantar (19h) — Sopa de abóbora com gengibre e cúrcuma: refogue ½ cebola, 1 dente de alho e 1 pedaço de gengibre no azeite; junte 300g de abóbora cabotiá, 1 cenoura, 1 colher de chá de cúrcuma e 500 ml de água; cozinhe 20 minutos, bata no liquidificador e acerte o sal. Leve, aquece e combina com a rotina de sono. Quem toma anticoagulante deve falar com o médico antes de usar cúrcuma com frequência.";
const LIMPAR_DICAS =
  "Antes de dormir (21h) — Leite dourado sem leite: aqueça 200 ml de bebida vegetal sem açúcar com ½ colher de chá de cúrcuma, canela e pimenta-do-reino (sem ferver); beba cedo pra não acordar pra ir ao banheiro. Lanche (15h30) — Pudim de chia, a \"salvação da tarde\": misture 2 colheres de chia com 150 ml de iogurte natural (ou de coco) e canela na noite anterior; proteína, gordura boa e fibra evitam a queda de açúcar que dispara a vontade de doce.";

function buildLimparDay(diaGeral: number): ProgramDayDef {
  const d = diaDaFase(diaGeral);
  const rotinaBase =
    "Rotina de sono profundo: jantar leve até 3 horas antes de deitar, luz baixa na última hora (sem telas), quarto escuro/silencioso/fresco, mesmo horário de deitar e acordar (inclusive fins de semana), banho morno 1 hora antes de dormir, e chá de camomila ou erva-cidreira (200 ml) pra não acordar com vontade de ir ao banheiro.";

  return {
    diaGeral,
    rules: [
      {
        when: {},
        content: {
          titulo: `Limpar — Dia ${d}`,
          resumo: "Durante o sono profundo o corpo repara os tecidos e reduz a inflamação.",
          conteudoPrincipal: `${rotinaBase} ${SOPA_ABOBORA}`,
          trocaOuDica: LIMPAR_DICAS,
        },
      },
      {
        when: { sono: "regular" },
        content: {
          titulo: `Limpar — Dia ${d}`,
          resumo: "Durante o sono profundo o corpo repara os tecidos e reduz a inflamação.",
          conteudoPrincipal: `${rotinaBase} Reforço pra quem dorme irregular: luz natural nos primeiros 30 minutos do dia e sem cafeína depois das 14h. ${SOPA_ABOBORA}`,
          trocaOuDica: LIMPAR_DICAS,
        },
      },
      {
        when: { sono: "ruim" },
        content: {
          titulo: `Limpar — Dia ${d}`,
          resumo: "Durante o sono profundo o corpo repara os tecidos e reduz a inflamação.",
          conteudoPrincipal: `${rotinaBase} Reforço pra quem dorme mal: luz natural nos primeiros 30 minutos do dia, jantar 3h antes de deitar sem falta, e sem telas nem cafeína depois das 14h. ${SOPA_ABOBORA}`,
          trocaOuDica: LIMPAR_DICAS,
        },
      },
      {
        when: { sono: "insonia" },
        content: {
          titulo: `Limpar — Dia ${d}`,
          resumo: "Durante o sono profundo o corpo repara os tecidos e reduz a inflamação.",
          conteudoPrincipal: `${rotinaBase} Pra insônia: a rotina acima é a base — se persistir, fale com seu médico sobre opções de tratamento. ${SOPA_ABOBORA}`,
          trocaOuDica: LIMPAR_DICAS,
        },
      },
      {
        // Mais especifica que as regras de sono sozinhas — quando ela acorda
        // de madrugada, o ritual dos 10 minutos e o conteudo mais acionavel.
        when: { acordaDeMadrugada: true },
        content: {
          titulo: `Limpar — Dia ${d}`,
          resumo: "Pra quem acorda de madrugada e não dorme mais.",
          conteudoPrincipal:
            `${rotinaBase} O ritual dos 10 minutos: não pegue o celular nem acenda luz forte; respire 4 por 6 (inspire contando 4, solte contando 6) por 5 minutos; compressa morna na barriga ou nas costas; alongue devagar pescoço, ombros e quadril, ainda deitada; escreva uma única preocupação num papel pra resolver amanhã; volte a deitar com um gole de água morna. ${SOPA_ABOBORA}`,
          trocaOuDica: LIMPAR_DICAS,
        },
      },
    ],
  };
}

function buildRepovoarDay(diaGeral: number): ProgramDayDef {
  const d = diaDaFase(diaGeral);
  const resumo =
    "Depois de acalmar e limpar, é hora de devolver ao intestino as bactérias que ajudam. Comece com porções pequenas (1 a 2 colheres) e aumente aos poucos.";
  const chucrute =
    "Almoço, acompanhamento — Chucrute caseiro: amasse ½ repolho picado fino com 1 colher de sopa rasa de sal grosso por quilo até soltar água; pressione num pote de vidro esterilizado até ficar coberto pelo líquido; deixe 5 a 10 dias tampado, em local fresco, e guarde na geladeira. Serve pra todas, inclusive intolerância à lactose. Pressão alta: lave antes de comer e use pouca quantidade. Gastrite ativa: evite (é ácido).";
  const regras =
    "Comece com 1 colher de sopa por dia e aumente a cada 3 dias, até 3 a 4 colheres. Se aparecer gás ou cólica, volte à porção anterior por 3 dias — é normal nos primeiros dias. Use potes de vidro bem lavados; se o cheiro for de mofo ou aparecer fungo colorido, descarte. Fermentados não tratam infecção: se houver febre ou diarreia forte, procure o médico.";

  return {
    diaGeral,
    rules: [
      {
        when: { lactose: "tolera" },
        content: {
          titulo: `Repovoar — Dia ${d}`,
          resumo,
          conteudoPrincipal:
            "Café da manhã ou lanche — Iogurte caseiro: misture 1 litro de leite integral fervido e morno (~40°C) com 2 colheres de sopa de iogurte natural com cultura viva; tampe e deixe em local morno por 8 a 12 horas, depois leve à geladeira (dura até 7 dias). Ideal pra intestino preso ou que alterna. " +
            chucrute,
          trocaOuDica: regras,
        },
      },
      {
        when: { lactose: "intolerante" },
        content: {
          titulo: `Repovoar — Dia ${d}`,
          resumo,
          conteudoPrincipal:
            "Lanche (16h) — Kefir de água, o fermentado sem leite: dissolva 3 colheres de sopa de açúcar mascavo em 1 litro de água filtrada, junte 2 colheres de grãos de kefir de água e 1 figo seco (ou rodela de limão); tampe com pano e deixe 24 a 48 horas; coe, guarde na geladeira e beba 100 ml por dia. Diabetes: prefira a fermentação mais longa (48h) e porção pequena. Sem kefir, use chá de kombucha sem açúcar do mercado. " +
            chucrute,
          trocaOuDica: regras,
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

// Os 12 itens que a VSL cita como "amostra" do app — respostas reais do
// Dr. Demian (Dr_Demian_respondido.pdf).
export const VSL_CONTENT: VslContentItem[] = [
  {
    id: "teste-7-dias",
    titulo: "Teste dos 7 dias",
    resumo:
      "Como saber, sem exame, se o intestino está selando: se pelo menos 3 de 5 sinais melhoraram (fezes tipo 3 ou 4 em 4 dos 7 dias; menos inchaço no fim da tarde; menos gases e cólica; menos desejo de doce e mais energia depois do almoço; dor média caiu ao menos 1 ponto), seu intestino está respondendo.",
  },
  {
    id: "alimentos-feira",
    titulo: "Os 2 alimentos de feira que fecham os furos",
    resumo:
      "Banana verde (biomassa) e inhame cozido e resfriado, menos de R$10. Os dois fornecem amido resistente, que as bactérias transformam em butirato, o principal combustível das células da parede do intestino.",
  },
  {
    id: "pior-hora-doce",
    titulo: "Pior hora do dia para comer doce",
    resumo:
      "Sozinho e de estômago vazio: de manhã em jejum e à noite. O melhor momento é depois do almoço, junto de proteína e fibra.",
  },
  {
    id: "nunca-depois-20h",
    titulo: "O que nunca comer depois das 20h",
    resumo:
      "Doces, frituras, refeição volumosa, carboidrato refinado, álcool e bebidas com cafeína (café, chá preto, mate) — atrasam a melatonina, elevam o cortisol e fragmentam o sono.",
  },
  {
    id: "fruta-fora-cafe",
    titulo: "A fruta que não vai no café da manhã",
    resumo:
      "Suco de laranja, e qualquer fruta doce ou ácida sozinha em jejum: é açúcar rápido, sem fibra e sem proteína. A fruta inteira vai bem junto de ovo, iogurte natural ou chia.",
  },
  {
    id: "iogurte-mercado",
    titulo: "Qual iogurte de mercado escolher (e qual deixar)",
    resumo:
      "Escolher: iogurte natural integral, sem açúcar, lista curta (leite + fermentos). Deixar na prateleira: bebida láctea, sabores, \"light\" com adoçante, e os com amido, aromatizante ou espessante.",
  },
  {
    id: "ritual-10-minutos",
    titulo: "Ritual dos 10 minutos",
    resumo:
      "Para quem acorda às 3h: sem celular nem luz forte; respiração 4 por 6 por 5 minutos; compressa morna na barriga ou costas; alongamento lento deitada; escrever uma única preocupação num papel; gole de água morna e voltar a deitar.",
  },
  {
    id: "ingrediente-escondido",
    titulo: "O ingrediente escondido no rótulo",
    resumo:
      "Pão de forma, molho pronto: açúcar com outros nomes (xarope de glicose, maltodextrina, dextrose, açúcar invertido), óleos refinados e emulsificantes. Regra dos 3 segundos: leia só os 3 primeiros itens do rótulo.",
  },
  {
    id: "salvacao-tarde",
    titulo: "A salvação da tarde",
    resumo:
      "7 dias sem açúcar sem passar vontade: pudim de chia com iogurte natural (ou de coco) e canela, às 15h30. Proteína, gordura boa e fibra evitam a queda de açúcar que dispara a vontade de doce.",
  },
  {
    id: "alimento-todo-dia",
    titulo: "O alimento que toda paciente come todo dia",
    resumo:
      "1 colher de sopa de linhaça dourada moída — fibra solúvel e insolúvel, ômega-3 vegetal, regula os dois tipos de intestino. Polvilhe no mingau, iogurte ou sopa.",
  },
  {
    id: "horarios-sem-cafe",
    titulo: "2 horários em que nunca tomar café",
    resumo:
      "Em jejum logo ao acordar (espere 30 a 60 minutos) e depois das 14h — a cafeína leva horas pra sair do corpo e piora o sono.",
  },
  {
    id: "vontade-doce-tarde",
    titulo: "Como fazer a vontade de doce da tarde sumir",
    resumo:
      "Lanche às 15h30 com proteína, gordura boa e fibra, um copo de água antes e 10 minutos de caminhada depois. Quando a glicose não cai, a vontade de doce não aparece.",
  },
];
