import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { getProgramStatus } from "@/lib/program-profile.functions";
import {
  PHASES,
  CRISIS_BONUS_ID,
  findBonusItem,
  TOTAL_DIAS_PROGRAMA,
} from "@/content/program-engine";
import { VSL_CONTENT } from "@/content/program-days";
import { captureMonitoringEvent } from "@/lib/monitoring";

export const Route = createFileRoute("/_authenticated/programa")({
  component: ProgramaPage,
});

function ProgramaPage() {
  const navigate = useNavigate();
  const fetchStatus = useServerFn(getProgramStatus);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["programa-status"],
    queryFn: () => fetchStatus(),
    retry: false,
  });

  useEffect(() => {
    if (!isError) return;
    captureMonitoringEvent(error, {
      phase: "manual",
      routeId: "/_authenticated/programa",
      route: "/programa",
      action: "carregar_status_programa",
    });
  }, [isError, error]);

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Carregando...</div>;
  }

  if (isError || !data) {
    return (
      <div className="px-5 py-7">
        <p className="text-sm text-destructive">
          Não foi possível carregar seu programa. Tente novamente em instantes.
        </p>
      </div>
    );
  }

  if (!data.temPerfil) {
    return (
      <div className="px-5 py-10 text-center">
        <Sparkles className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Seu programa de 28 dias ainda não começou</h1>
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

  if (data.programaEncerrado) {
    return (
      <div className="px-5 py-10 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-4 text-2xl font-bold">Você completou os 28 dias! 🎉</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          Continue de olho nos marcos da garantia — o resultado de 60 dias ainda está por vir.
        </p>
      </div>
    );
  }

  const { diaGeral, fase, conteudoHoje, diasDesdeInicio, proximoMarco, marcosAlcancados } = data;

  return (
    <div className="px-5 py-7">
      <header>
        <p className="text-[11px] font-bold uppercase tracking-widest text-primary">
          Fase {fase?.numero} de 4 — {fase?.nome}
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight">
          Dia {diaGeral} de {TOTAL_DIAS_PROGRAMA}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{fase?.subtitulo}</p>
      </header>

      {/* Linha de progresso das 4 fases */}
      <div className="mt-5 flex gap-1.5">
        {PHASES.map((f) => (
          <div
            key={f.id}
            className={`h-1.5 flex-1 rounded-full ${
              f.id === fase?.id ? "bg-primary" : diaGeral! > f.diaFim ? "bg-primary/40" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Conteúdo resolvido para hoje */}
      {conteudoHoje ? (
        <section className="mt-6 rounded-2xl border border-primary/20 bg-card p-5 shadow-sm">
          <h2 className="text-lg font-bold leading-tight">{conteudoHoje.titulo}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {conteudoHoje.resumo}
          </p>
          <div className="mt-4 rounded-xl bg-muted/60 p-4 text-sm">
            <p className="font-semibold text-foreground">Hoje:</p>
            <p className="mt-1 text-muted-foreground">{conteudoHoje.conteudoPrincipal}</p>
          </div>
          {conteudoHoje.trocaOuDica ? (
            <div className="mt-3 rounded-xl bg-muted/60 p-4 text-sm">
              <p className="font-semibold text-foreground">Troca do dia:</p>
              <p className="mt-1 text-muted-foreground">{conteudoHoje.trocaOuDica}</p>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Marcos da garantia */}
      <section className="mt-6">
        <h2 className="text-base font-bold">Marcos da sua jornada</h2>
        <div className="mt-3 space-y-2">
          {marcosAlcancados.map((m) => (
            <div key={m.dia} className="flex items-center gap-3 rounded-xl bg-primary/5 p-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-semibold">
                  Dia {m.dia} — {m.titulo}
                </p>
                {m.descricao ? (
                  <p className="text-xs text-muted-foreground">{m.descricao}</p>
                ) : null}
              </div>
            </div>
          ))}
          {proximoMarco ? (
            <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-3 opacity-70">
              <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">
                  Dia {proximoMarco.dia} — {proximoMarco.titulo}
                </p>
                <p className="text-xs text-muted-foreground">
                  Faltam {proximoMarco.dia - diasDesdeInicio} dias
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Botão de crise */}
      <BotaoCrise hasBonus={data.hasBonus} onClickSemBonus={() => navigate({ to: "/programa" })} />

      {/* Biblioteca de conteúdo citado na VSL */}
      <section className="mt-6">
        <h2 className="text-base font-bold">O que você vai aprender no programa</h2>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {VSL_CONTENT.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-3">
              <p className="text-sm font-semibold leading-tight">{item.titulo}</p>
              {item.resumo ? (
                <p className="mt-1 text-xs text-muted-foreground">{item.resumo}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function BotaoCrise({
  hasBonus,
  onClickSemBonus,
}: {
  hasBonus: boolean;
  onClickSemBonus: () => void;
}) {
  const bonus = findBonusItem(CRISIS_BONUS_ID);

  if (hasBonus) {
    return (
      <button
        type="button"
        className="mt-6 flex w-full items-center justify-between rounded-2xl bg-destructive/10 px-5 py-4 text-left"
      >
        <div>
          <p className="text-sm font-bold text-destructive">Estou em crise</p>
          <p className="mt-0.5 text-xs text-destructive/80">
            Abrir {bonus?.titulo ?? "o protocolo anti-crise"}
          </p>
        </div>
        <ArrowRight className="h-5 w-5 shrink-0 text-destructive" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClickSemBonus}
      className="mt-6 flex w-full items-center justify-between rounded-2xl border border-dashed border-destructive/40 px-5 py-4 text-left"
    >
      <div>
        <p className="text-sm font-bold text-destructive">Estou em crise</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Disponível com o Protocolo Anti-Crise de 24 Horas (bônus)
        </p>
      </div>
      <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </button>
  );
}
