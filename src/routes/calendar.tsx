import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameMonth, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EmptyState, TaskItem } from "@/components/TaskItem";
import { sortByDue, todayStr, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Daywise" },
      { name: "description", content: "See your tasks laid out across the month." },
      { property: "og:title", content: "Calendar — Daywise" },
      { property: "og:description", content: "See your tasks laid out across the month." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const { tasks } = useStore();
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [sel, setSel] = useState(todayStr());
  const days = eachDayOfInterval({ start: startOfWeek(month), end: endOfWeek(endOfMonth(month)) });
  const dayTasks = tasks.filter((t) => t.date === sel).sort(sortByDue);
  const today = todayStr();

  return (
    <AppShell>
      <h1 className="text-2xl font-bold">Calendar</h1>
      <section className="mt-4 rounded-3xl border bg-card p-4 shadow-card">
        <div className="mb-3 flex items-center justify-between">
          <button aria-label="Previous month" onClick={() => setMonth(addMonths(month, -1))} className="focus-ring rounded-lg p-2 hover:bg-muted"><ChevronLeft className="h-5 w-5" /></button>
          <p className="font-bold">{format(month, "MMMM yyyy")}</p>
          <button aria-label="Next month" onClick={() => setMonth(addMonths(month, 1))} className="focus-ring rounded-lg p-2 hover:bg-muted"><ChevronRight className="h-5 w-5" /></button>
        </div>
        <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} className="py-1">{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => {
            const key = format(d, "yyyy-MM-dd");
            const has = tasks.some((t) => t.date === key && !t.done);
            return (
              <button
                key={key}
                onClick={() => setSel(key)}
                aria-label={format(d, "MMMM d")}
                aria-pressed={sel === key}
                className={cn(
                  "focus-ring relative grid aspect-square place-items-center rounded-xl text-sm",
                  !isSameMonth(d, month) && "text-muted-foreground/50",
                  key === today && "font-bold text-primary",
                  sel === key && "bg-primary text-primary-foreground",
                )}
              >
                {format(d, "d")}
                {has && <span className={cn("absolute bottom-1 h-1 w-1 rounded-full", sel === key ? "bg-primary-foreground" : "bg-primary")} />}
              </button>
            );
          })}
        </div>
      </section>
      <h2 className="mb-3 mt-6 text-lg font-bold">{sel === today ? "Today" : format(new Date(sel + "T00:00"), "EEEE, MMM d")}</h2>
      {dayTasks.length ? (
        <ul className="space-y-3">{dayTasks.map((t) => <TaskItem key={t.id} task={t} />)}</ul>
      ) : (
        <EmptyState title="A free day" text="No tasks scheduled for this date." />
      )}
    </AppShell>
  );
}
