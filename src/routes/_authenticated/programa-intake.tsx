import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { saveProgramProfile } from "@/lib/program-profile.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/programa-intake")({
  component: ProgramaIntakePage,
});

// Anamnese aprovada pelo Dr. Demian (Dr_Demian_respondido.pdf) — a ordem e
// as opcoes abaixo seguem o documento. Perguntas "Onde dói?", "O que não
// come" e "O que encontra no mercado" nao tinham lista fechada no original
// (ele deixou aberto pra ajuste); as opcoes vem direto do conteudo real do
// e-book, pra ficarem coerentes com as receitas de cada fase.
type Opcao = { value: string; label: string };

const ONDE_DOI_OPCOES: Opcao[] = [
  { value: "pescoco_ombros", label: "Pescoço e ombros" },
  { value: "lombar_quadril", label: "Lombar e quadril" },
  { value: "abdomen", label: "Abdômen" },
  { value: "bracos_pernas", label: "Braços e pernas" },
];

const REMEDIOS_OPCOES: Opcao[] = [
  { value: "pregabalina", label: "Pregabalina" },
  { value: "gabapentina", label: "Gabapentina" },
  { value: "duloxetina", label: "Duloxetina" },
  { value: "amitriptilina", label: "Amitriptilina" },
  { value: "relaxante", label: "Relaxante muscular" },
  { value: "remedio_dormir", label: "Remédio para dormir" },
  { value: "omeprazol", label: "Omeprazol (ou outro protetor gástrico)" },
  { value: "outro", label: "Outro" },
  { value: "nenhum", label: "Não tomo remédio" },
];

const CONDICOES_OPCOES: Opcao[] = [
  { value: "diabetes", label: "Diabetes" },
  { value: "pressao_alta", label: "Pressão alta" },
  { value: "gastrite", label: "Gastrite" },
  { value: "lactose", label: "Intolerância à lactose" },
  { value: "nenhuma", label: "Nenhuma" },
];

const NAO_COME_OPCOES: Opcao[] = [
  { value: "peixe", label: "Peixe" },
  { value: "ovo", label: "Ovo" },
  { value: "leite_derivados", label: "Leite e derivados" },
  { value: "carne_vermelha", label: "Carne vermelha" },
  { value: "nenhuma_restricao", label: "Como de tudo" },
];

const MERCADO_OPCOES: Opcao[] = [
  { value: "kefir", label: "Kefir" },
  { value: "chucrute", label: "Chucrute" },
  { value: "aveia", label: "Aveia" },
  { value: "biomassa_banana_verde", label: "Biomassa de banana verde" },
  { value: "banana_verde", label: "Banana verde" },
  { value: "inhame", label: "Inhame" },
  { value: "iogurte_natural", label: "Iogurte natural" },
  { value: "tudo_isso", label: "Encontro tudo isso" },
];

const EVENTO_OPCOES: Opcao[] = [
  { value: "infeccao", label: "Infecção" },
  { value: "cirurgia", label: "Cirurgia" },
  { value: "antibiotico", label: "Uso de antibiótico" },
  { value: "perda", label: "Perda (luto)" },
  { value: "estresse_intenso", label: "Estresse intenso" },
  { value: "nenhum", label: "Nenhum desses" },
];

type Respostas = {
  idade?: number;
  menopausa?: "sim" | "nao" | "nao_sei";
  tempoDor?: "menos_2" | "2_a_5" | "5_a_10" | "mais_10";
  ondeDoi?: string[];
  dorHoje?: number;
  intestino?: "preso" | "solto" | "alterna" | "estufado";
  vezesBanheiro?: "todo_dia" | "3_a_5" | "menos_3";
  sono?: "bom" | "regular" | "ruim" | "insonia";
  acordaDeMadrugada?: "sim" | "nao";
  remedios?: string[];
  remediosOutro?: string;
  condicoes?: string[];
  turno?: "dia" | "madrugada" | "nao_trabalha_fora";
  horaAcorda?: string;
  horaDorme?: string;
  naoCome?: string[];
  mercadoDisponivel?: string[];
  eventoAntesDor?: string[];
};

function validarValor(v: unknown): boolean {
  if (v === undefined || v === null || v === "") return false;
  if (typeof v === "number") return !isNaN(v);
  if (Array.isArray(v)) return v.length > 0;
  return true;
}

type PerguntaConfig = {
  key: keyof Respostas;
  label: string;
  ajuda?: string;
  input: React.ReactNode;
};

function NumInput({
  value,
  onChange,
  suffix,
  min,
  max,
  name,
}: {
  value?: number;
  onChange: (n: number) => void;
  suffix?: string;
  min?: number;
  max?: number;
  name: string;
}) {
  const [text, setText] = useState<string>(
    value !== undefined && !Number.isNaN(value) ? String(value) : "",
  );

  useEffect(() => {
    const atualNum = parseInt(text, 10);
    if (!Number.isNaN(atualNum) && atualNum === value) return;
    setText(value !== undefined && !Number.isNaN(value) ? String(value) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div className="flex items-end gap-3">
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        name={name}
        autoComplete="off"
        data-1p-ignore
        data-lpignore="true"
        value={text}
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");
          setText(raw);
          if (raw === "") {
            onChange(NaN);
            return;
          }
          let n = parseInt(raw, 10);
          if (min !== undefined) n = Math.max(min, n);
          if (max !== undefined) n = Math.min(max, n);
          onChange(n);
        }}
        className="h-14 text-2xl font-semibold"
        autoFocus
      />
      {suffix && <span className="pb-3 text-base text-muted-foreground">{suffix}</span>}
    </div>
  );
}

function Opt({ value, label, checked }: { value: string; label: string; checked: boolean }) {
  return (
    <Label
      className={
        "flex items-center gap-4 rounded-2xl p-4 cursor-pointer shadow-sm transition-all active:scale-[0.98] " +
        (checked
          ? "border-2 border-primary bg-primary-soft"
          : "border border-border bg-card hover:border-primary/30")
      }
    >
      <RadioGroupItem value={value} className="sr-only" />
      <span
        className={
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors " +
          (checked ? "bg-primary text-primary-foreground" : "border-2 border-border bg-background")
        }
      >
        {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
      </span>
      <span className={"text-[15px] " + (checked ? "font-semibold text-primary" : "font-medium text-foreground")}>
        {label}
      </span>
    </Label>
  );
}

function MultiCheck({
  opcoes,
  selected,
  onChange,
}: {
  opcoes: Opcao[];
  selected: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(item: string) {
    onChange(selected.includes(item) ? selected.filter((x) => x !== item) : [...selected, item]);
  }
  return (
    <ul className="space-y-3">
      {opcoes.map((opt) => {
        const checked = selected.includes(opt.value);
        return (
          <li key={opt.value}>
            <button
              type="button"
              onClick={() => toggle(opt.value)}
              className={`group flex w-full items-center gap-4 rounded-2xl p-4 text-left shadow-sm transition-all active:scale-[0.98] ${
                checked
                  ? "border-2 border-primary bg-primary-soft"
                  : "border border-border bg-card hover:border-primary/30"
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                  checked ? "bg-primary text-primary-foreground" : "border-2 border-border bg-background"
                }`}
              >
                {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
              </span>
              <span className={`text-[15px] leading-snug ${checked ? "font-semibold text-primary" : "font-medium text-foreground"}`}>
                {opt.label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function EscalaDor({ value, onChange }: { value?: number; onChange: (n: number) => void }) {
  return (
    <div className="grid grid-cols-6 gap-2 sm:grid-cols-11">
      {Array.from({ length: 11 }, (_, n) => n).map((n) => {
        const checked = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`flex h-12 items-center justify-center rounded-xl text-base font-bold shadow-sm transition-all active:scale-95 ${
              checked ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground"
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}

function ProgramaIntakePage() {
  const navigate = useNavigate();
  const salvar = useServerFn(saveProgramProfile);
  const [d, setD] = useState<Respostas>({});
  const [step, setStep] = useState(0);
  const [enviando, setEnviando] = useState(false);

  const perguntas: PerguntaConfig[] = [
    {
      key: "idade",
      label: "Qual a sua idade?",
      input: (
        <NumInput
          value={d.idade}
          onChange={(v) => setD({ ...d, idade: v })}
          suffix="anos"
          min={10}
          max={120}
          name="demian-intake-idade"
        />
      ),
    },
    {
      key: "menopausa",
      label: "Já entrou na menopausa?",
      input: (
        <RadioGroup value={d.menopausa ?? ""} onValueChange={(v) => setD({ ...d, menopausa: v as Respostas["menopausa"] })} className="space-y-3">
          <Opt value="sim" label="Sim" checked={d.menopausa === "sim"} />
          <Opt value="nao" label="Não" checked={d.menopausa === "nao"} />
          <Opt value="nao_sei" label="Não sei" checked={d.menopausa === "nao_sei"} />
        </RadioGroup>
      ),
    },
    {
      key: "tempoDor",
      label: "Há quanto tempo você sente dor?",
      input: (
        <RadioGroup value={d.tempoDor ?? ""} onValueChange={(v) => setD({ ...d, tempoDor: v as Respostas["tempoDor"] })} className="space-y-3">
          <Opt value="menos_2" label="Menos de 2 anos" checked={d.tempoDor === "menos_2"} />
          <Opt value="2_a_5" label="2 a 5 anos" checked={d.tempoDor === "2_a_5"} />
          <Opt value="5_a_10" label="5 a 10 anos" checked={d.tempoDor === "5_a_10"} />
          <Opt value="mais_10" label="Mais de 10 anos" checked={d.tempoDor === "mais_10"} />
        </RadioGroup>
      ),
    },
    {
      key: "ondeDoi",
      label: "Onde dói?",
      ajuda: "Pode marcar mais de uma região.",
      input: <MultiCheck opcoes={ONDE_DOI_OPCOES} selected={d.ondeDoi ?? []} onChange={(v) => setD({ ...d, ondeDoi: v })} />,
    },
    {
      key: "dorHoje",
      label: "Sua dor hoje, de 0 a 10",
      input: <EscalaDor value={d.dorHoje} onChange={(v) => setD({ ...d, dorHoje: v })} />,
    },
    {
      key: "intestino",
      label: "Como está o seu intestino na maior parte do tempo?",
      input: (
        <RadioGroup value={d.intestino ?? ""} onValueChange={(v) => setD({ ...d, intestino: v as Respostas["intestino"] })} className="space-y-3">
          <Opt value="preso" label="Preso / travado" checked={d.intestino === "preso"} />
          <Opt value="solto" label="Solto / instável" checked={d.intestino === "solto"} />
          <Opt value="alterna" label="Alterna entre preso e solto" checked={d.intestino === "alterna"} />
          <Opt value="estufado" label="Estufado / inchado" checked={d.intestino === "estufado"} />
        </RadioGroup>
      ),
    },
    {
      key: "vezesBanheiro",
      label: "Quantas vezes por semana você vai ao banheiro?",
      input: (
        <RadioGroup value={d.vezesBanheiro ?? ""} onValueChange={(v) => setD({ ...d, vezesBanheiro: v as Respostas["vezesBanheiro"] })} className="space-y-3">
          <Opt value="todo_dia" label="Todo dia" checked={d.vezesBanheiro === "todo_dia"} />
          <Opt value="3_a_5" label="3 a 5 vezes" checked={d.vezesBanheiro === "3_a_5"} />
          <Opt value="menos_3" label="Menos de 3 vezes" checked={d.vezesBanheiro === "menos_3"} />
        </RadioGroup>
      ),
    },
    {
      key: "sono",
      label: "Como está o seu sono ultimamente?",
      input: (
        <RadioGroup value={d.sono ?? ""} onValueChange={(v) => setD({ ...d, sono: v as Respostas["sono"] })} className="space-y-3">
          <Opt value="bom" label="Bom" checked={d.sono === "bom"} />
          <Opt value="regular" label="Regular" checked={d.sono === "regular"} />
          <Opt value="ruim" label="Ruim" checked={d.sono === "ruim"} />
          <Opt value="insonia" label="Insônia" checked={d.sono === "insonia"} />
        </RadioGroup>
      ),
    },
    {
      key: "acordaDeMadrugada",
      label: "Você acorda de madrugada e não consegue voltar a dormir?",
      input: (
        <RadioGroup value={d.acordaDeMadrugada ?? ""} onValueChange={(v) => setD({ ...d, acordaDeMadrugada: v as Respostas["acordaDeMadrugada"] })} className="space-y-3">
          <Opt value="sim" label="Sim" checked={d.acordaDeMadrugada === "sim"} />
          <Opt value="nao" label="Não" checked={d.acordaDeMadrugada === "nao"} />
        </RadioGroup>
      ),
    },
    {
      key: "remedios",
      label: "Você toma remédio? Quais?",
      ajuda: "Pode marcar mais de um.",
      input: <MultiCheck opcoes={REMEDIOS_OPCOES} selected={d.remedios ?? []} onChange={(v) => setD({ ...d, remedios: v })} />,
    },
    ...((d.remedios ?? []).includes("outro")
      ? [
          {
            key: "remediosOutro",
            label: "Qual(is) outro(s) remédio(s)?",
            input: (
              <Textarea
                name="demian-intake-remedios-outro"
                placeholder="Descreva o(s) remédio(s)"
                value={d.remediosOutro ?? ""}
                onChange={(e) => setD({ ...d, remediosOutro: e.target.value })}
                className="min-h-20"
                autoComplete="off"
                autoFocus
              />
            ),
          } as PerguntaConfig,
        ]
      : []),
    {
      key: "condicoes",
      label: "Você tem alguma destas condições?",
      ajuda: "Pode marcar mais de uma.",
      input: <MultiCheck opcoes={CONDICOES_OPCOES} selected={d.condicoes ?? []} onChange={(v) => setD({ ...d, condicoes: v })} />,
    },
    {
      key: "turno",
      label: "Qual o seu horário de trabalho?",
      input: (
        <RadioGroup value={d.turno ?? ""} onValueChange={(v) => setD({ ...d, turno: v as Respostas["turno"] })} className="space-y-3">
          <Opt value="dia" label="Durante o dia" checked={d.turno === "dia"} />
          <Opt value="madrugada" label="Trabalho ou fico acordada de madrugada" checked={d.turno === "madrugada"} />
          <Opt value="nao_trabalha_fora" label="Não trabalho fora" checked={d.turno === "nao_trabalha_fora"} />
        </RadioGroup>
      ),
    },
    {
      key: "horaAcorda",
      label: "Que horas você costuma acordar?",
      input: (
        <Input
          type="time"
          name="demian-intake-hora-acorda"
          autoComplete="off"
          value={d.horaAcorda ?? ""}
          onChange={(e) => setD({ ...d, horaAcorda: e.target.value })}
          className="h-14 text-xl font-semibold"
          autoFocus
        />
      ),
    },
    {
      key: "horaDorme",
      label: "Que horas você costuma dormir?",
      input: (
        <Input
          type="time"
          name="demian-intake-hora-dorme"
          autoComplete="off"
          value={d.horaDorme ?? ""}
          onChange={(e) => setD({ ...d, horaDorme: e.target.value })}
          className="h-14 text-xl font-semibold"
          autoFocus
        />
      ),
    },
    {
      key: "naoCome",
      label: "Tem algum alimento que você não come?",
      ajuda: "Pode marcar mais de um.",
      input: <MultiCheck opcoes={NAO_COME_OPCOES} selected={d.naoCome ?? []} onChange={(v) => setD({ ...d, naoCome: v })} />,
    },
    {
      key: "mercadoDisponivel",
      label: "O que você encontra no mercado da sua cidade?",
      ajuda: "Pode marcar mais de um.",
      input: <MultiCheck opcoes={MERCADO_OPCOES} selected={d.mercadoDisponivel ?? []} onChange={(v) => setD({ ...d, mercadoDisponivel: v })} />,
    },
    {
      key: "eventoAntesDor",
      label: "O que aconteceu na sua vida nos 6 a 12 meses antes de a dor começar?",
      ajuda: "Pode marcar mais de um. Pergunta que o Dr. Demian sempre faz no consultório.",
      input: <MultiCheck opcoes={EVENTO_OPCOES} selected={d.eventoAntesDor ?? []} onChange={(v) => setD({ ...d, eventoAntesDor: v })} />,
    },
  ];

  const current = perguntas[Math.min(step, perguntas.length - 1)]!;
  const canContinue = validarValor(d[current.key]);
  const ehUltima = step === perguntas.length - 1;

  async function avancar() {
    if (!ehUltima) {
      setStep(step + 1);
      return;
    }
    setEnviando(true);
    try {
      const payload = {
        idade: d.idade!,
        menopausa: d.menopausa!,
        tempoDor: d.tempoDor!,
        ondeDoi: d.ondeDoi ?? [],
        dorHoje: d.dorHoje!,
        intestino: d.intestino!,
        vezesBanheiro: d.vezesBanheiro!,
        sono: d.sono!,
        acordaDeMadrugada: d.acordaDeMadrugada === "sim",
        remedios: (d.remedios ?? []).filter((r) => r !== "nenhum"),
        remediosOutro: (d.remedios ?? []).includes("outro") ? (d.remediosOutro?.trim() || null) : null,
        condicoes: (d.condicoes ?? []).filter((c) => c !== "nenhuma"),
        turno: d.turno!,
        horaAcorda: d.horaAcorda!,
        horaDorme: d.horaDorme!,
        naoCome: (d.naoCome ?? []).filter((c) => c !== "nenhuma_restricao"),
        mercadoDisponivel: (d.mercadoDisponivel ?? []).filter((c) => c !== "tudo_isso"),
        eventoAntesDor: (d.eventoAntesDor ?? []).filter((c) => c !== "nenhum"),
      };
      const result = await salvar({ data: payload });
      if (!result.ok) {
        toast.error("Não foi possível salvar suas respostas. Tente novamente.");
        return;
      }
      navigate({ to: "/diagnostico" });
    } finally {
      setEnviando(false);
    }
  }

  function voltar() {
    if (step > 0) setStep(step - 1);
  }

  const progresso = Math.round(((step + 1) / perguntas.length) * 100);

  return (
    <div className="px-6 pt-6 pb-40">
      <div className="mb-8">
        <div className="mb-2 flex items-end justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Pergunta {step + 1} de {perguntas.length}
          </span>
          <span className="text-[10px] font-bold text-primary">{progresso}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${progresso}%` }} />
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold leading-tight text-foreground">{current.label}</h1>
        {current.ajuda && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{current.ajuda}</p>}
      </div>

      <div>{current.input}</div>

      <div className="fixed inset-x-0 bottom-16 z-40 mx-auto max-w-md bg-gradient-to-t from-background via-background to-transparent px-4 pb-4 pt-10">
        <div className="flex gap-3">
          {step > 0 && (
            <Button variant="outline" className="h-14 flex-1 rounded-2xl" onClick={voltar}>
              Voltar
            </Button>
          )}
          <Button
            className="h-14 flex-1 rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
            disabled={!canContinue || enviando}
            onClick={avancar}
          >
            <span>{ehUltima ? (enviando ? "Salvando..." : "Concluir avaliação") : "Continuar"}</span>
            {!enviando && <ArrowRight className="ml-2 h-5 w-5 opacity-60" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
