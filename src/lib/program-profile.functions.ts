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

const profileInputSchema = z.object({
  intestino: z.enum(["preso", "solto"]),
  turno: z.enum(["dia", "madrugada"]),
  sono: z.enum(["bom", "ruim", "acorda_de_madrugada"]),
  lactose: z.enum(["tolera", "intolerante"]),
  remediosAfetamSono: z.boolean(),
});

type ProfileRow = {
  intestino: ProgramProfile["intestino"];
  turno: ProgramProfile["turno"];
  sono: ProgramProfile["sono"];
  lactose: ProgramProfile["lactose"];
  remedios_afetam_sono: boolean;
  has_bonus: boolean;
  started_at: string;
  last_seen_dia_geral: number | null;
};

function rowToProfile(row: ProfileRow): ProgramProfile {
  return {
    intestino: row.intestino,
    turno: row.turno,
    sono: row.sono,
    lactose: row.lactose,
    remediosAfetamSono: row.remedios_afetam_sono,
  };
}

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
      .select(
        "intestino, turno, sono, lactose, remedios_afetam_sono, has_bonus, started_at, last_seen_dia_geral",
      )
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
 * Salva as respostas de ramificacao da usuaria. Na primeira vez, cria o
 * perfil e marca `started_at = now()` (comeca a contar o dia 1). Em
 * chamadas seguintes (ex.: usuaria corrige uma resposta), atualiza so as
 * respostas — nunca reinicia a contagem de dias.
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
      intestino: data.intestino,
      turno: data.turno,
      sono: data.sono,
      lactose: data.lactose,
      remedios_afetam_sono: data.remediosAfetamSono,
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
