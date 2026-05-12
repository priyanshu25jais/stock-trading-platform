# Zerodha clone (monorepo)

| App        | Stack        | Local port | Role                          |
| ---------- | ------------ | ---------- | ----------------------------- |
| `frontend` | React (CRA) | 3000       | Marketing / landing pages     |
| `dashboard`| React (CRA) | 3001       | Trading UI; calls backend API |
| `backend`  | Express + MongoDB | 3002 | REST API for holdings & orders |

---

## Local development

1. **MongoDB** — Create a cluster (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas)) and note the connection string.

2. **Backend**

   ```bash
   cd backend
   cp env.example .env
   # Edit .env: set MONGO_URL=...
   npm install
   npm run dev
   ```

3. **Frontend** (new terminal)

   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Dashboard** (new terminal)

   ```bash
   cd dashboard
   cp .env.example .env
   # Default REACT_APP_API_URL=http://localhost:3002 is used if .env is omitted
   npm install
   npm start
   ```

The dashboard reads **`REACT_APP_API_URL`** from `dashboard/src/api.js` (defaults to `http://localhost:3002`).

---

## Deploy overview (one Render + one Netlify)

| Service | Platform | What gets deployed |
| ------- | -------- | ------------------ |
| **API** | **Render** | `backend/` — see [`render.yaml`](render.yaml) |
| **Website** | **Netlify** | `frontend/` only — root [`netlify.toml`](netlify.toml) sets `base = "frontend"` |

Connect **one** Netlify site to this repo; you do **not** need to set a base directory in the UI (the root `netlify.toml` handles it).

The **dashboard** (`dashboard/`) is for local use unless you add a **second** Netlify site with base directory `dashboard` and `REACT_APP_API_URL` set to your Render API URL (see [`dashboard/netlify.toml`](dashboard/netlify.toml)).

---

## 1. Backend on Render

### Option A — Blueprint (this repo)

1. Push this repo to GitHub.
2. In Render: **New → Blueprint** → connect the repo → Render reads [`render.yaml`](render.yaml).
3. When prompted, add secret **`MONGO_URL`** (Atlas connection string).
4. After deploy, copy the service URL, e.g. `https://zerodha-backend.onrender.com`.

### Option B — Manual Web Service

1. **New → Web Service** → connect repo.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start` (runs `node index.js`)
5. **Environment:** `MONGO_URL` = your Atlas URI (add `0.0.0.0/0` or Render outbound IPs in Atlas Network Access).
6. **Instance type:** Free is fine; free dynos **spin down** after idle — first request may be slow.

Health check: `GET /` returns JSON `{ "ok": true, ... }`.

---

## 2. Frontend on Netlify (single site, repo root)

1. Push this repo to GitHub (see **Git** at the end of this file).
2. Netlify: **Add new site → Import from Git** → select the repo.
3. Leave **base directory** empty; Netlify uses the root [`netlify.toml`](netlify.toml) (`base = "frontend"`, publish `build`).
4. Deploy. You get the marketing site on `*.netlify.app`.

No environment variables are required for the landing app.

---

## 3. Optional: dashboard on a second Netlify site

1. **Add new site → Import from Git** → same repo.
2. **Base directory:** `dashboard`
3. **Build:** `npm run build` · **Publish:** `build`
4. Set **`REACT_APP_API_URL`** to your Render API URL, then redeploy.

---

## CORS and security

The API uses `cors()` with default **allow all origins**, so Netlify frontends can call Render. For production hardening, restrict `origin` to your two Netlify URLs and keep HTTPS only.

---

## Troubleshooting

- **Dashboard shows empty holdings / network error** — Check `REACT_APP_API_URL` matches the live Render URL exactly; trigger a **Clear cache and deploy** on Netlify after changing env.
- **Mongo errors on Render** — Confirm Atlas **Network Access** allows connections from the internet (or Render’s egress).
- **Manifest / icon errors** — Ensure `public/manifest.json` and referenced icons exist under each CRA app’s `public/` folder.

---

## Git: commit and push

Do **not** commit `backend/.env` (secrets). It is listed in `.gitignore`; if Git still tracks an old copy, run `git rm --cached backend/.env` once.

```bash
git add .
git reset HEAD backend/.env   # skip secrets if they were staged
git status                   # confirm .env is not staged
git commit -m "Add Render + Netlify deploy config and app updates"
git push origin main
```

Use your branch name if it is not `main`.
