import { Leaf, Dumbbell, Moon } from "lucide-react";
import { GutIcon } from "@/components/icons/GutIcon";
import type { PhaseId } from "@/content/program-engine";

export const PHASE_ICONS: Record<PhaseId, React.ComponentType<{ className?: string }>> = {
  selar: Leaf,
  desarmar: Dumbbell,
  limpar: Moon,
  repovoar: GutIcon,
};

// Alterna azul-marinho/laranja pra dar variedade visual entre as 4 fases.
export const PHASE_BADGE_CLASSES: Record<PhaseId, string> = {
  selar: "bg-gold/15 text-gold",
  desarmar: "bg-primary/10 text-primary",
  limpar: "bg-gold/15 text-gold",
  repovoar: "bg-primary/10 text-primary",
};
