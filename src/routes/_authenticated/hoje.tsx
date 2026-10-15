import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Play, ArrowRight, Calendar } from "lucide-react";
import { getProgramStatus } from "@/lib/program-profile.functions";
import { PHASES } from "@/content/program-engine";
import { PHASE_ICONS, PHASE_BADGE_CLASSES } from "@/content/phase-ui";
import { BlobDecoration } from "@/components/BlobDecoration";

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

      {!temPerfil ? (
        <>
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
        </>
      ) : (
        <Link
          to="/programa"
          className="mt-6 flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-md active:scale-[0.99]"
        >
          Continuar minha jornada
          <ArrowRight className="h-5 w-5" />
        </Link>
      )}

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
                  className={`flex h-14 w-14 items-center justify-center rounded-full ${PHASE_BADGE_CLASSES[fase.id]}`}
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
    </div>
  );
}
