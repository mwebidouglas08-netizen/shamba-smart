# 🌾 Shamba Smart — AI-Powered Agriculture & Food Security Platform

A fullstack AI-powered farming assistant built for smallholder farmers in Kenya and East Africa.

## Features
- **AI Farm Advisor** — Ask agricultural questions, get expert AI responses
- **Crop Disease Detector** — Diagnose crop diseases from symptoms
- **Planting Calendar** — Season-optimized planting guides
- **Market Prices** — Live crop price dashboard
- **Admin Dashboard** — Manage prices, crops, and view AI query logs

## Quick Start

### Local Development
```bash
# Install server dependencies
npm install

# Start the server (serves client + admin in production)
npm start

# Build frontend apps
npm run build
```

### Deploy to Railway
1. Push this repo to GitHub
2. Create a new Railway project → Deploy from GitHub repo
3. Add environment variables:
   - `ANTHROPIC_API_KEY` (required)
   - `JWT_SECRET` (change to a random string)
   - `ADMIN_USERNAME` (default: admin)
   - `ADMIN_PASSWORD` (default: shamba2024)
4. Optionally add a PostgreSQL plugin (Railway dashboard → + New → Database → PostgreSQL)
   - `DATABASE_URL` will be set automatically
5. Railway auto-detects Node.js, runs `npm run build` then `npm start`

### Access
- **Farmer App**: `https://your-app.railway.app/`
- **Admin Dashboard**: `https://your-app.railway.app/admin/`
  - Default login: `admin` / `shamba2024`

## Tech Stack
- **Backend**: Node.js + Express
- **Frontend**: React + Vite
- **Admin**: React + Vite (at /admin/)
- **Database**: PostgreSQL (optional, falls back to in-memory)
- **AI**: Anthropic Claude API
