import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { ReactNode } from "react";

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-backdrop">
      <div className="mx-auto min-h-screen max-w-[430px] bg-background px-6 py-6 shadow-soft">
        <Link to="/" className="focus-ring inline-flex items-center gap-1.5 rounded-lg text-sm font-semibold text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <div className="mt-10 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-glow">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-3xl font-bold">{title}</h1>
        <p className="mt-1 text-muted-foreground">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <p className="mt-8 rounded-xl bg-muted p-3 text-center text-xs text-muted-foreground">Demo screen — no real account is created.</p>
      </div>
    </div>
  );
}

export function AuthField({ label, error, ...props }: { label: string; error?: string | undefined } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      <input className="field" aria-invalid={!!error} {...props} />
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </label>
  );
}
