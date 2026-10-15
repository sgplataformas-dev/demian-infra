import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import { getProgramStatus } from "@/lib/program-profile.functions";
import { PHASES, type PhaseId } from "@/content/program-engine";
import { PHASE_ICONS } from "@/content/phase-ui";

export const Route = createFileRoute("/_authenticated/programa")({
  component: ProgramaPage,
});

function ProgramaPage() {
  const fetchStatus = useServerFn(getProgramStatus);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["programa-status"],
    queryFn: () => fetchStatus(),
    retry: false,
  });

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Carregando...</div>;
  }

  if (isError || !data) {
    return (
      <div className="px-5 py-7">
        <p className="text-sm text-destructive">
          Não foi possível carregar sua jornada. Tente novamente em instantes.
        </p>
      </div>
    );
  }

  if (!data.temPerfil) {
    return (
      <div className="px-5 py-10 text-center">
        <Sparkles className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Sua jornada ainda não começou</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          Responda 5 perguntas rápidas e a gente monta a versão certa do protocolo pra você.
        </p>
        <Link
          to="/programa-intake"
          className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground"
        >
          Começar agora
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const faseAtualId: PhaseId | null = data.fase?.id ?? null;

  return (
    <div className="px-5 py-7">
      <h1 className="text-3xl font-extrabold leading-tight text-foreground">
        Sua jornada de 28 dias
      </h1>
      <div className="mt-2 h-1 w-10 rounded-full bg-gold" />
      <p className="mt-3 text-sm text-muted-foreground">Escolha uma fase para começar.</p>

      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Calendar className="h-4 w-4 text-primary" />4 fases • 28 dias
      </div>

      <div className="mt-4 space-y-3">
        {PHASES.map((fase) => {
          const Icon = PHASE_ICONS[fase.id];
          const concluida = data.programaEncerrado || (data.diaGeral ?? 0) > fase.diaFim;
          const ativa = fase.id === faseAtualId;
          const bloqueada = !concluida && !ativa && (data.diaGeral ?? 0) < fase.diaInicio;

          const status = ativa
            ? "Comece por aqui."
            : concluida
              ? "Concluída."
              : bloqueada
                ? "Em breve."
                : "Continue sua jornada.";

          return (
            <Link
              key={fase.id}
              to="/programa/$faseId"
              params={{ faseId: fase.id }}
              className={`flex items-center gap-4 rounded-3xl p-5 shadow-sm transition active:scale-[0.99] ${
                ativa
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground"
              }`}
            >
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${
                  ativa ? "bg-white/15" : "bg-primary/10"
                }`}
              >
                <Icon className={`h-6 w-6 ${ativa ? "text-primary-foreground" : "text-primary"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold leading-tight">
                  Fase {fase.numero} — {fase.nome}
                </p>
                <p className={`mt-0.5 text-sm font-semibold ${ativa ? "text-gold" : "text-gold"}`}>
                  Dias {fase.diaInicio}–{fase.diaFim}
                </p>
                <p
                  className={`mt-0.5 text-sm ${ativa ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {status}
                </p>
                {ativa && (
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-gold"
                      style={{
                        width: `${Math.min(100, Math.max(0, (((data.diaGeral ?? fase.diaInicio) - fase.diaInicio + 1) / 7) * 100))}%`,
                      }}
                    />
                  </div>
                )}
              </div>
              <ArrowRight
                className={`h-5 w-5 shrink-0 ${ativa ? "text-primary-foreground/70" : "text-muted-foreground"}`}
              />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
