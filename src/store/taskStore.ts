import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocalTask, AppStats, Activity, DailyEarnings, TaskStatus, TaskCategory } from "../types";
import { simulateTaskCompletion } from "../engine/simulator";

const MAX_ACTIVITY = 200;

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function updateDailyEarnings(stats: AppStats, hours: number, earnings: number): AppStats {
  const date = today();
  const idx = stats.dailyHistory.findIndex((d) => d.date === date);
  const entry: DailyEarnings = idx >= 0
    ? { ...stats.dailyHistory[idx] }
    : { date, tasksCompleted: 0, hoursLogged: 0, earnings: 0 };

  entry.tasksCompleted += 1;
  entry.hoursLogged += hours;
  entry.earnings += earnings;

  const history = [...stats.dailyHistory];
  if (idx >= 0) history[idx] = entry;
  else history.push(entry);

  // Recalculate totals
  const last7 = history.slice(-7);
  const last30 = history.slice(-30);

  return {
    ...stats,
    dailyHistory: history.slice(-90),
    weeklyEarnings: last7.reduce((s, d) => s + d.earnings, 0),
    monthlyEarnings: last30.reduce((s, d) => s + d.earnings, 0),
    totalHoursLogged: history.reduce((s, d) => s + d.hoursLogged, 0),
    totalEarnings: history.reduce((s, d) => s + d.earnings, 0),
  };
}

const INITIAL_STATS: AppStats = {
  totalTasksFound: 0,
  tasksApplied: 0,
  tasksAccepted: 0,
  tasksCompleted: 0,
  tasksFailed: 0,
  totalHoursLogged: 0,
  totalEarnings: 0,
  weeklyEarnings: 0,
  monthlyEarnings: 0,
  averageHourlyRate: 0,
  activeTasks: 0,
  dailyHistory: [],
};

interface TaskStore {
  localTasks: LocalTask[];
  activity: Activity[];
  stats: AppStats;
  isSyncing: boolean;

  addFoundTask: (title: string, category: TaskCategory, payRate: string, handshakeId: string) => string;
  updateTaskStatus: (id: string, status: TaskStatus, progress?: number) => void;
  logHours: (id: string, hours: number, earnings: number) => void;
  cancelTask: (id: string) => void;
  clearCompleted: () => void;

  startAutoApply: (title: string, category: TaskCategory, payRate: string, handshakeId: string) => Promise<string>;

  addActivity: (type: Activity["type"], message: string, details?: string, taskId?: string) => void;
  setSyncing: (syncing: boolean) => void;
  resetStats: () => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      localTasks: [],
      activity: [],
      stats: { ...INITIAL_STATS },
      isSyncing: false,

      addFoundTask: (title, category, payRate, handshakeId) => {
        const id = uid();
        const task: LocalTask = {
          id,
          handshakeId,
          title,
          category,
          status: "pending",
          progress: 0,
          autoApplied: false,
          createdAt: new Date().toISOString(),
          payRate,
          hoursLogged: 0,
          earnings: 0,
        };
        set((s) => ({
          localTasks: [task, ...s.localTasks].slice(0, 500),
          stats: { ...s.stats, totalTasksFound: s.stats.totalTasksFound + 1 },
        }));
        return id;
      },

      updateTaskStatus: (id, status, progress) => {
        set((s) => {
          const tasks = s.localTasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  status,
                  progress: progress ?? t.progress,
                  startedAt: status === "running" && !t.startedAt ? new Date().toISOString() : t.startedAt,
                  completedAt: status === "completed" || status === "failed" ? new Date().toISOString() : t.completedAt,
                }
              : t
          );
          let delta = { ...s.stats };
          if (status === "running") {
            const running = tasks.filter((t) => t.status === "running").length;
            delta.activeTasks = running;
          } else if (status === "completed") {
            delta.tasksCompleted += 1;
            delta.activeTasks = Math.max(0, delta.activeTasks - 1);
          } else if (status === "failed") {
            delta.tasksFailed += 1;
            delta.activeTasks = Math.max(0, delta.activeTasks - 1);
          }
          delta.averageHourlyRate = delta.totalHoursLogged > 0
            ? Math.round(delta.totalEarnings / delta.totalHoursLogged)
            : 0;
          return { tasks, stats: delta };
        });
      },

      logHours: (id, hours, earnings) => {
        set((s) => {
          const tasks = s.localTasks.map((t) =>
            t.id === id
              ? { ...t, hoursLogged: t.hoursLogged + hours, earnings: t.earnings + earnings }
              : t
          );
          const delta = updateDailyEarnings(s.stats, hours, earnings);
          delta.averageHourlyRate = delta.totalHoursLogged > 0
            ? Math.round(delta.totalEarnings / delta.totalHoursLogged)
            : 0;
          return { tasks, stats: delta };
        });
      },

      cancelTask: (id) => {
        get().updateTaskStatus(id, "cancelled");
      },

      clearCompleted: () => {
        set((s) => ({
          localTasks: s.localTasks.filter((t) => t.status === "running" || t.status === "pending"),
        }));
      },

      startAutoApply: async (title, category, payRate, handshakeId) => {
        const id = get().addFoundTask(title, category, payRate, handshakeId);
        const store = get();

        store.updateTaskStatus(id, "running", 10);
        store.addActivity("task_applied", `Auto-applying: ${title}`, payRate, id);

        // Simulate: wait, then "complete" the application
        const result = await simulateTaskCompletion(title);
        const task = store.localTasks.find((t) => t.id === id);
        if (task) {
          store.updateTaskStatus(id, "completed", 100);
          store.logHours(id, result.hours, result.earnings);
          store.addActivity(
            "task_completed",
            `Completed: ${title}`,
            `${result.hours}h logged, $${result.earnings.toFixed(2)} earned`,
            id
          );
          // Bump accepted count
          set((s) => ({ stats: { ...s.stats, tasksAccepted: s.stats.tasksAccepted + 1 } }));
        }
        return id;
      },

      addActivity: (type, message, details, taskId) => {
        const entry: Activity = {
          id: uid(),
          type,
          message,
          timestamp: new Date().toISOString(),
          taskId,
          details,
        };
        set((s) => ({
          activity: [entry, ...s.activity].slice(0, MAX_ACTIVITY),
        }));
      },

      setSyncing: (isSyncing) => set({ isSyncing }),
      resetStats: () => set({ stats: { ...INITIAL_STATS } }),
    }),
    {
      name: "handshake-auto-tasks",
      partialize: (state) => ({
        localTasks: state.localTasks.slice(0, 200),
        activity: state.activity.slice(0, 100),
        stats: JSON.parse(JSON.stringify(state.stats)),
      }),
    }
  )
);
