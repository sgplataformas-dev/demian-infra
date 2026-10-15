import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { getPerfil, atualizarPeso, salvarAvatar, atualizarPerfil } from "@/lib/active.functions";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, MessageCircle, FileText, RotateCcw, Camera, Loader2, Pencil, ChevronRight, TrendingUp, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { BlobDecoration } from "@/components/BlobDecoration";

export const Route = createFileRoute("/_authenticated/perfil")({
  component: Perfil,
});

// Resize + compress image client-side to keep avatars small and fast to load.
async function compressImage(file: File, maxSize = 384, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * ratio);
  const h = Math.round(bitmap.height * ratio);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(bitmap, 0, 0, w, h);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("compress fail"))),
      "image/webp",
      quality,
    );
  });
}

function Perfil() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchPerfil = useServerFn(getPerfil);
  const fetchAtualizar = useServerFn(atualizarPeso);
  const fetchSalvarAvatar = useServerFn(salvarAvatar);
  const fetchAtualizarPerfil = useServerFn(atualizarPerfil);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [editando, setEditando] = useState(false);
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["perfil"],
    queryFn: () => fetchPerfil(),
  });

  useEffect(() => {
    if (data) {
      setNome(data.nome ?? "");
      setBio(data.bio ?? "");
    }
  }, [data]);

  const [peso, setPeso] = useState("");
  const salvarPeso = useMutation({
    mutationFn: (p: number) => fetchAtualizar({ data: { peso: p } }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["perfil"] });
      setPeso("");
      toast.success("Peso atualizado!");
    },
  });

  const salvarInfo = useMutation({
    mutationFn: (input: { nome: string; bio: string }) => fetchAtualizarPerfil({ data: input }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["perfil"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      setEditando(false);
      toast.success("Perfil atualizado!");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Não consegui salvar.";
      toast.error(msg);
    },
  });


  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("Sessão expirada");
      const blob = await compressImage(file);
      const path = `${auth.user.id}/avatar.webp`;
      const up = await supabase.storage
        .from("avatars")
        .upload(path, blob, { upsert: true, contentType: "image/webp", cacheControl: "3600" });
      if (up.error) throw up.error;
      await fetchSalvarAvatar({ data: { path } });
      await Promise.all([
        qc.refetchQueries({ queryKey: ["perfil"] }),
        qc.refetchQueries({ queryKey: ["dashboard"] }),
      ]);
      toast.success("Foto atualizada!");
    } catch (err) {
      console.error(err);
      toast.error("Não consegui enviar a foto.");
    } finally {
      setUploading(false);
    }
  }

  async function sair() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (isLoading || !data) return <div className="p-6 text-muted-foreground">Carregando...</div>;

  const chartData = data.pesos.map((p, i) => ({ idx: i + 1, data: p.data, peso: p.peso }));

  return (
    <div className="relative px-6 py-7">
      <BlobDecoration className="pointer-events-none absolute right-0 top-0 h-32 w-48" />

      <div className="relative flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-primary/10 text-2xl font-bold text-primary"
          aria-label="Trocar foto de perfil"
        >
          {data.avatarUrl ? (
            <img
              src={data.avatarUrl}
              alt={data.nome || "Foto de perfil"}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              <UserIcon className="h-9 w-9" />
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            </span>
          )}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-sm">
            <Camera className="h-3.5 w-3.5" />
          </span>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-lg font-bold">{data.nome || "Seu perfil"}</p>
          <p className="truncate text-xs text-muted-foreground">{data.email}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary disabled:opacity-50"
            >
              <Camera className="h-3 w-3" /> {data.avatarUrl ? "Trocar foto" : "Adicionar foto"}
            </button>
            {!editando && (
              <button
                type="button"
                onClick={() => setEditando(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
              >
                <Pencil className="h-3 w-3" /> Editar perfil
              </button>
            )}
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />
      </div>

      {data.bio && !editando && (
        <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">{data.bio}</p>
      )}

      {editando && (
        <section className="mt-5 space-y-4 rounded-2xl border border-border bg-card p-5">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={nome}
              maxLength={80}
              onChange={(e) => setNome(e.target.value)}
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={bio}
              maxLength={280}
              rows={4}
              placeholder="Conte um pouco sobre você, sua jornada ou seus objetivos."
              onChange={(e) => setBio(e.target.value)}
            />
            <p className="text-right text-[11px] text-muted-foreground">{bio.length}/280</p>
          </div>
          <div className="flex gap-2">
            <Button
              className="h-12 flex-1"
              disabled={!nome.trim() || salvarInfo.isPending}
              onClick={() => salvarInfo.mutate({ nome: nome.trim(), bio: bio.trim() })}
            >
              {salvarInfo.isPending ? "Salvando..." : "Salvar"}
            </Button>
            <Button
              variant="outline"
              className="h-12"
              disabled={salvarInfo.isPending}
              onClick={() => {
                setNome(data.nome ?? "");
                setBio(data.bio ?? "");
                setEditando(false);
              }}
            >
              Cancelar
            </Button>
          </div>
        </section>
      )}


      <section className="relative mt-7 rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold leading-tight">Sua evolução</h2>
            <p className="text-xs text-muted-foreground">Acompanhe seus registros.</p>
          </div>
        </div>
        {chartData.length === 0 ? (
          <p className="mt-2 text-sm text-muted-foreground">Nenhum peso registrado ainda.</p>
        ) : (
          <div className="mt-4 h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="idx" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
                <Tooltip />
                <Line type="monotone" dataKey="peso" stroke="#183451" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4 space-y-2">
          <Label htmlFor="peso">Atualizar meu peso (kg)</Label>
          <div className="flex gap-2">
            <Input
              id="peso"
              type="number"
              step="0.1"
              inputMode="decimal"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              className="h-12"
            />
            <Button
              variant="gold"
              className="h-12"
              disabled={!peso || salvarPeso.isPending}
              onClick={() => salvarPeso.mutate(parseFloat(peso))}
            >
              Salvar
            </Button>
          </div>
        </div>
      </section>

      <nav className="mt-7 space-y-3">
        <MenuItem icon={RotateCcw} label="Refazer avaliação" onClick={() => navigate({ to: "/programa-intake" })} />
        <MenuItem
          icon={MessageCircle}
          label="Suporte no WhatsApp"
          href="https://wa.me/REPLACE_ME_SUPPORT_PHONE?text=Olá!%20Vim%20pelo%20aplicativo%20e%20tenho%20uma%20dúvida."
        />
        <MenuItem icon={FileText} label="Termos de Uso e Privacidade" onClick={() => navigate({ to: "/termos" })} />
        <MenuItem icon={LogOut} label="Sair" onClick={sair} variant="destructive" />
      </nav>
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  href,
  variant,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
  href?: string;
  variant?: "destructive";
}) {
  const className = `flex w-full items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 text-left text-base shadow-sm transition active:scale-[0.99] ${
    variant === "destructive" ? "text-destructive" : "text-foreground"
  }`;
  const badgeClassName = `flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
    variant === "destructive" ? "bg-destructive/10" : "bg-primary/10"
  }`;

  const content = (
    <>
      <span className={badgeClassName}>
        <Icon className="h-4.5 w-4.5" />
      </span>
      <span className="flex-1 font-medium">{label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {content}
    </button>
  );
}
