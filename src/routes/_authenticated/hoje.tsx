import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Play, ArrowRight, Calendar, Heart } from "lucide-react";
import { getProgramStatus } from "@/lib/program-profile.functions";
import { PHASES, type PhaseId } from "@/content/program-engine";
import { PHASE_ICONS, PHASE_BADGE_CLASSES } from "@/content/phase-ui";
import { missedDayMessage } from "@/content/motivational-messages";
import { BlobDecoration } from "@/components/BlobDecoration";
import { MessageResponse } from "@/components/ai-elements/message";

export const Route = createFileRoute("/_authenticated/hoje")({
  component: Hoje,
});

function Hoje() {
  const fetchStatus = useServerFn(getProgramStatus);
  const { data, isLoading } = useQuery({
    queryKey: ["programa-status"],
    queryFn: () => fetchStatus(),
    retry: false,
  });

  const temPerfil = !isLoading && data?.temPerfil === true;
  const status = data?.temPerfil ? data : null;
  const faseAtual = status?.fase ?? null;
  const conteudoHoje = status?.conteudoHoje ?? null;
  const diasPulados = status?.diasPulados ?? 0;
  const FaseIcon = faseAtual ? PHASE_ICONS[faseAtual.id] : null;

  if (!temPerfil) {
    return (
      <div className="px-5 py-7">
        <h1 className="text-3xl font-extrabold leading-tight text-foreground">
          Bem-vinda ao
          <br />
          Protocolo Reset! 👋
        </h1>
        <p className="mt-2 text-base text-muted-foreground">Sua jornada de 28 dias começa aqui.</p>

        <div className="relative mt-6 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="relative flex min-h-[180px] items-center justify-between gap-4 bg-secondary/40 p-6">
            <BlobDecoration className="absolute inset-0 h-full w-full" />
            <div className="relative z-10">
              <p className="text-xl font-bold leading-tight text-foreground">
                Conheça o
                <br />
                seu protocolo
              </p>
              <div className="mt-3 h-1 w-10 rounded-full bg-gold" />
            </div>
            <button
              type="button"
              className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:scale-95"
              aria-label="Assistir vídeo de boas-vindas"
            >
              <Play className="ml-1 h-6 w-6 fill-current" />
            </button>
          </div>
        </div>

        <p className="mt-6 text-base leading-relaxed text-muted-foreground">
          Vamos começar pela sua avaliação inicial para organizar sua jornada.
        </p>
        <Link
          to="/programa-intake"
          className="mt-4 flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-md active:scale-[0.99]"
        >
          Iniciar avaliação
          <ArrowRight className="h-5 w-5" />
        </Link>

        <FaseStrip faseAtivaId={null} />
      </div>
    );
  }

  return (
    <div className="px-5 py-7">
      <h1 className="text-2xl font-extrabold leading-tight text-foreground">Bom te ver de novo 👋</h1>
      {faseAtual && (
        <p className="mt-1 text-sm text-muted-foreground">
          Fase {faseAtual.numero} — {faseAtual.nome} • Dia {status?.diaGeral ?? "–"} de 28
        </p>
      )}

      {diasPulados > 0 && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-4">
          <Heart className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
          <p className="text-sm leading-relaxed text-foreground">{missedDayMessage(diasPulados)}</p>
        </div>
      )}

      {conteudoHoje ? (
        <section className="mt-5 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-2 bg-secondary/40 px-5 py-3">
            {FaseIcon && <FaseIcon className="h-4 w-4 text-primary" />}
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Hoje</span>
          </div>
          <div className="p-5">
            <h2 className="text-lg font-bold leading-tight">{conteudoHoje.titulo}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{conteudoHoje.resumo}</p>
            <div className="mt-4 rounded-2xl bg-muted/60 p-4 text-sm">
              <p className="font-semibold text-foreground">O que fazer:</p>
              <MessageResponse className="mt-1 text-muted-foreground [&_strong]:text-foreground">
                {conteudoHoje.conteudoPrincipal}
              </MessageResponse>
            </div>
            {conteudoHoje.trocaOuDica ? (
              <div className="mt-3 rounded-2xl bg-muted/60 p-4 text-sm">
                <p className="font-semibold text-foreground">Troca do dia:</p>
                <MessageResponse className="mt-1 text-muted-foreground [&_strong]:text-foreground">
                  {conteudoHoje.trocaOuDica}
                </MessageResponse>
              </div>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="mt-5 flex items-center gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Seu programa de 28 dias já terminou — parabéns pela jornada! 🎉
          </p>
        </section>
      )}

      <Link
        to="/programa"
        className="mt-5 flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-md active:scale-[0.99]"
      >
        Ver toda a jornada
        <ArrowRight className="h-5 w-5" />
      </Link>

      <FaseStrip faseAtivaId={faseAtual?.id ?? null} />
    </div>
  );
}

function FaseStrip({ faseAtivaId }: { faseAtivaId: PhaseId | null }) {
  return (
    <section className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Calendar className="h-4 w-4 text-primary" />
        Sua jornada • 4 fases • 28 dias
      </div>
      <div className="mt-4 flex items-start justify-between">
        {PHASES.map((fase) => {
          const Icon = PHASE_ICONS[fase.id];
          return (
            <div key={fase.id} className="flex flex-1 flex-col items-center gap-2 text-center">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  fase.id === faseAtivaId
                    ? "bg-primary text-primary-foreground"
                    : PHASE_BADGE_CLASSES[fase.id]
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Fase {fase.numero}</p>
                <p className="text-[11px] leading-tight text-muted-foreground">{fase.nome}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
