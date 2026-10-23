import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  diaGeralDesdeInicio,
  nextMilestone,
  reachedMilestones,
  phaseForDay,
  type ProgramProfile,
} from "@/content/program-engine";
import { resolveDayContent, type DayContent } from "@/content/program-days";

// Anamnese real aprovada pelo Dr. Demian (Dr_Demian_respondido.pdf) — bem
// mais rica que o perfil de ramificacao original. `condicoes` incluir
// "lactose" e quem deriva `lactose: "intolerante"` na gravacao; nao e
// perguntado separado.
const profileInputSchema = z.object({
  idade: z.number().int().min(10).max(120),
  menopausa: z.enum(["sim", "nao", "nao_sei"]),
  tempoDor: z.enum(["menos_2", "2_a_5", "5_a_10", "mais_10"]),
  ondeDoi: z.array(z.string()).min(1),
  dorHoje: z.number().int().min(0).max(10),
  intestino: z.enum(["preso", "solto", "alterna", "estufado"]),
  vezesBanheiro: z.enum(["todo_dia", "3_a_5", "menos_3"]),
  sono: z.enum(["bom", "regular", "ruim", "insonia"]),
  acordaDeMadrugada: z.boolean(),
  remedios: z.array(z.string()),
  remediosOutro: z.string().max(200).nullable().optional(),
  condicoes: z.array(z.string()),
  turno: z.enum(["dia", "madrugada", "nao_trabalha_fora"]),
  horaAcorda: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
  horaDorme: z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido"),
  naoCome: z.array(z.string()),
  mercadoDisponivel: z.array(z.string()),
  eventoAntesDor: z.array(z.string()),
});

type ProfileRow = {
  idade: number | null;
  menopausa: ProgramProfile["menopausa"] | null;
  tempo_dor: ProgramProfile["tempoDor"] | null;
  onde_doi: string[];
  dor_hoje: number | null;
  intestino: ProgramProfile["intestino"];
  vezes_banheiro: ProgramProfile["vezesBanheiro"] | null;
  sono: ProgramProfile["sono"];
  acorda_de_madrugada: boolean;
  remedios: string[];
  remedios_outro: string | null;
  condicoes: string[];
  lactose: ProgramProfile["lactose"];
  turno: ProgramProfile["turno"];
  hora_acorda: string | null;
  hora_dorme: string | null;
  nao_come: string[];
  mercado_disponivel: string[];
  evento_antes_dor: string[];
  has_bonus: boolean;
  started_at: string;
  last_seen_dia_geral: number | null;
};

function rowToProfile(row: ProfileRow): ProgramProfile {
  return {
    idade: row.idade ?? 0,
    menopausa: row.menopausa ?? "nao_sei",
    tempoDor: row.tempo_dor ?? "menos_2",
    ondeDoi: row.onde_doi,
    dorHoje: row.dor_hoje ?? 0,
    intestino: row.intestino,
    vezesBanheiro: row.vezes_banheiro ?? "todo_dia",
    sono: row.sono,
    acordaDeMadrugada: row.acorda_de_madrugada,
    remedios: row.remedios,
    remediosOutro: row.remedios_outro,
    condicoes: row.condicoes,
    lactose: row.lactose,
    turno: row.turno,
    horaAcorda: row.hora_acorda ?? "07:00",
    horaDorme: row.hora_dorme ?? "22:00",
    naoCome: row.nao_come,
    mercadoDisponivel: row.mercado_disponivel,
    eventoAntesDor: row.evento_antes_dor,
  };
}

const PROFILE_COLUMNS =
  "idade, menopausa, tempo_dor, onde_doi, dor_hoje, intestino, vezes_banheiro, sono, acorda_de_madrugada, remedios, remedios_outro, condicoes, lactose, turno, hora_acorda, hora_dorme, nao_come, mercado_disponivel, evento_antes_dor, has_bonus, started_at, last_seen_dia_geral" as const;

export type ProgramStatus =
  | { temPerfil: false }
  | {
      temPerfil: true;
      profile: ProgramProfile;
      hasBonus: boolean;
      programaEncerrado: boolean;
      diaGeral: number | null;
      fase: ReturnType<typeof phaseForDay> | null;
      conteudoHoje: DayContent | null;
      diasDesdeInicio: number;
      proximoMarco: ReturnType<typeof nextMilestone>;
      marcosAlcancados: ReturnType<typeof reachedMilestones>;
      /** Quantos dias ela pulou desde a ultima vez que abriu o app (0 = nenhum, sem culpa, so retomar hoje). */
      diasPulados: number;
    };

/** Status completo do programa pra usuaria logada: perfil, dia/fase atual, conteudo de hoje e marcos. */
export const getProgramStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ProgramStatus> => {
    const { supabase, userId } = context;

    const { data: row, error } = await supabase
      .from("demian_profiles")
      .select(PROFILE_COLUMNS)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("[program-profile] getProgramStatus select error", error);
      throw new Error("Nao foi possivel carregar o status do programa.");
    }

    if (!row) {
      return { temPerfil: false };
    }

    const profile = rowToProfile(row as ProfileRow);
    const startedAt = new Date((row as ProfileRow).started_at);
    const diaGeral = diaGeralDesdeInicio(startedAt);
    const diasDesdeInicio = Math.max(
      0,
      Math.floor((Date.now() - startedAt.getTime()) / 86_400_000),
    );

    // Dia do programa ja e por calendario (nunca "zera" sozinho) — so falta
    // avisar com acolhimento quando ela pulou dias desde a ultima visita, em
    // vez de ficar em silencio. `lastSeen` nulo (primeira visita) nunca conta
    // como dia pulado.
    const lastSeen = (row as ProfileRow).last_seen_dia_geral;
    const diasPulados =
      diaGeral !== null && lastSeen !== null ? Math.max(0, diaGeral - lastSeen - 1) : 0;

    if (diaGeral !== null && diaGeral !== lastSeen) {
      const { error: updateErr } = await supabase
        .from("demian_profiles")
        .update({ last_seen_dia_geral: diaGeral })
        .eq("user_id", userId);
      if (updateErr) {
        console.error("[program-profile] falha ao atualizar last_seen_dia_geral", updateErr);
      }
    }

    return {
      temPerfil: true,
      profile,
      hasBonus: (row as ProfileRow).has_bonus,
      programaEncerrado: diaGeral === null,
      diaGeral,
      fase: diaGeral ? phaseForDay(diaGeral) : null,
      conteudoHoje: diaGeral ? resolveDayContent(diaGeral, profile) : null,
      diasDesdeInicio,
      proximoMarco: nextMilestone(diasDesdeInicio),
      marcosAlcancados: reachedMilestones(diasDesdeInicio),
      diasPulados,
    };
  });

/**
 * Salva as respostas da anamnese. Na primeira vez, cria o perfil e marca
 * `started_at = now()` (comeca a contar o dia 1). Em chamadas seguintes
 * (ex.: usuaria refaz a avaliacao), atualiza so as respostas — nunca
 * reinicia a contagem de dias.
 */
export const saveProgramProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => profileInputSchema.parse(data))
  .handler(async ({ context, data }) => {
    const { supabase, userId } = context;

    const { data: existing, error: existingErr } = await supabase
      .from("demian_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    if (existingErr) {
      console.error("[program-profile] saveProgramProfile select error", existingErr);
      return { ok: false as const };
    }

    const payload = {
      idade: data.idade,
      menopausa: data.menopausa,
      tempo_dor: data.tempoDor,
      onde_doi: data.ondeDoi,
      dor_hoje: data.dorHoje,
      intestino: data.intestino,
      vezes_banheiro: data.vezesBanheiro,
      sono: data.sono,
      acorda_de_madrugada: data.acordaDeMadrugada,
      remedios: data.remedios,
      remedios_outro: data.remediosOutro ?? null,
      condicoes: data.condicoes,
      // Nao e perguntado separado — deriva de "condicoes" incluir "lactose".
      lactose: data.condicoes.includes("lactose") ? "intolerante" : "tolera",
      turno: data.turno,
      hora_acorda: data.horaAcorda,
      hora_dorme: data.horaDorme,
      nao_come: data.naoCome,
      mercado_disponivel: data.mercadoDisponivel,
      evento_antes_dor: data.eventoAntesDor,
      updated_at: new Date().toISOString(),
    };

    const { error: writeErr } = existing
      ? await supabase.from("demian_profiles").update(payload).eq("user_id", userId)
      : await supabase.from("demian_profiles").insert({
          user_id: userId,
          ...payload,
          started_at: new Date().toISOString(),
        });

    if (writeErr) {
      console.error("[program-profile] saveProgramProfile write error", writeErr);
      return { ok: false as const };
    }

    return { ok: true as const };
  });
