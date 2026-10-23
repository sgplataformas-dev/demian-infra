import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { getProgramStatus } from "@/lib/program-profile.functions";
import { gerarDiagnostico } from "@/lib/diagnostico";
import { PHASES } from "@/content/program-engine";
import { PHASE_ICONS } from "@/content/phase-ui";

export const Route = createFileRoute("/_authenticated/diagnostico")({
  component: Diagnostico,
});

function Diagnostico() {
  const fetchStatus = useServerFn(getProgramStatus);
  const { data, isLoading } = useQuery({
    queryKey: ["programa-status"],
    queryFn: () => fetchStatus(),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-6 text-base text-muted-foreground">Montando o seu diagnóstico...</p>
      </div>
    );
  }

  if (!data?.temPerfil) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-base text-muted-foreground">
          Ainda não encontramos sua avaliação.
        </p>
        <Link to="/programa-intake" className="mt-4 inline-block font-semibold text-primary underline">
          Responder a avaliação
        </Link>
      </div>
    );
  }

  const diag = gerarDiagnostico(data.profile);

  return (
    <div className="px-6 py-8">
      <span className="text-xs font-semibold uppercase tracking-wide text-primary">Seu diagnóstico</span>
      <h1 className="mt-2 text-2xl font-bold leading-tight">Seu Protocolo Reset, personalizado</h1>

      <div className="mt-5 space-y-4 text-base leading-relaxed text-foreground">
        <p>{diag.tomETempo}</p>
        <p>{diag.expectativa}</p>
        <p>{diag.leituraDor}</p>
        <p>{diag.planoSelar}</p>
        <p>{diag.metaFibra}</p>
        <p>{diag.horarios}</p>
        {diag.notaMenopausa && <p>{diag.notaMenopausa}</p>}
        {diag.notaEvento && <p>{diag.notaEvento}</p>}
      </div>

      {(diag.avisosRemedios.length > 0 || diag.trocasCondicoes.length > 0) && (
        <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/10 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-foreground">
            <AlertTriangle className="h-4 w-4 text-gold" />
            Avisos pra você
          </div>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-foreground">
            {diag.avisosRemedios.map((a) => (
              <li key={a}>• {a}</li>
            ))}
            {diag.trocasCondicoes.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="mt-8 text-lg font-bold">As 4 fases do protocolo</h2>
      <div className="mt-4 space-y-3">
        {PHASES.map((f) => {
          const Icon = PHASE_ICONS[f.id];
          return (
            <div key={f.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-base font-semibold leading-tight">
                  Fase {f.numero} — {f.nome}
                </p>
                <p className="text-xs text-muted-foreground">{f.subtitulo}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 rounded-xl bg-muted p-3 text-xs text-muted-foreground">
        Conteúdo educativo, não substitui consulta, diagnóstico ou tratamento médico. Não
        suspenda nem troque nenhum remédio por conta própria. Os resultados variam de pessoa
        para pessoa e não há promessa de cura.
      </p>

      <Link
        to="/hoje"
        className="mt-8 flex h-14 items-center justify-center gap-2 rounded-2xl bg-primary text-base font-bold text-primary-foreground shadow-md active:scale-[0.99]"
      >
        Começar minha jornada
        <ArrowRight className="h-5 w-5" />
      </Link>
    </div>
  );
}
