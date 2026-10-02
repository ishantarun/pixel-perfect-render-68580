import { useSyncExternalStore } from "react";
import { addDays, format } from "date-fns";

export type Priority = "Low" | "Medium" | "High";
export type Repeat = "None" | "Daily" | "Weekly" | "Monthly";
export const CATEGORIES = ["Personal", "Work", "Study", "Health"] as const;
export type Category = (typeof CATEGORIES)[number];

export interface Task {
  id: string;
  title: string;
  notes: string;
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  priority: Priority;
  category: Category;
  repeat: Repeat;
  done: boolean;
}

export interface Prefs {
  email: boolean;
  inApp: boolean;
  summary: boolean;
  timing: "At due time" | "10 minutes before" | "1 hour before";
  name: string;
}

interface State {
  tasks: Task[];
  prefs: Prefs;
  editor: { open: boolean; task: Task | null };
  confirmId: string | null;
}

const d = (n: number) => format(addDays(new Date(), n), "yyyy-MM-dd");
const seed = (): Task[] => [
  { id: "1", title: "Morning run", notes: "5 km around the park", date: d(0), time: "07:00", priority: "Medium", category: "Health", repeat: "Daily", done: true },
  { id: "2", title: "Team stand-up", notes: "Share sprint progress", date: d(0), time: "09:30", priority: "High", category: "Work", repeat: "Daily", done: false },
  { id: "3", title: "Review design mockups", notes: "", date: d(0), time: "13:00", priority: "High", category: "Work", repeat: "None", done: false },
  { id: "4", title: "Read chapter 4 — Algorithms", notes: "Take notes on graphs", date: d(0), time: "18:00", priority: "Medium", category: "Study", repeat: "None", done: false },
  { id: "5", title: "Call mom", notes: "", date: d(0), time: "20:00", priority: "Low", category: "Personal", repeat: "Weekly", done: false },
  { id: "6", title: "Dentist appointment", notes: "Bring insurance card", date: d(1), time: "10:00", priority: "High", category: "Health", repeat: "None", done: false },
  { id: "7", title: "Submit expense report", notes: "", date: d(2), time: "17:00", priority: "Medium", category: "Work", repeat: "Monthly", done: false },
  { id: "8", title: "Grocery shopping", notes: "Milk, eggs, spinach, coffee", date: d(3), time: "11:00", priority: "Low", category: "Personal", repeat: "Weekly", done: false },
];

const defaultPrefs: Prefs = { email: true, inApp: true, summary: false, timing: "10 minutes before", name: "Alex" };
const serverState: State = { tasks: seed(), prefs: defaultPrefs, editor: { open: false, task: null }, confirmId: null };

let state: State = serverState;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const t = localStorage.getItem("daywise.tasks");
    const p = localStorage.getItem("daywise.prefs");
    state = {
      ...state,
      tasks: t ? JSON.parse(t) : seed(),
      prefs: p ? { ...defaultPrefs, ...JSON.parse(p) } : defaultPrefs,
    };
  } catch {
    /* ignore */
  }
}

function set(patch: Partial<State>) {
  state = { ...state, ...patch };
  if (typeof window !== "undefined") {
    localStorage.setItem("daywise.tasks", JSON.stringify(state.tasks));
    localStorage.setItem("daywise.prefs", JSON.stringify(state.prefs));
  }
  listeners.forEach((l) => l());
}

export function useStore() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => {
      load();
      return state;
    },
    () => serverState,
  );
}

export const actions = {
  toggle: (id: string) => set({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }),
  save: (task: Task) =>
    set({
      tasks: state.tasks.some((t) => t.id === task.id)
        ? state.tasks.map((t) => (t.id === task.id ? task : t))
        : [...state.tasks, task],
      editor: { open: false, task: null },
    }),
  remove: (id: string) => set({ tasks: state.tasks.filter((t) => t.id !== id), confirmId: null }),
  openEditor: (task: Task | null = null) => set({ editor: { open: true, task } }),
  closeEditor: () => set({ editor: { open: false, task: null } }),
  askDelete: (id: string | null) => set({ confirmId: id }),
  setPrefs: (p: Partial<Prefs>) => set({ prefs: { ...state.prefs, ...p } }),
};

export const todayStr = () => format(new Date(), "yyyy-MM-dd");
export const sortByDue = (a: Task, b: Task) => (a.date + a.time).localeCompare(b.date + b.time);
