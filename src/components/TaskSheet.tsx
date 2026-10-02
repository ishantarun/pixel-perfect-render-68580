import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { actions, CATEGORIES, todayStr, useStore, type Task } from "@/lib/store";

const blank = (): Task => ({
  id: "", title: "", notes: "", date: todayStr(), time: "12:00",
  priority: "Medium", category: "Personal", repeat: "None", done: false,
});

export function TaskSheet() {
  const { editor } = useStore();
  const [t, setT] = useState<Task>(blank());
  const [err, setErr] = useState("");

  useEffect(() => {
    if (editor.open) {
      setT(editor.task ?? blank());
      setErr("");
    }
  }, [editor.open, editor.task]);

  if (!editor.open) return null;
  const up = (p: Partial<Task>) => setT((s) => ({ ...s, ...p }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = t.title.trim();
    if (!title) return setErr("Give your task a title.");
    if (title.length > 100) return setErr("Keep the title under 100 characters.");
    actions.save({ ...t, title, notes: t.notes.slice(0, 500), id: t.id || crypto.randomUUID() });
    toast.success(editor.task ? "Task updated" : "Task added");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-overlay" onClick={actions.closeEditor}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="animate-in slide-in-from-bottom max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-t-3xl bg-card p-5 pb-8 shadow-soft"
        aria-label={editor.task ? "Edit task" : "New task"}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{editor.task ? "Edit task" : "New task"}</h2>
          <button type="button" aria-label="Close" onClick={actions.closeEditor} className="focus-ring rounded-lg p-2 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <Field label="Title">
            <input autoFocus className="field" value={t.title} maxLength={100} onChange={(e) => up({ title: e.target.value })} placeholder="What needs doing?" />
            {err && <p className="mt-1 text-sm text-destructive">{err}</p>}
          </Field>
          <Field label="Notes">
            <textarea className="field min-h-20" value={t.notes} maxLength={500} onChange={(e) => up({ notes: e.target.value })} placeholder="Optional details" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Due date"><input type="date" className="field" value={t.date} onChange={(e) => up({ date: e.target.value })} required /></Field>
            <Field label="Due time"><input type="time" className="field" value={t.time} onChange={(e) => up({ time: e.target.value })} required /></Field>
          </div>
          <Field label="Priority">
            <div className="grid grid-cols-3 gap-2">
              {(["Low", "Medium", "High"] as const).map((p) => (
                <button type="button" key={p} aria-pressed={t.priority === p} onClick={() => up({ priority: p })} className="seg">{p}</button>
              ))}
            </div>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category">
              <select className="field" value={t.category} onChange={(e) => up({ category: e.target.value as Task["category"] })}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Repeat">
              <select className="field" value={t.repeat} onChange={(e) => up({ repeat: e.target.value as Task["repeat"] })}>
                {["None", "Daily", "Weekly", "Monthly"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <button type="submit" className="focus-ring w-full rounded-2xl bg-gradient-brand py-3.5 font-semibold text-primary-foreground shadow-glow">
            {editor.task ? "Save changes" : "Add task"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

export function ConfirmDelete() {
  const { confirmId, tasks } = useStore();
  if (!confirmId) return null;
  const task = tasks.find((t) => t.id === confirmId);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-overlay p-6" role="alertdialog" aria-modal="true" aria-labelledby="del-title">
      <div className="w-full max-w-sm rounded-3xl bg-card p-6 shadow-soft">
        <h2 id="del-title" className="text-lg font-bold">Delete task?</h2>
        <p className="mt-1 text-sm text-muted-foreground">“{task?.title}” will be removed. This can’t be undone.</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button autoFocus onClick={() => actions.askDelete(null)} className="focus-ring rounded-xl border py-2.5 font-semibold">Cancel</button>
          <button
            onClick={() => { actions.remove(confirmId); toast("Task deleted"); }}
            className="focus-ring rounded-xl bg-destructive py-2.5 font-semibold text-destructive-foreground"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
