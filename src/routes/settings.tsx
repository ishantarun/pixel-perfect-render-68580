import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, ChevronRight, LogIn, Mail, Newspaper } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { actions, useStore, type Prefs } from "@/lib/store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Daywise" },
      { name: "description", content: "Choose how and when Daywise reminds you." },
      { property: "og:title", content: "Settings — Daywise" },
      { property: "og:description", content: "Choose how and when Daywise reminds you." },
    ],
  }),
  component: SettingsPage,
});

const TIMINGS: Prefs["timing"][] = ["At due time", "10 minutes before", "1 hour before"];

function SettingsPage() {
  const { prefs } = useStore();
  const rows = [
    { key: "email", label: "Email reminders", icon: Mail },
    { key: "inApp", label: "In-app reminders", icon: Bell },
    { key: "summary", label: "Daily summary", icon: Newspaper },
  ] as const;

  return (
    <AppShell fab={false}>
      <h1 className="text-2xl font-bold">Settings</h1>

      <Link to="/signin" className="focus-ring mt-4 flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground"><LogIn className="h-5 w-5" /></span>
        <span className="flex-1"><span className="block font-semibold">Account</span><span className="text-sm text-muted-foreground">Sign in or create an account</span></span>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </Link>

      <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Notifications</h2>
      <ul className="divide-y rounded-2xl border bg-card shadow-card">
        {rows.map(({ key, label, icon: Icon }) => {
          const on = prefs[key];
          return (
            <li key={key} className="flex items-center gap-3 p-4">
              <Icon className="h-5 w-5 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <p className="font-medium">{label}</p>
                <p className={on ? "text-xs font-semibold text-success" : "text-xs text-muted-foreground"}>{on ? "On" : "Off"}</p>
              </div>
              <button role="switch" aria-checked={on} aria-label={label} onClick={() => actions.setPrefs({ [key]: !on })} className="switch">
                <span />
              </button>
            </li>
          );
        })}
      </ul>

      <h2 className="mb-2 mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Remind me</h2>
      <div role="radiogroup" aria-label="Reminder timing" className="space-y-2">
        {TIMINGS.map((t) => (
          <button key={t} role="radio" aria-checked={prefs.timing === t} onClick={() => actions.setPrefs({ timing: t })} className="radio-row">
            <span className="dot" />{t}
          </button>
        ))}
      </div>

      <button
        onClick={() =>
          prefs.inApp
            ? toast("⏰ Team stand-up", { description: `Reminder · ${prefs.timing}. This is a sample notification.` })
            : toast.warning("In-app reminders are off", { description: "Turn them on to preview notifications." })
        }
        className="focus-ring mt-6 w-full rounded-2xl bg-gradient-brand py-3.5 font-semibold text-primary-foreground shadow-glow"
      >
        Test notification
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">Demo only — no real emails or push notifications are sent.</p>
    </AppShell>
  );
}
