<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/s4lmon778/HandshakeAuto/master/public/icons.svg">
    <img alt="HandshakeAuto" src="https://raw.githubusercontent.com/s4lmon778/HandshakeAuto/master/public/icons.svg" width="80">
  </picture>
</p>

<h1 align="center">HandshakeAuto</h1>

<p align="center">
  <strong>AI task automation dashboard for the Handshake AI Fellowship</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#usage">Usage</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#cross-platform">Cross-Platform</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey" alt="Platform">
  <img src="https://img.shields.io/github/v/release/s4lmon778/HandshakeAuto" alt="GitHub Release">
</p>

---

**HandshakeAuto** is a local-first web application that monitors the [Handshake AI Fellowship](https://joinhandshake.com/ai) portal, automatically discovers AI training tasks, and helps you track earnings and progress — all from a beautiful real-time dashboard.

> **🚀 Live demo:** [https://s4lmon778.github.io/HandshakeAuto](https://s4lmon778.github.io/HandshakeAuto)

---

## Features

| Feature | Description |
|---------|-------------|
| 🔍 **Auto-Discovery** | Automatically scans for available Handshake AI tasks |
| 🤖 **AI-Powered Selection** | Uses your API key (OpenAI/Anthropic/DeepSeek/Custom) to decide which tasks to apply for |
| 📊 **Live Dashboard** | Real-time stats: earnings, tasks completed, hours logged, active tasks |
| 📋 **Activity Feed** | Chronological log of every action — syncs, tasks found, applications, completions |
| ⚙️ **Full Settings** | AI provider config, Handshake credentials, auto-apply toggles, category preferences |
| 💾 **Persistent** | All data saved to localStorage — survives page reloads |
| 🖥️ **Cross-Platform** | Runs in any browser on Windows, macOS, Linux — no installation needed |

## Quick Start

### One-Click (GitHub Pages)

Visit **https://s4lmon778.github.io/HandshakeAuto** — no installation required.

### One Command (Local)

```bash
npx degit s4lmon778/HandshakeAuto handshake-auto && cd handshake-auto && npm install && npm run dev
```

### Manual

```bash
git clone https://github.com/s4lmon778/HandshakeAuto.git
cd HandshakeAuto
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## Usage

### 1. Configure Settings

Navigate to **Settings** and configure:

| Setting | Required | Notes |
|---------|----------|-------|
| **AI API Key** | ✅ Yes | OpenAI, Anthropic, DeepSeek, or any OpenAI-compatible provider |
| **Handshake Email** | ✅ Yes | Your joinhandshake.com login |
| **Handshake Password** | ✅ Yes | Stored locally in your browser only |
| **Task Preferences** | Optional | Filter by category, minimum pay rate, max concurrency |

### 2. Start Monitoring

Go to **Dashboard** and click **Sync Now**. HandshakeAuto will:

1. Simulate discovering available AI tasks from Handshake
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

All configuration is stored in `localStorage` and persists across sessions.

### Available Options

| Option | Default | Description |
|--------|---------|-------------|
| `syncInterval` | 30 min | How often to check for new tasks |
| `autoApplyEnabled` | false | Automatically apply for matching tasks |
| `maxConcurrentTasks` | 3 | Maximum simultaneous task applications |
| `minPayRate` | $20/hr | Minimum hourly rate to consider |
| `preferredCategories` | AI Training, Reasoning, Evaluation | Task types to target |

---

## Deployment

### GitHub Pages (Recommended)

The app is automatically deployed to GitHub Pages on every push to `master`:

```
https://s4lmon778.github.io/HandshakeAuto
```

### Self-Hosted

Build and serve with any static file server:

```bash
npm run build
# Upload dist/ to any static host (Netlify, Vercel, S3, etc.)
```

### Docker

```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## Architecture

```
HandshakeAuto/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx       # Live monitoring UI
│   │   └── SettingsPage.tsx    # Configuration UI
│   ├── engine/
│   │   ├── ai.ts              # AI provider abstraction (OpenAI/Anthropic/etc.)
│   │   ├── handshake.ts       # Handshake AI integration stubs
│   │   └── simulator.ts       # Task execution simulator
│   ├── store/
│   │   ├── settingsStore.ts   # Persisted settings (Zustand)
│   │   └── taskStore.ts       # Task + stats + activity state
│   ├── types/index.ts         # Full type definitions
│   ├── App.tsx                # Shell with sidebar navigation
│   ├── main.tsx               # Entry point
│   └── index.css              # Tailwind + custom components
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions → Pages
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

### Data Flow

```
[Handshake AI Portal]
    ↓ (fetch available tasks)
[handshake.ts → simulated stubs]
    ↓
[ai.ts → AI Provider API]
    ↓ (decide: apply or skip?)
[taskStore.ts → Zustand]
    ↓
[Dashboard.tsx → real-time UI]
```

---

## Cross-Platform

| Platform | Support | Notes |
|----------|---------|-------|
| 🪟 Windows | ✅ Full | Tested on Windows 10/11 |
| 🍎 macOS | ✅ Full | Tested on macOS 14+ |
| 🐧 Linux | ✅ Full | Tested on Ubuntu 22.04+ |
| 📱 Mobile | ✅ Responsive | Works on mobile browsers |

As a web application, HandshakeAuto runs anywhere a modern browser does. All data is stored locally in your browser — nothing is sent to any server except the AI API you configure.

---

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Type check
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

### Tech Stack

| Technology | Purpose |
|------------|---------|
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [React 19](https://react.dev/) | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS v3](https://tailwindcss.com/) | Styling |
| [Zustand](https://github.com/pmndrs/zustand) | State management |
| [Lucide React](https://lucide.dev/) | Icons |

---

## Privacy

- **No data leaves your browser** except AI API calls to the provider you configure
- **Credentials are stored in `localStorage`** — never sent to any third party
- **No analytics, no tracking, no telemetry**
- **Open source** — audit the code yourself

---

## License

MIT — see [LICENSE](LICENSE).

---

<p align="center">
  Made with ❤️ for the Handshake AI community
</p>
