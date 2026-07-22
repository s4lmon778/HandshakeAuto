// ── Handshake AI Task Types ──

export type TaskCategory =
  | "ai_training"
  | "data_annotation"
  | "evaluation"
  | "feedback"
  | "content_review"
  | "reasoning"
  | "coding"
  | "writing";

export type TaskStatus = "pending" | "running" | "completed" | "failed" | "cancelled";

export type ApplicationStatus = "available" | "applied" | "accepted" | "rejected" | "completed";

export interface HandshakeTask {
  id: string;
  title: string;
  category: TaskCategory;
  description: string;
  payRate: string; // e.g. "$25/hr"
  estimatedHours: number;
  requirements: string[];
  status: ApplicationStatus;
  url: string;
  postedDate: string;
  deadline?: string;
  skills: string[];
}

export interface LocalTask {
  id: string;
  handshakeId: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  progress: number; // 0–100
  autoApplied: boolean;
  createdAt: string; // ISO
  startedAt?: string;
  completedAt?: string;
  result?: string;
  error?: string;
  payRate: string;
  hoursLogged: number;
  earnings: number;
}

// ── Earnings & Stats ──

export interface DailyEarnings {
  date: string; // YYYY-MM-DD
  tasksCompleted: number;
  hoursLogged: number;
  earnings: number;
}

export interface AppStats {
  totalTasksFound: number;
  tasksApplied: number;
  tasksAccepted: number;
  tasksCompleted: number;
  tasksFailed: number;
  totalHoursLogged: number;
  totalEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  averageHourlyRate: number;
  activeTasks: number;
  dailyHistory: DailyEarnings[];
  lastSyncAt?: string;
}

// ── AI Provider Types ──

export type AIProvider = "openai" | "anthropic" | "deepseek" | "custom";

export interface AIProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  baseUrl?: string;
  maxTokens: number;
  temperature: number;
}

export const AI_PROVIDER_DEFAULTS: Record<AIProvider, { model: string; baseUrl: string }> = {
  openai: { model: "gpt-4o", baseUrl: "https://api.openai.com/v1" },
  anthropic: { model: "claude-sonnet-4", baseUrl: "https://api.anthropic.com" },
  deepseek: { model: "deepseek-v4-pro[1m]", baseUrl: "https://api.deepseek.com" },
  custom: { model: "custom-model", baseUrl: "" },
};

// ── App Settings ──

export interface HandshakeCredentials {
  email: string;
  password: string;
}

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface AppSettings {
  ai: AIProviderConfig;
  handshake: HandshakeCredentials;
  syncInterval: number; // minutes — how often to check for new tasks
  autoApplyEnabled: boolean;
  maxConcurrentTasks: number;
  minPayRate: number; // minimum $/hr to auto-apply
  preferredCategories: TaskCategory[];
  logLevel: LogLevel;
}

export const DEFAULT_SETTINGS: AppSettings = {
  ai: {
    provider: "openai",
    apiKey: "",
    model: "gpt-4o",
    maxTokens: 4096,
    temperature: 0.7,
  },
  handshake: {
    email: "",
    password: "",
  },
  syncInterval: 30,
  autoApplyEnabled: false,
  maxConcurrentTasks: 3,
  minPayRate: 20,
  preferredCategories: ["ai_training", "reasoning", "evaluation"],
  logLevel: "info",
};

// ── Activity Log ──

export type ActivityType =
  | "task_found"
  | "task_applied"
  | "task_accepted"
  | "task_completed"
  | "task_failed"
  | "sync_start"
  | "sync_complete"
  | "sync_error"
  | "ai_decided"
  | "error"
  | "info";

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: string;
  taskId?: string;
  details?: string;
}
