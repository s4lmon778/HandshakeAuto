/**
 * Dashboard — Live monitoring of Handshake AI task automation.
 */

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  Activity,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Brain,
  RefreshCw,
  Play,
  StopCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import { useTaskStore } from "../store/taskStore";
import { useSettingsStore } from "../store/settingsStore";
import { fetchAvailableTasks } from "../engine/handshake";
import { decideOnTask } from "../engine/ai";
import type { Activity as ActivityType } from "../types";

const Dashboard: React.FC = () => {
  const {
    localTasks, activity, stats, isSyncing,
    addFoundTask, updateTaskStatus, startAutoApply, addActivity, setSyncing,
  } = useTaskStore();
  const settings = useSettingsStore();
  const syncRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Auto-sync ──
  useEffect(() => {
    if (!settings.autoApplyEnabled || !settings.handshake.email) return;

    const interval = settings.syncInterval * 60 * 1000;
    syncRef.current = setInterval(() => {
      runSyncCycle();
    }, interval);

    return () => {
      if (syncRef.current) clearInterval(syncRef.current);
    };
  }, [settings.autoApplyEnabled, settings.syncInterval, settings.handshake.email]);

  // ── Manual sync ──
  const runSyncCycle = useCallback(async () => {
    if (isSyncing) return;
    setSyncing(true);
    addActivity("sync_start", "Checking Handshake AI for new tasks...");

    try {
      const tasks = await fetchAvailableTasks();
      addActivity("sync_complete", `Found ${tasks.length} available tasks`, tasks.map((t) => t.title).join(", "));

      for (const task of tasks) {
        // Check if AI API is configured — if so, use AI to decide
        let shouldApply = true;
        let reason = "Auto-matched preferred category";

        if (settings.ai.apiKey) {
          try {
            addActivity("ai_decided", `AI evaluating: ${task.title}`);
            const decision = await decideOnTask(
              settings.ai,
              task.title,
              task.description,
              task.payRate,
              settings.preferredCategories
            );
            shouldApply = decision.shouldApply;
            reason = decision.reason;
            addActivity(
              "ai_decided",
              `AI decision for "${task.title}"`,
              `${decision.score}/100 — ${decision.reason}`
            );
          } catch {
            // Fallback: apply if category is preferred
            shouldApply = settings.preferredCategories.includes(task.category);
            reason = "Fallback: category match";
          }
        }

        if (shouldApply) {
          addActivity("task_found", `Applying: ${task.title}`, `${task.payRate} — ${reason}`);
          await startAutoApply(task.title, task.category, task.payRate, task.id);
          // Small delay between applications
          await new Promise((r) => setTimeout(r, 1000));
        } else {
          addFoundTask(task.title, task.category, task.payRate, task.id);
          addActivity("task_found", `Skipped: ${task.title}`, reason);
        }
      }
    } catch (error) {
      addActivity("sync_error", "Sync failed", String(error));
    } finally {
      setSyncing(false);
    }
  }, [isSyncing, settings, addActivity, startAutoApply, addFoundTask, setSyncing]);

  // ── Stats ──
  const statsCards = useMemo(() => [
    {
      label: "Total Earnings",
      value: `$${stats.totalEarnings.toFixed(0)}`,
      sub: `$${stats.weeklyEarnings.toFixed(0)} this week`,
      icon: DollarSign,
      color: "text-accent-green",
      bg: "bg-accent-green/10",
    },
    {
      label: "Tasks Completed",
      value: String(stats.tasksCompleted),
      sub: `${stats.tasksApplied} applied · ${stats.tasksAccepted} accepted`,
      icon: CheckCircle2,
      color: "text-accent-blue",
      bg: "bg-accent-blue/10",
    },
    {
      label: "Hours Logged",
      value: `${stats.totalHoursLogged.toFixed(1)}h`,
      sub: `Avg $${stats.averageHourlyRate}/hr`,
      icon: Clock,
      color: "text-accent-amber",
      bg: "bg-accent-amber/10",
    },
    {
      label: "Active Tasks",
      value: String(stats.activeTasks),
      sub: `${stats.tasksFailed} failed`,
      icon: Brain,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ], [stats]);

  const runningTasks = localTasks.filter((t) => t.status === "running");
  const recentActivity = activity.slice(0, 20);

  function activityIcon(type: ActivityType["type"]) {
    switch (type) {
      case "task_found": return "🔍";
      case "task_applied": return "📤";
      case "task_accepted": return "✅";
      case "task_completed": return "🎉";
      case "task_failed": return "❌";
      case "sync_start": return "🔄";
      case "sync_complete": return "📡";
      case "sync_error": return "⚠️";
      case "ai_decided": return "🤖";
      case "error": return "🚨";
      default: return "📋";
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">
            Monitor Handshake AI task automation in real-time
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Status badge */}
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className={`w-2 h-2 rounded-full ${isSyncing ? "bg-accent-amber animate-pulse" : "bg-accent-green"}`} />
            {isSyncing ? "Syncing..." : "Idle"}
          </div>

          <button
            onClick={runSyncCycle}
            disabled={isSyncing || !settings.handshake.email}
            className="btn-primary flex items-center gap-2"
          >
            {isSyncing ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <RefreshCw size={14} />
            )}
            Sync Now
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="card-hover">
              <div className="flex items-start justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  {card.label}
                </span>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon size={16} className={card.color} />
                </div>
              </div>
              <div className="text-2xl font-bold text-text-primary">{card.value}</div>
              <div className="text-[11px] text-text-muted mt-1">{card.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Running Tasks & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Running Tasks */}
        <div className="card">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-4">
            <Activity size={14} className="text-accent" />
            Running Tasks
            {runningTasks.length > 0 && (
              <span className="badge-info">{runningTasks.length}</span>
            )}
          </h2>

          {runningTasks.length === 0 ? (
            <div className="text-center py-8 text-text-muted text-sm">
              <Brain size={32} className="mx-auto mb-2 opacity-30" />
              <p>No active tasks</p>
              <p className="text-xs mt-1">Enable auto-apply in Settings or click Sync Now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {runningTasks.map((task) => (
                <div key={task.id} className="bg-surface-elevated rounded-lg p-3 border border-border">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{task.title}</p>
                      <p className="text-[11px] text-text-muted">{task.payRate}</p>
                    </div>
                    <button
                      onClick={() => {
                        updateTaskStatus(task.id, "cancelled");
                        addActivity("info", `Cancelled: ${task.title}`, undefined, task.id);
                      }}
                      className="p-1 hover:bg-accent-red/10 rounded transition-colors"
                      title="Cancel task"
                    >
                      <StopCircle size={14} className="text-accent-red" />
                    </button>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-text-muted mt-1">{task.progress}%</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="card">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-4">
            <BarChart3 size={14} className="text-accent" />
            Activity Feed
          </h2>

          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {recentActivity.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-sm">
                <Activity size={32} className="mx-auto mb-2 opacity-30" />
                <p>No activity yet</p>
                <p className="text-xs mt-1">Click Sync Now to start</p>
              </div>
            ) : (
              recentActivity.map((a) => (
                <div
                  key={a.id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="text-base mt-0.5">{activityIcon(a.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary leading-relaxed">{a.message}</p>
                    {a.details && (
                      <p className="text-[10px] text-text-muted mt-0.5 truncate">{a.details}</p>
                    )}
                    <p className="text-[9px] text-text-muted mt-0.5">
                      {new Date(a.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="card">
        <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-4">
          <TrendingUp size={14} className="text-accent" />
          Recent Tasks
        </h2>

        {localTasks.length === 0 ? (
          <div className="text-center py-6 text-text-muted text-sm">
            <p>No tasks yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] text-text-muted uppercase tracking-wider">
                  <th className="pb-2 pr-4">Task</th>
                  <th className="pb-2 pr-4">Category</th>
                  <th className="pb-2 pr-4">Pay</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Earnings</th>
                  <th className="pb-2 pr-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {localTasks.slice(0, 10).map((task) => (
                  <tr key={task.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 pr-4">
                      <p className="text-text-primary font-medium truncate max-w-[200px]">{task.title}</p>
                    </td>
                    <td className="py-2.5 pr-4 text-text-muted text-xs">{task.category}</td>
                    <td className="py-2.5 pr-4 text-text-muted text-xs">{task.payRate}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`badge-${
                        task.status === "completed" ? "success" :
                        task.status === "running" ? "info" :
                        task.status === "failed" ? "error" :
                        task.status === "cancelled" ? "warning" : "info"
                      }`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-text-primary font-mono text-xs">
                      ${task.earnings.toFixed(2)}
                    </td>
                    <td className="py-2.5 pr-4 text-text-muted text-xs">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
