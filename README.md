<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/s4lmon778/HandshakeAuto/master/public/icons.svg">
    <img alt="HandshakeAuto" src="https://raw.githubusercontent.com/s4lmon778/HandshakeAuto/master/public/icons.svg" width="80">
  </picture>
</p>

<h1 align="center">HandshakeAuto</h1>

<p align="center">
  <strong>Desktop app for automating Handshake AI Fellowship tasks</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#download">Download</a> •
  <a href="#usage">Usage</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#architecture">Architecture</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey" alt="Platform">
  <img src="https://img.shields.io/github/v/release/s4lmon778/HandshakeAuto" alt="GitHub Release">
</p>

---

**HandshakeAuto** is a cross-platform desktop app that monitors the [Handshake AI Fellowship](https://joinhandshake.com/ai) portal, automatically discovers AI training tasks, and tracks your earnings and progress in real-time.

Built with [Tauri v2](https://v2.tauri.app/) + React — lightweight (under 5 MB), native performance, runs on Windows, macOS, and Linux.

---

## Features

| Feature | Description |
|---------|-------------|
| 🔍 **Auto-Discovery** | Automatically scans for available Handshake AI tasks |
| 🤖 **AI-Powered Selection** | Uses your API key (OpenAI/Anthropic/DeepSeek/Custom) to decide which tasks to apply for |
| 📊 **Live Dashboard** | Real-time stats: earnings, tasks completed, hours logged, active tasks |
| 📋 **Activity Feed** | Chronological log of every action — syncs, tasks found, applications, completions |
| ⚙️ **Full Settings** | AI provider config, Handshake credentials, auto-apply toggles, category preferences |
| 💾 **Local-First** | All data saved to local storage — nothing sent to the cloud |
| 🖥️ **Cross-Platform Desktop** | Native Windows .exe, macOS .dmg, and Linux .AppImage |

---

## Download

Get the latest version for your platform:

| Platform | Download | Size |
|----------|----------|------|
| 🪟 **Windows** | [HandshakeAuto_1.0.0_x64-setup.exe](https://github.com/s4lmon778/HandshakeAuto/releases/download/v1.0.0/HandshakeAuto_1.0.0_x64-setup.exe) | ~2.4 MB |
| 🍎 **macOS** | Build from source ([1 command](#macos-build)) | — |
| 🐧 **Linux** | Build from source ([1 command](#from-source)) | — |

> **macOS / Linux users** — one command (Rust required):
> ```bash
> # Install Rust (if not installed)
> curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
>
> # Build HandshakeAuto
> git clone https://github.com/s4lmon778/HandshakeAuto.git && cd HandshakeAuto && npm install && npm run tauri build
> ```
> The `.dmg` / `.AppImage` will be in `src-tauri/target/release/bundle/`.

## Quick Start

### Desktop App

1. **Download** the installer for your platform from [Releases](https://github.com/s4lmon778/HandshakeAuto/releases/latest)
2. **Install**: Windows → run `.exe`, macOS → mount `.dmg` + drag to Applications, Linux → run `.AppImage`
3. **Launch** HandshakeAuto
4. Go to **Settings** → enter your **AI API key** and **Handshake login**
5. Click **Sync Now** on the Dashboard

### Web Version (no install)

```bash
https://s4lmon778.github.io/HandshakeAuto
```

### From Source

Requirements: **Rust** + **Node.js 18+**

```bash
# 1. Install Rust (if you haven't already)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 2. Clone and build
git clone https://github.com/s4lmon778/HandshakeAuto.git
cd HandshakeAuto
npm install

# Run in browser (dev mode)
npm run dev

# Build desktop app (Windows .exe / macOS .dmg / Linux .AppImage)
npm run tauri build
```

> **macOS note:** Xcode Command Line Tools are required. If `npm run tauri build` prompts about missing tools, run:
> ```bash
> xcode-select --install
> ```

---

## Usage

### 1. Configure Settings

Navigate to **Settings** and configure:

| Setting | Required | Notes |
|---------|----------|-------|
| **AI API Key** | ✅ Yes | OpenAI, Anthropic, DeepSeek, or any OpenAI-compatible provider |
| **Handshake Email** | ✅ Yes | Your joinhandshake.com login |
| **Handshake Password** | ✅ Yes | Stored locally on your machine |
| **Task Preferences** | Optional | Filter by category, minimum pay rate, max concurrency |

### 2. Start Monitoring

Go to **Dashboard** and click **Sync Now**. HandshakeAuto will:

1. Discover available AI tasks from Handshake
2. Use your configured AI to evaluate each task
3. Auto-apply for tasks that match your preferences
4. Track progress and earnings in real-time

### 3. Track Progress

The dashboard shows:

- **Earnings** — Total, weekly, monthly
- **Task Stats** — Completed, failed, applied, accepted
- **Active Tasks** — Running tasks with progress bars
- **Activity Feed** — Every action logged with timestamps
- **Task History** — Sortable table of all tasks

---

## AI Providers

HandshakeAuto supports any AI provider for task decision-making:

| Provider | Default Model | API Key Format |
|----------|--------------|----------------|
| **OpenAI** | `gpt-4o` | `sk-...` |
| **Anthropic** | `claude-sonnet-4` | `sk-ant-...` |
| **DeepSeek** | `deepseek-v4-pro[1m]` | `sk-...` |
| **Custom** | Any model | Any base URL |

The AI analyzes each task's title, description, and pay rate against your preferred categories to decide whether to apply.

---

## Configuration

All configuration is stored locally and persists across sessions.

| Option | Default | Description |
|--------|---------|-------------|
| `syncInterval` | 30 min | How often to check for new tasks |
| `autoApplyEnabled` | false | Automatically apply for matching tasks |
| `maxConcurrentTasks` | 3 | Maximum simultaneous task applications |
| `minPayRate` | $20/hr | Minimum hourly rate to consider |
| `preferredCategories` | AI Training, Reasoning, Evaluation | Task types to target |

---

## Architecture

```
HandshakeAuto/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Live monitoring UI
│   │   └── SettingsPage.tsx    # Configuration UI
│   ├── engine/
│   │   ├── ai.ts              # AI provider abstraction
│   │   ├── handshake.ts       # Handshake AI integration
│   │   └── simulator.ts       # Task execution simulator
│   ├── store/
│   │   ├── settingsStore.ts   # Persisted settings (Zustand)
│   │   └── taskStore.ts       # Task + stats + activity state
│   ├── types/index.ts         # Full type definitions
│   ├── App.tsx                # Shell with sidebar navigation
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind + custom components
├── src-tauri/
│   ├── src/
│   │   ├── lib.rs            # Tauri commands and app setup
│   │   └── main.rs           # Windows entry point
│   ├── icons/                # App icons
│   ├── Cargo.toml            # Rust dependencies
│   ├── build.rs              # Tauri build script
│   └── tauri.conf.json       # Tauri configuration
├── .github/workflows/deploy.yml  # CI → GitHub Pages
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Desktop Shell** | [Tauri v2](https://v2.tauri.app/) (Rust + WebView) |
| **Frontend** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build** | [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com/) |
| **State** | [Zustand](https://github.com/pmndrs/zustand) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## Development

### Prerequisites

- **Rust** — [rustup.rs](https://rustup.rs/) (`curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`)
- **Node.js 18+** — [nodejs.org](https://nodejs.org/)
- **macOS:** Xcode Command Line Tools (`xcode-select --install`)
- **Linux:** `sudo apt install libwebkit2gtk-4.1-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev libsoup-3.0-dev`

### Setup

```bash
git clone https://github.com/s4lmon778/HandshakeAuto.git
cd HandshakeAuto
npm install
```

### Dev Commands

```bash
# Web dev server (hot reload)
npm run dev

# Type check
npx tsc --noEmit

# Build web version
npm run build

# Build desktop app (.exe, .dmg, .AppImage)
npm run tauri build

# Preview production web build
npm run preview
```

---

## Privacy

- **No data leaves your machine** except AI API calls to the provider you configure
- **Credentials are stored locally** — never sent to any third party
- **No analytics, no tracking, no telemetry**
- **Open source** — audit the code yourself

---

## License

MIT — see [LICENSE](LICENSE).

---

<p align="center">
  Made with ❤️ for the Handshake AI community
</p>
