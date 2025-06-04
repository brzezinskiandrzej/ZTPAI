
# Mood Music 🎵🤖

> **“Type a mood, get a mix.”**  
> Full‑stack web application that generates song playlists tailored to the listener’s emotion using AI analysis, audio features and TypeORM queries.

---
## Project vision

*Let the app pick songs that **feel the way you do.***  
A short free-form text (“*I’m exhausted but hopeful*…”) is analysed by
OpenAI.  
The backend:

1. classifies the text into one of seven moods,
2. matches that mood against hard musical profiles (valence, energy,
   keys …),  
3. generates a tailored playlist and stores it in PostgreSQL.

Users can:

* play tracks & autoincrement plays,
* like / unlike tracks,
* view mood history,
* admins can ban users, delete playlists and review events in real-time
  via RabbitMQ.

---

## Functional highlights

| Domain            | What happens                                                                  |
|-------------------|-------------------------------------------------------------------------------|
| **AI endpoint**   | `/api/ai/mood` → returns `{ mood, playlistId }` in ≈ 700 ms                   |
| **Playlist**      | CRUD, “liked” pseudo-playlist, +5 generator (`generatePlaylistForMood`)        |
| **Auth**          | JWT (Bearer) with roles: *user*, *admin*                                       |
| **Admin**         | Users & playlists overview, ban/unban, logs (RabbitMQ consumer)                |
| **Tests**         | 25 unit/e2e tests • 92 % branch coverage                                       |

---
## 🖼 Architecture overview

```mermaid
graph TD
  subgraph Frontend (React + Vite)
    A[Landing Page<br/>+Auth] --> B[Protected App Shell]
    B --> C[Playlist Views]
    B --> D[Admin Panel]
    B --> E[Error Pages 403/404]
  end

  subgraph Backend (Node 18 + Express)
    F[/Express Router/] --> G[Controllers]
    G --> H[Services (Domain)]
    H --> I[(PostgreSQL)]
    G --> J[[Queues (RabbitMQ)]]
    J --> K[Admin Log Consumer]
  end

  C -->|fetchWithAuth| F
  D -->|REST| F
  E -->|on error| C

  subgraph DevOps
    L[docker‑compose.yml] --> M[backend container]
    L --> N[frontend container]
    L --> O[rabbitmq container]
    M --> I
  end
```

---

## 🚀 Local development

```bash
# 1. Clone repo with both branches
git clone <repo-url> ZTPAI && cd ZTPAI

# 2. Checkout branches into sub‑folders
git worktree add frontend frontendbranch
git worktree add backend  backendbranch

# 3. Frontend
cd frontend
cp .env.example .env     # adjust API_URL if needed
npm i && npm run dev     # http://localhost:5173

# 4. Backend
cd ../backend
cp .env.example .env.test .env
npm i
npm run dev              # http://localhost:3000
# seed database (optional)
npx ts-node src/database/seeders/seeddata.ts
```

> **PostgreSQL 15** expected on `localhost:5432` (credentials in `.env`).  
> RabbitMQ is optional in dev – queues are mocked when `RABBIT_DISABLED=1`.

---

## 🐳 Production with Docker Compose

```bash
docker compose up --build -d
# →  frontend : http://localhost
# →  backend  : http://localhost/api
# →  swagger  : http://localhost/api/docs
# →  rabbit   : http://localhost:15672 (guest/guest)
```

The compose file creates four services:

| Service      | Port | Notes |
|--------------|------|-------|
| `postgres`   | 5432 | persisted volume `db-data` |
| `rabbit`     | 5672 / 15672 | AMQP + management UI |
| `backend`    | 3000 → 80 | Node 18, runs migrations & queues |
| `frontend`   | 80         | Nginx serving static build |

---

## 🛠 Tech stack & rationale

| Layer          | Technology                     | Why this choice? |
|----------------|--------------------------------|------------------|
| **Frontend**   | React + Vite, React‑Router 6, Tailwind CSS, zustand | Fast DX, superior code‑splitting, small runtime, unopinionated state |
| **Backend**    | Node 18, Express 4, TypeORM 0.3 | Familiar ecosystem, decorators, migrations, relational mapping |
| **Database**   | PostgreSQL 15                  | JSON support, free full‑text search, dev‑friendly |
| **AI**         | OpenAI Chat Completions        | Quick prototyping, multilingual sentiment |
| **Queues**     | RabbitMQ                       | Reliable fan‑out for admin audit logs |
| **Auth**       | JSON Web Tokens (JWT)          | Stateless, easy to test, mobile‑friendly |
| **Tests**      | Jest, Supertest, ts‑jest       | Single runner for unit + e2e, good TS support |
| **DevOps**     | Docker Compose                 | One‑liner spin‑up, parity with CI |
| **CI**         | GitHub Actions *(example yaml)*| Lint ➜ Test ➜ Build & Push |

---

## 🧪 Running the test‑suite

```bash
cd backend
npm test            # runs 25 Jest tests, ~12 s
npm run coverage    # generates /coverage/lcov-report
```

> E2E tests boot an in‑memory Postgres using `sqlite` driver – fast & isolated.

---

## 📄 API reference

Once backend is running visit **`/api/docs`** for interactive Swagger UI generated from JSDoc annotations.

---

## 👤 Default creds (dev seeds)

| Role  | Email                | Password |
|-------|----------------------|----------|
| user  | andrew@example.com   | secret   |
| admin | admin@example.com    | secret   |

---

## © License

MIT – use freely, star gladly ✨
