# SIH25008 — Disaster Preparedness and Response Education System (Web App)

A complete, **real working** full‑stack web application designed for schools/colleges to teach and practice disaster preparedness with region‑specific alerts, virtual drills, gamified learning, an emergency directory, and an admin dashboard.

## Tech Stack
- **Backend**: Node.js, Express, SQLite (better-sqlite3), Socket.IO
- **Frontend**: React (Vite), Tailwind CSS, Zustand, Axios, Recharts
- **Build/Run**: One repo, one command. Serves the built frontend from the backend in production.

## Features
- Interactive learning **modules** (earthquake, flood, fire) with **quizzes** and points/badges
- **Region-specific alerts** (Punjab districts included) + **real-time push** via Socket.IO
- **Virtual drills** with timed steps, participation tracking & scoring
- **Emergency directory** (institution & local contacts)
- **Admin dashboard** with preparedness scores, drill participation, alert stats
- **Role selection** (Student/Teacher/Admin)—simple, no password, for demo purposes
- Mobile-friendly layout; works in Android browsers

> You can extend it easily: add auth, real feeds (NDMA/IMD), multilingual content, PWA install, etc.

## Quick Start

### 1) Install
```bash
# Node.js 18+ recommended
cd sih25008
npm install     # installs server & client
npm run seed    # creates SQLite DB with sample India/Punjab data
```

### 2) Run (Dev)
```bash
npm run dev
```
- Frontend dev server: http://localhost:5173
- API/Socket.IO server: http://localhost:4000
- The client proxies to the server automatically in dev.

### 3) Build & Run (Production)
```bash
npm run build   # builds React to client/dist and copies into server/public
npm start       # serves static build at http://localhost:4000
```

## Environment
The backend reads `PORT` (default 4000). You normally don't need any `.env` to start.

## Folder Structure
```
sih25008/
  server/           # Node + Express + SQLite + Socket.IO
  client/           # React + Vite + Tailwind
  package.json      # root scripts (dev/build/start/seed)
```

## Notes
- This is intentionally **simple but complete**. No external services needed.
- For production, put the server behind a reverse proxy (Caddy/Nginx) and add HTTPS.
- To make it a PWA, add icons to client/public and a manifest (scaffold is ready).
- All code is original and tailored to the SIH25008 problem statement.
```

