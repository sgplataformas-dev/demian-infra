import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/termos")({
  head: () => ({
    meta: [
      { title: "Termos de Uso e Privacidade — Placeholder" },
      {
        name: "description",
        content: "Termos de uso e política de privacidade — conteúdo de exemplo, a ser redigido para o cliente.",
      },
    ],
  }),
  component: TermosPage,
});

function TermosPage() {
  return (
    <div className="mx-auto min-h-screen max-w-md bg-background px-6 py-8">
      <Link
        to="/perfil"
        className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Voltar
      </Link>

      <h1 className="mt-4 text-2xl font-extrabold leading-tight">
        Termos de Uso e Privacidade
      </h1>
      <p className="mt-1 text-xs text-muted-foreground">
        Última atualização: REPLACE_ME_DATE
      </p>

      <article className="prose prose-sm mt-6 max-w-none text-sm leading-relaxed text-foreground">
        <p className="mt-2 text-muted-foreground">
          PLACEHOLDER: estes termos de uso e política de privacidade ainda não
          foram redigidos para este cliente. Substitua este texto pelo
          conteúdo jurídico real (sobre o produto, coleta e uso de dados,
          direitos do usuário conforme a LGPD, contato de suporte etc.) antes
          de publicar o aplicativo.
        </p>
      </article>

      <div className="mt-10" />
    </div>
  );
}
