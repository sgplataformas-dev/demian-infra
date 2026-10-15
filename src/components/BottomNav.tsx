import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Calendar, Gift, FileText, BarChart3, User } from "lucide-react";

const items = [
  { to: "/hoje", label: "Início", icon: Home },
  { to: "/programa", label: "Jornada", icon: Calendar },
  { to: "/bonus", label: "Bônus", icon: Gift },
  { to: "/materiais", label: "Materiais", icon: FileText },
  { to: "/progresso", label: "Progresso", icon: BarChart3 },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {items.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || pathname.startsWith(`${to}/`);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
                <span
                  className={`h-1 w-1 rounded-full transition-opacity ${
                    active ? "bg-gold opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
