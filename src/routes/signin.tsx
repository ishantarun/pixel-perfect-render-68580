import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthField, AuthLayout } from "@/components/AuthLayout";

export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Daywise" },
      { name: "description", content: "Sign in to Daywise to pick up where you left off." },
      { property: "og:title", content: "Sign in — Daywise" },
      { property: "og:description", content: "Sign in to Daywise to pick up where you left off." },
    ],
  }),
  component: SignIn,
});

const schema = z.object({
  email: z.string().trim().email("Please enter a valid email.").max(255),
  password: z.string().min(6, "Password needs at least 6 characters.").max(100),
});

function SignIn() {
  const nav = useNavigate();
  const [f, setF] = useState({ email: "", password: "", remember: true });
  const [err, setErr] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) return setErr(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
    setErr({});
    toast.success("Welcome back!", { description: "Demo sign-in — taking you to your dashboard." });
    nav({ to: "/" });
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to see your day.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <AuthField label="Email" type="email" autoComplete="email" value={f.email} error={err.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" />
        <AuthField label="Password" type="password" autoComplete="current-password" value={f.password} error={err.password} onChange={(e) => setF({ ...f, password: e.target.value })} placeholder="••••••••" />
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 accent-primary" checked={f.remember} onChange={(e) => setF({ ...f, remember: e.target.checked })} />
            Remember me
          </label>
          <button type="button" onClick={() => toast("Password reset", { description: "In the real app we'd email you a reset link." })} className="font-semibold text-primary">
            Forgot password?
          </button>
        </div>
        <button type="submit" className="focus-ring w-full rounded-2xl bg-gradient-brand py-3.5 font-semibold text-primary-foreground shadow-glow">Sign in</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Daywise? <Link to="/signup" className="font-semibold text-primary">Create an account</Link>
      </p>
    </AuthLayout>
  );
}
