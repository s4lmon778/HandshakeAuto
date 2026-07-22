/**
 * HandshakeAuto — Application Shell
 * Top-level layout with navigation sidebar and content area.
 */

import React, { useState } from "react";
import { Settings, LayoutDashboard, Brain, Grip } from "lucide-react";
import Dashboard from "./components/Dashboard";
import SettingsPage from "./components/SettingsPage";

type Tab = "dashboard" | "settings";

const NAV_ITEMS: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "settings", label: "Settings", icon: Settings },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  return (
    <div className="h-screen flex bg-surface overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-surface-elevated border-r border-border flex flex-col">
        {/* Logo */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Brain size={18} className="text-accent" />
            </div>
            <div>
              <h1 className="text-base font-bold text-text-primary tracking-tight">HandshakeAuto</h1>
              <p className="text-[10px] text-text-muted font-mono">AI Task Automation</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/20"
                    : "text-text-muted hover:text-text-primary hover:bg-white/5 border border-transparent"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 text-[10px] text-text-muted">
            <Grip size={12} />
            <span>v1.0.0</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "settings" && <SettingsPage />}
      </main>
    </div>
  );
};

export default App;
