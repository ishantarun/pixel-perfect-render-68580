import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState, TaskItem } from "@/components/TaskItem";
import { CATEGORIES, sortByDue, useStore } from "@/lib/store";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "All tasks — Daywise" },
      { name: "description", content: "Search, sort and filter every task by category, priority and status." },
      { property: "og:title", content: "All tasks — Daywise" },
      { property: "og:description", content: "Search, sort and filter every task by category, priority and status." },
    ],
  }),
  component: TasksPage,
});

const PR = { High: 0, Medium: 1, Low: 2 };

function TasksPage() {
  const { tasks } = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [pri, setPri] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("due");

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return tasks
      .filter((t) => !s || t.title.toLowerCase().includes(s) || t.notes.toLowerCase().includes(s))
      .filter((t) => cat === "All" || t.category === cat)
      .filter((t) => pri === "All" || t.priority === pri)
      .filter((t) => status === "All" || (status === "Done" ? t.done : !t.done))
      .sort((a, b) => (sort === "priority" ? PR[a.priority] - PR[b.priority] || sortByDue(a, b) : sort === "title" ? a.title.localeCompare(b.title) : sortByDue(a, b)));
  }, [tasks, q, cat, pri, status, sort]);

  return (
    <AppShell>
      <h1 className="text-2xl font-bold">Tasks</h1>
      <label className="relative mt-4 block">
        <span className="sr-only">Search tasks</span>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input className="field pl-10" placeholder="Search tasks" value={q} onChange={(e) => setQ(e.target.value)} maxLength={100} />
      </label>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Sel label="Category" value={cat} set={setCat} opts={["All", ...CATEGORIES]} />
        <Sel label="Priority" value={pri} set={setPri} opts={["All", "High", "Medium", "Low"]} />
        <Sel label="Status" value={status} set={setStatus} opts={["All", "Open", "Done"]} />
        <Sel label="Sort by" value={sort} set={setSort} opts={["due", "priority", "title"]} names={{ due: "Due date", priority: "Priority", title: "Title" }} />
      </div>
      <p className="mb-3 mt-5 text-sm text-muted-foreground">{list.length} task{list.length === 1 ? "" : "s"}</p>
      {list.length ? (
        <ul className="space-y-3">{list.map((t) => <TaskItem key={t.id} task={t} showDate />)}</ul>
      ) : (
        <EmptyState title="No tasks found" text="Try a different search or filter." />
      )}
    </AppShell>
  );
}

function Sel({ label, value, set, opts, names }: { label: string; value: string; set: (v: string) => void; opts: readonly string[]; names?: Record<string, string> }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
      <select className="field py-2 text-sm" value={value} onChange={(e) => set(e.target.value)}>
        {opts.map((o) => <option key={o} value={o}>{names?.[o] ?? o}</option>)}
      </select>
    </label>
  );
}
