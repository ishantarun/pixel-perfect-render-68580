import { Check, Clock, Pencil, Repeat, Trash2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { actions, todayStr, type Task } from "@/lib/store";
import { cn } from "@/lib/utils";

const prio = { High: "chip-high", Medium: "chip-medium", Low: "chip-low" } as const;

export function TaskItem({ task, showDate }: { task: Task; showDate?: boolean }) {
  const time = format(parseISO(`${task.date}T${task.time}`), "h:mm a");
  const day = task.date === todayStr() ? "Today" : format(parseISO(task.date), "EEE, MMM d");
  return (
    <li className="flex items-start gap-3 rounded-2xl border bg-card p-4 shadow-card">
      <button
        role="checkbox"
        aria-checked={task.done}
        aria-label={`Mark ${task.title} ${task.done ? "incomplete" : "complete"}`}
        onClick={() => actions.toggle(task.id)}
        className={cn(
          "focus-ring mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition-colors",
          task.done ? "border-primary bg-primary text-primary-foreground" : "border-input",
        )}
      >
        {task.done && <Check className="h-4 w-4" strokeWidth={3} />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={cn("truncate font-semibold", task.done && "text-muted-foreground line-through")}>{task.title}</p>
        {task.notes && <p className="truncate text-sm text-muted-foreground">{task.notes}</p>}
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {showDate ? `${day} · ` : ""}
            {time}
          </span>
          <span className={cn("chip", prio[task.priority])}>{task.priority}</span>
          <span className="chip chip-cat">{task.category}</span>
          {task.repeat !== "None" && (
            <span className="inline-flex items-center gap-0.5 text-muted-foreground">
              <Repeat className="h-3 w-3" />
              {task.repeat}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-0.5">
        <button aria-label={`Edit ${task.title}`} onClick={() => actions.openEditor(task)} className="focus-ring rounded-lg p-2 text-muted-foreground hover:bg-muted">
          <Pencil className="h-4 w-4" />
        </button>
        <button aria-label={`Delete ${task.title}`} onClick={() => actions.askDelete(task.id)} className="focus-ring rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

export function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-dashed bg-card/60 px-6 py-10 text-center">
      <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
        <Check className="h-6 w-6" />
      </div>
      <p className="font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      <button onClick={() => actions.openEditor()} className="focus-ring mt-4 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        Add a task
      </button>
    </div>
  );
}
