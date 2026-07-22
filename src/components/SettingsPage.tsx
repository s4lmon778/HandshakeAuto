/**
 * Settings Page — AI API config, Handshake credentials, task preferences.
 */

import React from "react";
import {
  Settings,
  Key,
  Globe,
  User,
  Bell,
  Sliders,
  Database,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { useSettingsStore } from "../store/settingsStore";
import { TASK_CATEGORIES } from "../engine/handshake";
import type { AIProvider, LogLevel } from "../types";

const SettingsPage: React.FC = () => {
  const s = useSettingsStore();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-1">
          Configure AI provider, Handshake credentials, and automation preferences
        </p>
      </div>

      {/* AI Provider */}
      <section className="card space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <BrainIcon size={16} className="text-accent" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">AI Provider</h2>
            <p className="text-[11px] text-text-muted">Used to decide which tasks to apply for</p>
          </div>
        </div>

        {/* Provider selector */}
        <div className="grid grid-cols-4 gap-2">
          {(["openai", "anthropic", "deepseek", "custom"] as AIProvider[]).map((p) => (
            <button
              key={p}
              onClick={() => s.updateAIProvider(p)}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium capitalize transition-all border ${
                s.ai.provider === p
                  ? "bg-accent/10 text-accent border-accent/30"
                  : "bg-surface-elevated text-text-muted border-border hover:border-border-light"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* API Key */}
        <div>
          <label className="label">API Key</label>
          <div className="relative">
            <input
              type="password"
              value={s.ai.apiKey}
              onChange={(e) => s.updateAIKey(e.target.value)}
              placeholder={`sk-... (${s.ai.provider} API key)`}
              className="input pr-10 font-mono text-xs"
            />
            <Key size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
          </div>
        </div>

        {/* Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Model</label>
            <input
              type="text"
              value={s.ai.model}
              onChange={(e) => s.updateAIModel(e.target.value)}
              className="input text-xs font-mono"
            />
          </div>
          <div>
            <label className="label">Base URL</label>
            <input
              type="text"
              value={s.ai.baseUrl || ""}
              onChange={(e) => s.updateAIBaseUrl(e.target.value)}
              placeholder="https://api.openai.com/v1"
              className="input text-xs font-mono"
            />
          </div>
        </div>

        {/* Temperature & Max Tokens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Temperature: {s.ai.temperature.toFixed(1)}</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={s.ai.temperature}
              onChange={(e) => s.updateAITemperature(parseFloat(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
          <div>
            <label className="label">Max Tokens: {s.ai.maxTokens}</label>
            <input
              type="range"
              min="512"
              max="16384"
              step="512"
              value={s.ai.maxTokens}
              onChange={(e) => s.updateAIMaxTokens(parseInt(e.target.value))}
              className="w-full accent-accent"
            />
          </div>
        </div>
      </section>

      {/* Handshake Credentials */}
      <section className="card space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Globe size={16} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Handshake Account</h2>
            <p className="text-[11px] text-text-muted">
              Credentials for joinhandshake.com/ai
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              value={s.handshake.email}
              onChange={(e) => s.updateHandshakeEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="input"
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={s.handshake.password}
              onChange={(e) => s.updateHandshakePassword(e.target.value)}
              placeholder="Your Handshake password"
              className="input"
            />
          </div>
        </div>

        <a
          href="https://joinhandshake.com/ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover"
        >
          <ExternalLink size={12} />
          Open Handshake AI
        </a>
      </section>

      {/* Automation Preferences */}
      <section className="card space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
            <Sliders size={16} className="text-accent-green" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Automation Preferences</h2>
            <p className="text-[11px] text-text-muted">How HandshakeAuto should behave</p>
          </div>
        </div>

        {/* Auto-apply toggle */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-text-primary font-medium">Auto-Apply</p>
            <p className="text-xs text-text-muted">Automatically apply for matching tasks</p>
          </div>
          <button
            onClick={() => s.updateAutoApply(!s.autoApplyEnabled)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              s.autoApplyEnabled ? "bg-accent" : "bg-border"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                s.autoApplyEnabled ? "translate-x-5.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Sync interval */}
        <div>
          <label className="label">Sync Interval: {s.syncInterval} min</label>
          <input
            type="range"
            min="5"
            max="120"
            step="5"
            value={s.syncInterval}
            onChange={(e) => s.updateSyncInterval(parseInt(e.target.value))}
            className="w-full accent-accent"
          />
        </div>

        {/* Max concurrent */}
        <div>
          <label className="label">Max Concurrent Tasks: {s.maxConcurrentTasks}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={s.maxConcurrentTasks}
            onChange={(e) => s.updateMaxConcurrent(parseInt(e.target.value))}
            className="w-full accent-accent"
          />
        </div>

        {/* Min pay rate */}
        <div>
          <label className="label">Minimum Pay Rate: ${s.minPayRate}/hr</label>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={s.minPayRate}
            onChange={(e) => s.updateMinPayRate(parseInt(e.target.value))}
            className="w-full accent-accent"
          />
        </div>

        {/* Preferred categories */}
        <div>
          <label className="label">Preferred Task Categories</label>
          <div className="flex flex-wrap gap-2">
            {TASK_CATEGORIES.map((cat) => {
              const selected = s.preferredCategories.includes(cat.value);
              return (
                <button
                  key={cat.value}
                  onClick={() => s.togglePreferredCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    selected
                      ? "bg-accent/10 text-accent border-accent/30"
                      : "bg-surface-elevated text-text-muted border-border hover:border-border-light"
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Log level */}
        <div>
          <label className="label">Log Level</label>
          <div className="flex gap-2">
            {(["debug", "info", "warn", "error"] as LogLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => s.updateLogLevel(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all border ${
                  s.logLevel === level
                    ? "bg-accent/10 text-accent border-accent/30"
                    : "bg-surface-elevated text-text-muted border-border hover:border-border-light"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="card border-accent-red/30 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-accent-red/20">
          <div className="w-8 h-8 rounded-lg bg-accent-red/10 flex items-center justify-center">
            <AlertTriangle size={16} className="text-accent-red" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-accent-red">Danger Zone</h2>
            <p className="text-[11px] text-text-muted">Irreversible actions</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm("Reset all settings to defaults?")) {
              s.resetSettings();
            }
          }}
          className="btn-secondary text-accent-red border-accent-red/30 hover:bg-accent-red/10 text-sm"
        >
          Reset All Settings
        </button>
      </section>

      {/* Status Summary */}
      <section className="card space-y-3">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <ShieldCheck size={16} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Setup Status</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-elevated">
            <span className={`w-2 h-2 rounded-full ${s.ai.apiKey ? "bg-accent-green" : "bg-accent-red"}`} />
            <span className="text-text-muted text-xs">AI API Key: {s.ai.apiKey ? "Configured" : "Missing"}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-elevated">
            <span className={`w-2 h-2 rounded-full ${s.handshake.email ? "bg-accent-green" : "bg-accent-red"}`} />
            <span className="text-text-muted text-xs">Handshake: {s.handshake.email || "Not configured"}</span>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-elevated">
            <span className={`w-2 h-2 rounded-full ${s.preferredCategories.length > 0 ? "bg-accent-green" : "bg-accent-amber"}`} />
            <span className="text-text-muted text-xs">Categories: {s.preferredCategories.length} selected</span>
          </div>
        </div>
      </section>
    </div>
  );
};

// Inline Brain icon since we need it in Settings too
const BrainIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 4a4 4 0 0 1 3.5 2.1 4 4 0 0 1 2.5-.1 4 4 0 0 1 1.5 6.5 4 4 0 0 1-1.5 6.5 4 4 0 0 1-6.5 1.5 4 4 0 0 1-6.5-1.5 4 4 0 0 1-1.5-6.5 4 4 0 0 1 1.5-6.5A4 4 0 0 1 12 4z" />
    <path d="M12 8v8" />
    <path d="M8 12h8" />
  </svg>
);

export default SettingsPage;
