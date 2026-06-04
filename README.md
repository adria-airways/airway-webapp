# Airway

## Tech Stack

- Frontend: Vite + React + TailwindCSS
- Backend: Express.js
- Database: PostgreSQL + Drizzle ORM
- Package Manager: pnpm (monorepo)

---

## Requirements

- Node.js 20+
- pnpm

Install pnpm:

```bash
npm install -g pnpm
```

---

## Setup

### 1. Install dependencies

```bash
pnpm install
```

If outdated builds show up:

```bash
pnpm approve-builds
```

---

### 2. Environment variables

Create `.env` file:

```bash
cd packages/db
cp .env.example .env
```

Then fill in required values (`DATABASE_URL`, etc).

---

### 3. Start the app

From the root directory:

```bash
pnpm dev
```

---

## Development

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## Usable Scripts

```bash
pnpm dev        # frontend + backend
pnpm dev:web    # frontend only
pnpm dev:api    # backend only

pnpm db:generate
pnpm db:migrate
pnpm db:studio
```
