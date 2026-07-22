import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppSettings, AIProvider, TaskCategory, LogLevel } from "../types";
import { DEFAULT_SETTINGS, AI_PROVIDER_DEFAULTS } from "../types";

interface SettingsStore extends AppSettings {
  updateAIProvider: (provider: AIProvider) => void;
  updateAIKey: (key: string) => void;
  updateAIModel: (model: string) => void;
  updateAIBaseUrl: (url: string) => void;
  updateAITemperature: (t: number) => void;
  updateAIMaxTokens: (n: number) => void;
  updateHandshakeEmail: (email: string) => void;
  updateHandshakePassword: (pw: string) => void;
  updateSyncInterval: (min: number) => void;
  updateAutoApply: (enabled: boolean) => void;
  updateMaxConcurrent: (n: number) => void;
  updateMinPayRate: (rate: number) => void;
  togglePreferredCategory: (cat: TaskCategory) => void;
  updateLogLevel: (level: LogLevel) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      updateAIProvider: (provider) =>
        set((s) => ({
          ai: {
            ...s.ai,
            provider,
            model: AI_PROVIDER_DEFAULTS[provider].model,
            baseUrl: AI_PROVIDER_DEFAULTS[provider].baseUrl,
          },
        })),
      updateAIKey: (apiKey) => set((s) => ({ ai: { ...s.ai, apiKey } })),
      updateAIModel: (model) => set((s) => ({ ai: { ...s.ai, model } })),
      updateAIBaseUrl: (baseUrl) => set((s) => ({ ai: { ...s.ai, baseUrl } })),
      updateAITemperature: (temperature) => set((s) => ({ ai: { ...s.ai, temperature } })),
      updateAIMaxTokens: (maxTokens) => set((s) => ({ ai: { ...s.ai, maxTokens } })),
      updateHandshakeEmail: (email) => set((s) => ({ handshake: { ...s.handshake, email } })),
      updateHandshakePassword: (password) => set((s) => ({ handshake: { ...s.handshake, password } })),
      updateSyncInterval: (syncInterval) => set({ syncInterval }),
      updateAutoApply: (autoApplyEnabled) => set({ autoApplyEnabled }),
      updateMaxConcurrent: (maxConcurrentTasks) => set({ maxConcurrentTasks }),
      updateMinPayRate: (minPayRate) => set({ minPayRate }),
      togglePreferredCategory: (cat) =>
        set((s) => ({
          preferredCategories: s.preferredCategories.includes(cat)
            ? s.preferredCategories.filter((c) => c !== cat)
            : [...s.preferredCategories, cat],
        })),
      updateLogLevel: (logLevel) => set({ logLevel }),
      resetSettings: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: "handshake-auto-settings",
      partialize: (state) => ({
        ai: { ...state.ai },
        handshake: { ...state.handshake },
        syncInterval: state.syncInterval,
        autoApplyEnabled: state.autoApplyEnabled,
        maxConcurrentTasks: state.maxConcurrentTasks,
        minPayRate: state.minPayRate,
        preferredCategories: [...state.preferredCategories],
        logLevel: state.logLevel,
      }),
    }
  )
);
