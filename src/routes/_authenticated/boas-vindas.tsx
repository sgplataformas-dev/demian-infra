import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getDashboard } from "@/lib/active.functions";
import { VturbPlayer } from "@/components/VturbPlayer";

export const Route = createFileRoute("/_authenticated/boas-vindas")({
  component: BoasVindas,
});

const VTURB_PLAYER_ID = "REPLACE_ME_VTURB_PLAYER_ID";
const VTURB_SCRIPT_SRC = "REPLACE_ME_VTURB_SCRIPT_SRC";

function BoasVindas() {
  const fetchDashboard = useServerFn(getDashboard);
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => fetchDashboard(),
  });

  useEffect(() => {
    if (document.querySelector(`script[src="${VTURB_SCRIPT_SRC}"]`)) return;
    const s = document.createElement("script");
    s.src = VTURB_SCRIPT_SRC;
    s.async = true;
    document.head.appendChild(s);
  }, []);

  const nome = (data?.nome || "").split(" ")[0];

  return (
    <div className="px-5 py-6 sm:px-6 sm:py-8">
      <h1 className="text-xl font-bold leading-tight sm:text-2xl">
        {nome ? `${nome}, seja muito bem-vindo(a)!` : "Seja muito bem-vindo(a)!"} 👋
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Assista o vídeo abaixo para responder sua avaliação!
      </p>

      <div className="mt-6 w-full overflow-hidden rounded-2xl">
        <div className="aspect-video w-full">
          <VturbPlayer vturbId={VTURB_PLAYER_ID} />
        </div>
      </div>

      <p className="mt-6 text-base text-muted-foreground">
        Estamos muito felizes em ter você por aqui. Vamos começar com uma avaliação rápida para entendermos como te ajudar melhor.
      </p>

      <Link to="/intake" className="mt-6 block">
        <Button className="h-14 w-full text-base">Iniciar Avaliação</Button>
      </Link>
    </div>
  );
}

