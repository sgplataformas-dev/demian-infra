// Gera o texto do diagnostico a partir do perfil coletado na avaliacao —
// transcricao, em linguagem de paciente, da logica "o que muda no
// protocolo" aprovada pelo Dr. Demian (Dr_Demian_respondido.pdf). Pure
// function, sem I/O — so formata o que ja esta em ProgramProfile.
import type { ProgramProfile } from "@/content/program-engine";

export type Diagnostico = {
  tomETempo: string;
  expectativa: string;
  leituraDor: string;
  planoSelar: string;
  metaFibra: string;
  horarios: string;
  avisosRemedios: string[];
  trocasCondicoes: string[];
  notaMenopausa: string | null;
  notaEvento: string | null;
};

function addMinutos(hhmm: string, deltaMin: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = (h! * 60 + m! + deltaMin + 24 * 60) % (24 * 60);
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}h${mm > 0 ? String(mm).padStart(2, "0") : ""}`;
}

function tomETempoPorIdade(idade: number): string {
  if (idade < 40) {
    return "Pelo seu perfil, o foco inicial é reorganizar o eixo estresse-intestino-sono — a resposta costuma aparecer em 3 a 4 semanas.";
  }
  if (idade <= 55) {
    return "Seu protocolo também leva em conta o eixo hormonal (perimenopausa) — a resposta costuma aparecer em 4 a 6 semanas.";
  }
  return "Seu protocolo reforça proteína, colágeno e músculo — a resposta costuma aparecer em 6 a 8 semanas.";
}

function expectativaPorTempoDor(tempoDor: ProgramProfile["tempoDor"]): string {
  switch (tempoDor) {
    case "menos_2":
      return "Como a dor começou há menos de 2 anos, a expectativa é sentir resposta em 2 a 4 semanas.";
    case "2_a_5":
      return "Com 2 a 5 anos de dor, a expectativa é sentir resposta em 4 a 8 semanas.";
    case "5_a_10":
      return "Com 5 a 10 anos de dor, a expectativa é de 8 a 12 semanas — nessa fase a sensibilização central já costuma estar instalada, então as metas vêm por degraus.";
    case "mais_10":
      return "Com mais de 10 anos de dor, a expectativa é de 12 semanas ou mais, com foco em ter mais dias bons por semana — não na ausência total de dor.";
  }
}

function leituraDor(profile: ProgramProfile): string {
  const partes: string[] = [];
  if (profile.ondeDoi.includes("abdomen")) {
    partes.push("a dor abdominal reforça o acompanhamento pelo eixo intestinal");
  }
  const difusa = ["pescoco_ombros", "lombar_quadril", "bracos_pernas"].some((p) =>
    profile.ondeDoi.includes(p),
  );
  if (difusa) {
    partes.push("a dor mais espalhada pelo corpo reforça o acompanhamento pelo sono e pela inflamação");
  }
  const leitura = partes.length > 0 ? ` — ${partes.join("; ")}` : "";
  return `Sua dor hoje é ${profile.dorHoje}/10${leitura}. Esse é o ponto de partida; a meta é cair pelo menos 2 pontos (ou 30%) em 4 semanas.`;
}

function planoSelar(intestino: ProgramProfile["intestino"]): string {
  switch (intestino) {
    case "preso":
      return "Seu intestino preso vai receber o Mingau de chia, linhaça e mamão nas manhãs da fase Selar — dá volume e hidrata as fezes.";
    case "solto":
      return "Seu intestino solto vai receber o Creme de banana verde com canela nas manhãs da fase Selar — o amido resistente dá mais consistência.";
    case "alterna":
      return "Como seu intestino alterna entre preso e solto, a fase Selar foca em porções pequenas de banana verde e regularidade de horários.";
    case "estufado":
      return "Como você sente a barriga estufada, a fase Selar prioriza tudo cozido e morno, sem cru, com chá de hortelã ou erva-doce depois das refeições.";
  }
}

function metaFibra(vezesBanheiro: ProgramProfile["vezesBanheiro"]): string {
  switch (vezesBanheiro) {
    case "todo_dia":
      return "Você já vai ao banheiro todo dia — mantém a rotina, com meta de 25g de fibra por dia.";
    case "3_a_5":
      return "Indo 3 a 5 vezes por semana, a meta é aumentar a fibra aos poucos e beber 1,5 a 2 litros de líquidos por dia.";
    case "menos_3":
      return "Indo menos de 3 vezes por semana, a meta é 30g de fibra, 2 litros de líquidos, caminhada de 15 minutos e horário fixo no banheiro depois do café da manhã.";
  }
}

const REMEDIO_AVISO: Record<string, string> = {
  pregabalina: "Pregabalina: mantenha o horário noturno; fique atenta ao intestino e à retenção de líquidos.",
  gabapentina: "Gabapentina: mantenha o horário noturno; fique atenta ao intestino e à retenção de líquidos.",
  duloxetina: "Duloxetina: tome com alimento, de manhã.",
  amitriptilina: "Amitriptilina: pode causar constipação e boca seca — reforce fibra, água e ameixa.",
  relaxante:
    "Relaxante muscular: mantenha a dose e o horário prescritos; a rotina de sono é um complemento, não substitui o remédio. Não misture com álcool.",
  remedio_dormir:
    "Remédio para dormir: mantenha a dose e o horário prescritos; não misture com álcool nem chás sedativos em excesso.",
  omeprazol:
    "Omeprazol: reduz a absorção de B12, magnésio e ferro — priorize alimentos ricos nesses nutrientes e tome 30 minutos antes do café.",
};

const CONDICAO_TROCA: Record<string, string> = {
  diabetes: "Diabetes: baixo índice glicêmico, proteína e fibra antes do carboidrato, banana verde em porção pequena.",
  pressao_alta: "Pressão alta: ervas, alho, folhas verdes; lave o chucrute antes de comer.",
  gastrite: "Gastrite: evite acidez, café e pimenta; prefira mingau, chá de camomila e kefir de água suave.",
  lactose: "Intolerância à lactose: fermentados vegetais (kefir de água, chucrute) no lugar dos laticínios.",
};

export function gerarDiagnostico(profile: ProgramProfile): Diagnostico {
  const horarios =
    `Café da manhã até ${addMinutos(profile.horaAcorda, 60)}, lanche às 15h30, ` +
    `último café às ${addMinutos(profile.horaDorme, -8 * 60)} e jantar até ${addMinutos(profile.horaDorme, -3 * 60)} — ` +
    `calculado a partir do seu horário de acordar (${profile.horaAcorda.replace(":", "h")}) e dormir (${profile.horaDorme.replace(":", "h")}).`;

  const avisosRemedios = profile.remedios
    .map((r) => REMEDIO_AVISO[r])
    .filter((x): x is string => Boolean(x));

  const trocasCondicoes = profile.condicoes
    .map((c) => CONDICAO_TROCA[c])
    .filter((x): x is string => Boolean(x));

  const notaMenopausa =
    profile.menopausa !== "nao"
      ? "Como você está na menopausa (ou não tem certeza), a queda de estrogênio e progesterona tende a fragmentar o sono e elevar o cortisol noturno — por isso a fase Limpar do seu protocolo reforça jantar cedo e leve, linhaça, quarto fresco e luz forte pela manhã."
      : null;

  const eventoRelevante = profile.eventoAntesDor.filter((e) => e !== "nenhum");
  let notaEvento: string | null = null;
  if (eventoRelevante.some((e) => e === "infeccao" || e === "antibiotico")) {
    notaEvento =
      "Como uma infecção ou uso de antibiótico antecedeu sua dor, isso pode ter afetado sua microbiota — por isso a fase Repovoar ganha atenção extra no seu protocolo.";
  } else if (eventoRelevante.includes("estresse_intenso")) {
    notaEvento =
      "Como um período de estresse intenso antecedeu sua dor, a fase Limpar (sono e ritmo) é reforçada no seu protocolo.";
  }

  return {
    tomETempo: tomETempoPorIdade(profile.idade),
    expectativa: expectativaPorTempoDor(profile.tempoDor),
    leituraDor: leituraDor(profile),
    planoSelar: planoSelar(profile.intestino),
    metaFibra: metaFibra(profile.vezesBanheiro),
    horarios,
    avisosRemedios,
    trocasCondicoes,
    notaMenopausa,
    notaEvento,
  };
}
