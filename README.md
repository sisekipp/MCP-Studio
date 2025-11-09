# MCP Studio

Eine Desktop-Anwendung zum Testen und Debuggen von MCP (Model Context Protocol) Servern.

## Features

- 🖥️ **Electron Desktop App** - Native Desktop-Anwendung für macOS, Windows und Linux
- ⚡ **Vite + React** - Schnelle Entwicklung mit moderner Toolchain
- 🎨 **Shadcn UI + Tailwind CSS** - Modernes Design System
- 🧭 **TanStack Router** - File-based Routing für eine strukturierte App
- 🔌 **MCP Protokoll Support** - Unterstützt alle 3 MCP Transport-Protokolle:
  - stdio
  - SSE (Server-Sent Events)
  - Streamable HTTP

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Bundler**: Vite 5
- **Desktop**: Electron 33
- **Routing**: TanStack Router (file-based)
- **Styling**: Tailwind CSS 4 + Shadcn UI
- **MCP SDK**: @modelcontextprotocol/sdk

## Entwicklung

### Prerequisites

- Node.js >= 22.7.5
- npm

### Installation

\`\`\`bash
npm install
\`\`\`

### Development Server starten

\`\`\`bash
npm run dev
\`\`\`

Die App startet automatisch als Electron Desktop-App mit Hot-Reload.

### Build für Production

\`\`\`bash
npm run build
\`\`\`

Erstellt eine produktionsreife App im `release` Verzeichnis für deine Plattform.

## Projektstruktur

\`\`\`
MCP_Studio/
├── electron/           # Electron main & preload scripts
│   ├── main.ts        # Electron main process
│   └── preload.ts     # Preload script für IPC
├── src/
│   ├── routes/        # TanStack Router file-based routes
│   │   ├── __root.tsx # Root layout mit Navigation
│   │   ├── index.tsx  # Dashboard
│   │   ├── servers.tsx    # Server Management
│   │   ├── resources.tsx  # Resources Inspector
│   │   ├── prompts.tsx    # Prompts Testing
│   │   ├── tools.tsx      # Tools Testing
│   │   └── logs.tsx       # Logs & Notifications
│   ├── components/    # React Components
│   │   └── ui/       # Shadcn UI Components
│   ├── lib/          # Utilities
│   │   └── utils.ts  # Helper functions
│   ├── main.tsx      # React entry point
│   └── index.css     # Global styles
├── public/           # Static assets
├── vite.config.ts    # Vite configuration
├── package.json      # Dependencies & scripts
└── tsconfig.json     # TypeScript configuration
\`\`\`

## Features (Geplant)

### Dashboard
- Übersicht über verbundene Server
- Statistiken zu Resources, Tools und Prompts

### Server Management
- Verbindung zu MCP Servern über stdio, SSE oder HTTP
- Konfiguration von Command-line Arguments
- Verwaltung von Environment Variables

### Resources Inspector
- Anzeige aller verfügbaren Resources
- MIME-Type und Metadaten
- Content-Inspektion
- Subscriptions testen

### Prompts Testing
- Anzeige verfügbarer Prompt Templates
- Testen mit custom Arguments
- Vorschau der generierten Messages

### Tools Testing
- Übersicht aller verfügbaren Tools
- Schema und Beschreibungen
- Interaktives Testing
- Ergebnis-Anzeige

### Logs & Notifications
- Alle Server-Logs in Echtzeit
- Notifications von verbundenen Servern
- Filter und Search

## Inspiration

Basiert auf dem offiziellen [MCP Inspector](https://github.com/modelcontextprotocol/inspector), erweitert als vollwertige Desktop-Anwendung.

## Lizenz

MIT
