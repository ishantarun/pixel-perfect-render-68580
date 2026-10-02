import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthField, AuthLayout } from "@/components/AuthLayout";
import { actions } from "@/lib/store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — Daywise" },
      { name: "description", content: "Create your Daywise account and start planning calmer days." },
      { property: "og:title", content: "Create account — Daywise" },
      { property: "og:description", content: "Create your Daywise account and start planning calmer days." },
    ],
  }),
  component: SignUp,
});

const schema = z
  .object({
    name: z.string().trim().min(1, "Please tell us your name.").max(50),
    email: z.string().trim().email("Please enter a valid email.").max(255),
    password: z.string().min(8, "Use at least 8 characters.").max(100),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match.", path: ["confirm"] });

function SignUp() {
  const nav = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "" });
  const [err, setErr] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) return setErr(Object.fromEntries(r.error.issues.map((i) => [i.path[0], i.message])));
    setErr({});
    actions.setPrefs({ name: r.data.name.split(" ")[0] });
    toast.success(`Welcome, ${r.data.name}!`, { description: "Demo account created." });
    nav({ to: "/" });
  };

  return (
    <AuthLayout title="Create account" subtitle="Plan calmer, clearer days.">
      <form onSubmit={submit} className="space-y-4" noValidate>
        <AuthField label="Name" autoComplete="name" value={f.name} error={err.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Alex Morgan" />
        <AuthField label="Email" type="email" autoComplete="email" value={f.email} error={err.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="you@example.com" />
        <AuthField label="Password" type="password" autoComplete="new-password" value={f.password} error={err.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        <AuthField label="Confirm password" type="password" autoComplete="new-password" value={f.confirm} error={err.confirm} onChange={(e) => setF({ ...f, confirm: e.target.value })} />
        <button type="submit" className="focus-ring w-full rounded-2xl bg-gradient-brand py-3.5 font-semibold text-primary-foreground shadow-glow">Create account</button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account? <Link to="/signin" className="font-semibold text-primary">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
