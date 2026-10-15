import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { VSL_CONTENT } from "@/content/program-days";

export const Route = createFileRoute("/_authenticated/materiais")({
  component: MateriaisPage,
});

function MateriaisPage() {
  return (
    <div className="px-5 py-7">
      <h1 className="text-3xl font-extrabold leading-tight text-foreground">Materiais</h1>
      <div className="mt-2 h-1 w-10 rounded-full bg-gold" />
      <p className="mt-3 text-sm text-muted-foreground">
        Guias rápidos e respostas pra dúvidas comuns da sua jornada.
      </p>

      <div className="mt-5 space-y-3">
        {VSL_CONTENT.map((item) => (
          <button
            key={item.id}
            type="button"
            className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition active:scale-[0.99]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold leading-tight">{item.titulo}</p>
              {item.resumo ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{item.resumo}</p>
              ) : null}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
