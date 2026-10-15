import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Lock, Sparkles, ArrowRight } from "lucide-react";
import { getProgramStatus } from "@/lib/program-profile.functions";
import { MILESTONES } from "@/content/program-engine";

export const Route = createFileRoute("/_authenticated/progresso")({
  component: ProgressoPage,
});

function ProgressoPage() {
  const fetchStatus = useServerFn(getProgramStatus);
  const { data, isLoading } = useQuery({
    queryKey: ["programa-status"],
    queryFn: () => fetchStatus(),
    retry: false,
  });

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Carregando...</div>;
  }

  if (!data?.temPerfil) {
    return (
      <div className="px-5 py-10 text-center">
        <Sparkles className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Seu progresso aparece aqui</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          Comece sua jornada pra acompanhar os marcos da sua evolução.
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

  const diasDesdeInicio = data.diasDesdeInicio;

  return (
    <div className="px-5 py-7">
      <h1 className="text-3xl font-extrabold leading-tight text-foreground">Seu progresso</h1>
      <div className="mt-2 h-1 w-10 rounded-full bg-gold" />
      <p className="mt-3 text-sm text-muted-foreground">
        Dia {diasDesdeInicio} da sua jornada — acompanhe os marcos de evolução.
      </p>

      <div className="mt-6 space-y-3">
        {MILESTONES.map((m) => {
          const alcancado = m.dia <= diasDesdeInicio;
          return (
            <div
              key={m.dia}
              className={`flex items-center gap-4 rounded-2xl p-4 shadow-sm ${
                alcancado ? "bg-primary/5" : "border border-dashed border-border bg-card opacity-75"
              }`}
            >
              {alcancado ? (
                <CheckCircle2 className="h-6 w-6 shrink-0 text-primary" />
              ) : (
                <Lock className="h-6 w-6 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-tight">
                  Dia {m.dia} — {m.titulo}
                </p>
                {m.descricao ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">{m.descricao}</p>
                ) : null}
                {!alcancado && (
                  <p className="mt-0.5 text-xs font-semibold text-gold">
                    Faltam {m.dia - diasDesdeInicio}{" "}
                    {m.dia - diasDesdeInicio === 1 ? "dia" : "dias"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
