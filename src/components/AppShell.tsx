import { Link } from "@tanstack/react-router";
import { CalendarDays, Home, ListChecks, Plus, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { actions } from "@/lib/store";
import { TaskSheet, ConfirmDelete } from "./TaskSheet";

const nav = [
  { to: "/", label: "Dashboard", icon: Home },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children, fab = true }: { children: ReactNode; fab?: boolean }) {
  return (
    <div className="min-h-screen bg-backdrop">
      <div className="relative mx-auto min-h-screen max-w-[430px] bg-background pb-28 shadow-soft">
        <main className="px-5 pt-6">{children}</main>
        {fab && (
          <button
            aria-label="Add task"
            onClick={() => actions.openEditor()}
            className="focus-ring fixed bottom-24 z-30 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow transition-transform active:scale-95"
            style={{ right: "max(1.25rem, calc(50vw - 215px + 1.25rem))" }}
          >
            <Plus className="h-6 w-6" />
          </button>
        )}
        <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 border-t bg-card/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur">
          <ul className="grid grid-cols-4">
            {nav.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  activeOptions={{ exact: true }}
                  className="focus-ring flex flex-col items-center gap-1 rounded-xl py-3 text-xs font-medium text-muted-foreground"
                  activeProps={{ className: "text-primary" }}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <TaskSheet />
        <ConfirmDelete />
      </div>
    </div>
  );
}
