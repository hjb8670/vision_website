# Deploying Vision to visionprediction.com

## The setup

Your GoDaddy plan is shared/cPanel hosting. That's fine for serving the static frontend, but it can't run a persistent Node.js process reliably or give you a real PostgreSQL server — shared cPanel plans are built around PHP + MySQL. Forcing this app onto it would mean fighting the host the whole way.

The split that actually works, using what you already have plus one free-tier service:

| Piece | Where | Why |
|---|---|---|
| Frontend (static React build) | **GoDaddy** — the hosting you're already paying for | It's just HTML/CSS/JS files. Shared hosting is built for exactly this. |
| Backend (NestJS API) + PostgreSQL | **Railway** (railway.app) | One platform, free tier, runs Node + Postgres together, no server admin required. |
| Domain | **GoDaddy** — stays put | You only add one DNS record. No domain transfer needed. |

End state: `visionprediction.com` serves the site from GoDaddy; `api.visionprediction.com` serves the API from Railway; GoDaddy's DNS just points the `api` subdomain at Railway.

I've already made the code changes this requires (configurable API URL, CORS locked to your domain, SPA routing fallback, deploy scripts) — that's done and committed. Everything below is manual dashboard work I can't do for you since it needs your GitHub/Railway/GoDaddy logins.

---

## Part 1 — Put the code on GitHub

Railway deploys from a GitHub repo, so the code needs to live there first.

1. Go to [github.com/new](https://github.com/new), create a new **private** repository (e.g. `vision-prediction-market`). Don't initialize it with a README.
2. In a terminal, from `D:\External Projects\vision-react-website`:
   ```
   git remote add origin https://github.com/<your-username>/vision-prediction-market.git
   git push -u origin master
   ```
3. GitHub will prompt you to sign in (browser popup or a personal access token, depending on your git setup). Complete that and confirm the push succeeds.

---

## Part 2 — Deploy the backend + database on Railway

1. Go to [railway.app](https://railway.app) → sign up (GitHub login is easiest, one click).
2. **New Project → Provision PostgreSQL.** Railway spins up a Postgres instance and gives it a `DATABASE_URL` automatically — you don't type this yourself.
3. In the same project, **New Service → Deploy from GitHub repo** → pick the repo you just pushed.
4. Open the new service's **Settings**:
   - **Root Directory**: `backend` (this is a monorepo — Railway needs to know the backend lives in a subfolder)
   - **Start Command**: `npx prisma migrate deploy && npm run start:prod`
     (running migrate on every deploy is safe — it only applies migrations that haven't run yet)
5. Open the service's **Variables** tab and add:
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | Click "Add Reference" → select the Postgres service's `DATABASE_URL`. Don't retype it — reference it so it stays in sync. |
   | `JWT_SECRET` | A long random string — e.g. generate one with `openssl rand -hex 32`, or any password generator. Not the dev placeholder. |
   | `FRONTEND_URL` | `https://visionprediction.com` |
6. Deploy. Watch the build logs — first deploy takes a minute or two (npm install, prisma generate via postinstall, migrate deploy, nest build).
7. Once it's live, seed the database once: in the service, open the **Shell** (or use the Railway CLI: `railway run npm run db:seed` after `railway link`ing the project). This loads the 14 categories, 37 markets, and demo accounts — skip this if you'd rather launch with an empty slate and use the admin panel instead.
8. Railway gives the service a public URL like `backend-production-xxxx.up.railway.app`. Test it:
   ```
   curl https://backend-production-xxxx.up.railway.app/api/categories
   ```
   You should get back JSON, not an error.
9. In **Settings → Networking → Custom Domain**, add `api.visionprediction.com`. Railway will show you a CNAME target (something like `xxxx.up.railway.app`) — copy it, you need it in the next part.

---

## Part 3 — Point api.visionprediction.com at Railway

This is the only DNS change needed; the root domain keeps pointing at GoDaddy hosting like it already does.

1. Log into GoDaddy → **My Products** → find visionprediction.com → **DNS** (or "Manage DNS").
2. **Add a record**:
   - Type: `CNAME`
   - Name/Host: `api`
   - Value/Points to: the Railway target from step 9 above
   - TTL: leave default
3. Save. DNS propagation is usually fast (minutes) but can take up to an hour.
4. Back in Railway, the custom domain should flip to "Active" once it detects the DNS record, and it auto-provisions an SSL certificate — no action needed from you there.
5. Verify: `curl https://api.visionprediction.com/api/categories` should return the same JSON as the railway.app URL did.

---

## Part 4 — Build the frontend and upload to GoDaddy

1. Locally, in `frontend/`, create a file named `.env.production` (copy `.env.production.example`) containing:
   ```
   VITE_API_URL=https://api.visionprediction.com/api
   ```
2. Build:
   ```
   cd frontend
   npm run build
   ```
   This produces `frontend/dist/` — that folder's *contents* (not the folder itself) are what get uploaded.
3. Upload to GoDaddy. Two ways:
   - **cPanel File Manager**: zip the contents of `dist/` locally, upload the zip via File Manager into `public_html`, then extract it there and delete the zip.
   - **FTP**: cPanel → FTP Accounts for credentials, connect with FileZilla (or similar), upload everything inside `dist/` into `public_html`.
4. **Important**: `dist/` contains a `.htaccess` file (it's what makes page refreshes on routes like `/markets` work instead of 404ing). Dotfiles are hidden by default in most FTP clients and some file managers — make sure "show hidden files" is on so it actually gets uploaded, and confirm it landed in `public_html` alongside `index.html`.
5. In cPanel, check **Security → SSL/TLS Status** and make sure AutoSSL is active for visionprediction.com (GoDaddy usually does this automatically, but confirm — the site should load under `https://`, not just `http://`).

---

## Part 5 — Go live checklist

- [ ] `https://visionprediction.com` loads the homepage
- [ ] Refreshing on `https://visionprediction.com/markets` doesn't 404 (confirms `.htaccess` uploaded correctly)
- [ ] Register a new account — confirms frontend → API → database all connected
- [ ] Browse markets, open one, place a trade — confirms the AMM/order flow works end to end in production
- [ ] Open browser dev tools → Network tab while doing the above — no CORS errors (would show as blocked requests to `api.visionprediction.com`)
- [ ] `https://api.visionprediction.com/api/categories` returns JSON directly

If a step fails, the two most likely culprits are: DNS hasn't propagated yet (wait and retry), or `FRONTEND_URL` on Railway doesn't exactly match how you're loading the site (`https://visionprediction.com` vs `https://www.visionprediction.com` are different origins for CORS purposes — add both, comma-separated, if you use `www`).

---

## Cost

- **GoDaddy**: whatever you're already paying for hosting + domain — nothing new.
- **Railway**: free tier includes a monthly usage credit that comfortably covers a low-traffic demo (small Postgres instance + one Node service). If the sponsor demo gets real traffic or you keep it running long-term, budget roughly $5–10/month once the free credit runs out.

---

## What I did in the code to make this possible

For your own reference — these are already committed:

- `frontend/src/lib/api.ts` — API base URL now reads `VITE_API_URL` at build time instead of the hardcoded dev-only `/api` proxy path.
- `frontend/public/.htaccess` — SPA fallback so client-side routes survive a page refresh on Apache (GoDaddy's server).
- `backend/src/main.ts` — CORS origin now reads `FRONTEND_URL` in production instead of allowing any origin.
- `backend/package.json` — added `postinstall` (runs `prisma generate` automatically), `db:migrate:deploy`, and `db:seed` scripts for a clean deploy pipeline.
