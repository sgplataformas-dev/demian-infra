// Frases de acolhimento pro cenario "voltou depois de pular um ou mais dias"
// (ver hoje.tsx). Cada frase SEMPRE reforca que a jornada nao reiniciou (o
// dia do programa e por calendario, nunca zera sozinho) e fecha com um
// empurrao motivacional, pra ela nao perder o animo de continuar as aulas.
//
// Escolha deterministica por dia (muda dia a dia, mas nao "pisca" entre
// mensagens diferentes a cada refetch do react-query no mesmo dia).
const MENSAGENS: ((dias: string) => string)[] = [
  (dias) =>
    `Você ficou ${dias} sem abrir o app — sem culpa nenhuma. Sua jornada não reiniciou: é só seguir de onde você está, a partir de hoje.`,
  (dias) =>
    `Tudo bem ter passado ${dias} sem vir por aqui. O que importa não é a sequência perfeita, é não desistir — e você voltou.`,
  (dias) =>
    `Mesmo depois de ${dias} de pausa, o que você já construiu continua valendo. Hoje é um novo ponto de partida, não um recomeço do zero.`,
  (dias) =>
    `Ninguém precisa ser perfeita todos os dias — tudo bem ter ficado ${dias} sem abrir o app. O que importa é que você está aqui agora. Bora continuar?`,
  (dias) =>
    `Sua constância vale mais que uma sequência sem falhas. Mesmo com ${dias} de intervalo, você não saiu do caminho: siga de onde parou.`,
  (dias) =>
    `Recomeçar não é fraqueza, é coragem. Você ficou ${dias} fora, mas sua jornada de 28 dias continua exatamente de onde parou.`,
];

function diaDoAno(data: Date): number {
  const inicioDoAno = new Date(data.getFullYear(), 0, 0);
  const diffMs = data.getTime() - inicioDoAno.getTime();
  return Math.floor(diffMs / 86_400_000);
}

/** Mensagem de acolhimento pro banner de "dias pulados", trocando dia a dia. */
export function missedDayMessage(diasPulados: number, hoje: Date = new Date()): string {
  const dias = diasPulados === 1 ? "1 dia" : `${diasPulados} dias`;
  const indice = diaDoAno(hoje) % MENSAGENS.length;
  return MENSAGENS[indice]!(dias);
}
