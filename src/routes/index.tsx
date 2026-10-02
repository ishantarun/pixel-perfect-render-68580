import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";
import { UserCircle2 } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState, TaskItem } from "@/components/TaskItem";
import { sortByDue, todayStr, useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daywise — Your day at a glance" },
      { name: "description", content: "A calm, friendly to-do dashboard to plan your day and track progress." },
      { property: "og:title", content: "Daywise — Your day at a glance" },
      { property: "og:description", content: "A calm, friendly to-do dashboard to plan your day and track progress." },
    ],
  }),
  component: Dashboard,
});

const FILTERS = ["All", "Today", "Upcoming", "Completed"] as const;

function Dashboard() {
  const { tasks, prefs } = useStore();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Today");
  const today = todayStr();
  const todays = tasks.filter((t) => t.date === today);
  const done = todays.filter((t) => t.done).length;
  const pct = todays.length ? Math.round((done / todays.length) * 100) : 0;
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const list = tasks
    .filter((t) =>
      filter === "All" ? true : filter === "Today" ? t.date === today : filter === "Upcoming" ? t.date > today && !t.done : t.done,
    )
    .sort(sortByDue);
  const upcoming = tasks.filter((t) => t.date > today && !t.done).sort(sortByDue).slice(0, 3);
  const R = 34, C = 2 * Math.PI * R;

  return (
    <AppShell>
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>{format(new Date(), "EEEE, MMMM d")}</p>
          <h1 className="truncate text-2xl font-bold" suppressHydrationWarning>{greet}, {prefs.name} 👋</h1>
        </div>
        <Link to="/signin" aria-label="Account" className="focus-ring shrink-0 rounded-full text-primary">
          <UserCircle2 className="h-10 w-10" strokeWidth={1.5} />
        </Link>
      </header>

      <section className="mt-6 flex items-center gap-5 rounded-3xl bg-gradient-brand p-5 text-primary-foreground shadow-glow">
        <svg width="84" height="84" viewBox="0 0 84 84" className="shrink-0 -rotate-90" aria-hidden>
          <circle cx="42" cy="42" r={R} fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="8" />
          <circle cx="42" cy="42" r={R} fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C - (pct / 100) * C} className="transition-all duration-500" />
          <text x="42" y="47" textAnchor="middle" fill="currentColor" fontSize="16" fontWeight="700" transform="rotate(90 42 42)">{pct}%</text>
        </svg>
        <div>
          <p className="text-sm opacity-85">Daily progress</p>
          <p className="text-xl font-bold">{done} of {todays.length} done</p>
          <p className="text-sm opacity-85">{todays.length - done} remaining today</p>
        </div>
      </section>

      <div className="no-scrollbar -mx-5 mt-6 flex gap-2 overflow-x-auto px-5" role="tablist">
        {FILTERS.map((f) => (
          <button key={f} role="tab" aria-selected={filter === f} onClick={() => setFilter(f)} className="pill">{f}</button>
        ))}
      </div>

      <section className="mt-4">
        <h2 className="mb-3 text-lg font-bold">{filter === "All" ? "All tasks" : filter}</h2>
        {list.length ? (
          <ul className="space-y-3">{list.map((t) => <TaskItem key={t.id} task={t} showDate={filter !== "Today"} />)}</ul>
        ) : (
          <EmptyState title="Nothing here" text="No tasks match this filter yet." />
        )}
      </section>

      {filter !== "Upcoming" && upcoming.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold">Upcoming</h2>
            <Link to="/calendar" className="text-sm font-semibold text-primary">See calendar</Link>
          </div>
          <ul className="space-y-3">{upcoming.map((t) => <TaskItem key={t.id} task={t} showDate />)}</ul>
        </section>
      )}
    </AppShell>
  );
}
