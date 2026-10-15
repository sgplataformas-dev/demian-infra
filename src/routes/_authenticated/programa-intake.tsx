import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { saveProgramProfile } from "@/lib/program-profile.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/programa-intake")({
  component: ProgramaIntakePage,
});

type Respostas = {
  intestino: "preso" | "solto" | "";
  turno: "dia" | "madrugada" | "";
  sono: "bom" | "ruim" | "acorda_de_madrugada" | "";
  lactose: "tolera" | "intolerante" | "";
  remediosAfetamSono: "sim" | "nao" | "";
};

const VAZIO: Respostas = {
  intestino: "",
  turno: "",
  sono: "",
  lactose: "",
  remediosAfetamSono: "",
};

function ProgramaIntakePage() {
  const navigate = useNavigate();
  const salvar = useServerFn(saveProgramProfile);
  const [r, setR] = useState<Respostas>(VAZIO);
  const [enviando, setEnviando] = useState(false);

  const completo =
    r.intestino !== "" &&
    r.turno !== "" &&
    r.sono !== "" &&
    r.lactose !== "" &&
    r.remediosAfetamSono !== "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!completo || enviando) return;
    setEnviando(true);
    try {
      const result = await salvar({
        data: {
          intestino: r.intestino as "preso" | "solto",
          turno: r.turno as "dia" | "madrugada",
          sono: r.sono as "bom" | "ruim" | "acorda_de_madrugada",
          lactose: r.lactose as "tolera" | "intolerante",
          remediosAfetamSono: r.remediosAfetamSono === "sim",
        },
      });
      if (!result.ok) {
        toast.error("Não foi possível salvar suas respostas. Tente novamente.");
        return;
      }
      navigate({ to: "/programa" });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="px-5 py-7">
      <h1 className="text-2xl font-bold leading-tight">Vamos montar seu programa</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Suas respostas definem qual versão do protocolo de 28 dias você vai receber — cada fase se
        adapta ao seu caso.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-7">
        <Pergunta label="Hoje, como é o seu intestino na maior parte do tempo?">
          <RadioGroup
            value={r.intestino}
            onValueChange={(v) => setR({ ...r, intestino: v as Respostas["intestino"] })}
            className="space-y-3"
          >
            <Opt value="preso" label="Preso / travado" checked={r.intestino === "preso"} />
            <Opt value="solto" label="Solto / instável" checked={r.intestino === "solto"} />
          </RadioGroup>
        </Pergunta>

        <Pergunta label="Qual seu turno de maior rotina (pra ajustar a janela de jejum)?">
          <RadioGroup
            value={r.turno}
            onValueChange={(v) => setR({ ...r, turno: v as Respostas["turno"] })}
            className="space-y-3"
          >
            <Opt value="dia" label="Durante o dia" checked={r.turno === "dia"} />
            <Opt
              value="madrugada"
              label="Trabalho ou fico acordada de madrugada"
              checked={r.turno === "madrugada"}
            />
          </RadioGroup>
        </Pergunta>

        <Pergunta label="Como está seu sono ultimamente?">
          <RadioGroup
            value={r.sono}
            onValueChange={(v) => setR({ ...r, sono: v as Respostas["sono"] })}
            className="space-y-3"
          >
            <Opt value="bom" label="Bom, durmo bem" checked={r.sono === "bom"} />
            <Opt value="ruim" label="Ruim, durmo mal" checked={r.sono === "ruim"} />
            <Opt
              value="acorda_de_madrugada"
              label="Acordo de madrugada e não volto a dormir"
              checked={r.sono === "acorda_de_madrugada"}
            />
          </RadioGroup>
        </Pergunta>

        <Pergunta label="Você toma algum remédio que pode interferir no sono?">
          <RadioGroup
            value={r.remediosAfetamSono}
            onValueChange={(v) =>
              setR({ ...r, remediosAfetamSono: v as Respostas["remediosAfetamSono"] })
            }
            className="space-y-3"
          >
            <Opt value="sim" label="Sim" checked={r.remediosAfetamSono === "sim"} />
            <Opt value="nao" label="Não" checked={r.remediosAfetamSono === "nao"} />
          </RadioGroup>
        </Pergunta>

        <Pergunta label="Você tem intolerância à lactose?">
          <RadioGroup
            value={r.lactose}
            onValueChange={(v) => setR({ ...r, lactose: v as Respostas["lactose"] })}
            className="space-y-3"
          >
            <Opt
              value="tolera"
              label="Não, tomo leite e derivados normalmente"
              checked={r.lactose === "tolera"}
            />
            <Opt
              value="intolerante"
              label="Sim, sou intolerante"
              checked={r.lactose === "intolerante"}
            />
          </RadioGroup>
        </Pergunta>

        <Button type="submit" disabled={!completo || enviando} className="w-full">
          {enviando ? "Salvando..." : "Começar meu programa"}
        </Button>
      </form>
    </div>
  );
}

function Pergunta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-base font-semibold leading-snug">{label}</Label>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Opt({ value, label, checked }: { value: string; label: string; checked: boolean }) {
  return (
    <label
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
        checked ? "border-primary bg-primary/5" : "border-border"
      }`}
    >
      <RadioGroupItem value={value} />
      <span className="text-sm">{label}</span>
    </label>
  );
}
