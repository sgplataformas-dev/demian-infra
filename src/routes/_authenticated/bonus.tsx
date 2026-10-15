import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Gift, ChevronRight, Lock, Zap } from "lucide-react";
import { getProgramStatus } from "@/lib/program-profile.functions";
import { BONUS_ITEMS, CRISIS_BONUS_ID } from "@/content/program-engine";

export const Route = createFileRoute("/_authenticated/bonus")({
  component: BonusPage,
});

function BonusPage() {
  const navigate = useNavigate();
  const fetchStatus = useServerFn(getProgramStatus);
  const { data, isLoading } = useQuery({
    queryKey: ["programa-status"],
    queryFn: () => fetchStatus(),
    retry: false,
  });

  const hasBonus = !isLoading && data?.temPerfil === true && data.hasBonus;

  return (
    <div className="px-5 py-7">
      <h1 className="text-3xl font-extrabold leading-tight text-foreground">
        Seus bônus especiais
      </h1>
      <div className="mt-2 h-1 w-10 rounded-full bg-gold" />
      <p className="mt-3 text-sm text-muted-foreground">
        Materiais extras para apoiar sua jornada.
      </p>

      <section className="mt-6 rounded-3xl border border-gold/40 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold">
          <Gift className="h-4 w-4" /> Presentes do Protocolo Reset
        </div>
        <h2 className="mt-2 text-xl font-extrabold leading-tight">Seus 6 presentes</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {hasBonus
            ? "Acesse os materiais extras incluídos na sua compra."
            : "Esses materiais fazem parte do pacote com bônus."}
        </p>

        <div className="mt-5 space-y-3">
          {BONUS_ITEMS.map((item) => {
            const isCrisis = item.id === CRISIS_BONUS_ID;
            return (
              <button
                key={item.id}
                type="button"
                disabled={!hasBonus}
                className="flex w-full items-center gap-4 rounded-2xl bg-muted/50 p-4 text-left transition active:scale-[0.99] disabled:opacity-60"
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                    isCrisis ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                  }`}
                >
                  {isCrisis ? <Zap className="h-5 w-5" /> : <Gift className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-tight">{item.titulo}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.descricao}</p>
                </div>
                {hasBonus ? (
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                ) : (
                  <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {!hasBonus && (
        <button
          type="button"
          onClick={() => navigate({ to: "/perfil" })}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gold px-5 py-3 text-sm font-bold text-gold-foreground"
        >
          Quero liberar meus bônus
        </button>
      )}
    </div>
  );
}
