import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import { getProgramStatus } from "@/lib/program-profile.functions";
import { PHASES, type PhaseId } from "@/content/program-engine";
import { PHASE_ICONS } from "@/content/phase-ui";
import { MessageResponse } from "@/components/ai-elements/message";

const PHASE_IDS = new Set(PHASES.map((f) => f.id));

export const Route = createFileRoute("/_authenticated/programa/$faseId")({
  loader: ({ params }) => {
    if (!PHASE_IDS.has(params.faseId as PhaseId)) throw notFound();
  },
  component: FaseDetalhe,
});

function FaseDetalhe() {
  const { faseId } = Route.useParams();
  const fase = PHASES.find((f) => f.id === faseId)!;
  const Icon = PHASE_ICONS[fase.id as PhaseId];

  const fetchStatus = useServerFn(getProgramStatus);
  const { data, isLoading } = useQuery({
    queryKey: ["programa-status"],
    queryFn: () => fetchStatus(),
    retry: false,
  });

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Carregando...</div>;
  }

  const diaGeral = data?.temPerfil ? data.diaGeral : null;
  const conteudoHoje = data?.temPerfil ? data.conteudoHoje : null;
  const faseAtiva =
    diaGeral !== null &&
    diaGeral !== undefined &&
    diaGeral >= fase.diaInicio &&
    diaGeral <= fase.diaFim;
  const concluida = diaGeral !== null && diaGeral !== undefined && diaGeral > fase.diaFim;
  const bloqueada = diaGeral === null || diaGeral === undefined || diaGeral < fase.diaInicio;

  return (
    <div className="px-5 py-7">
      <Link
        to="/programa"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar pra jornada
      </Link>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-gold">
            Fase {fase.numero} • Dias {fase.diaInicio}–{fase.diaFim}
          </p>
          <h1 className="text-2xl font-extrabold leading-tight">{fase.nome}</h1>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{fase.subtitulo}</p>

      {faseAtiva && conteudoHoje ? (
        <section className="mt-6 rounded-3xl border border-primary/20 bg-card p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-gold">Hoje</p>
          <h2 className="mt-1 text-lg font-bold leading-tight">{conteudoHoje.titulo}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {conteudoHoje.resumo}
          </p>
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
        </section>
      ) : concluida ? (
        <section className="mt-6 flex items-center gap-3 rounded-3xl border border-border bg-card p-5 shadow-sm">
          <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            Você já passou por essa fase. Siga na fase atual pela aba Jornada.
          </p>
        </section>
      ) : bloqueada ? (
        <section className="mt-6 flex items-center gap-3 rounded-3xl border border-dashed border-border bg-card p-5 shadow-sm opacity-80">
          <Lock className="h-6 w-6 shrink-0 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Essa fase ainda não foi liberada. Continue na fase atual primeiro.
          </p>
        </section>
      ) : null}
    </div>
  );
}
