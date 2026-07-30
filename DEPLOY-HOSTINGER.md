# Deploying OPTIZONE to Hostinger (Cloud Startup)

This app is a single Node.js process: an Express server (`app.js`) that serves
the built React frontend **and** the content API + admin panel. It stores data
in **MySQL** (with an automatic JSON-file fallback if the DB isn't configured).

Total time: ~15 minutes.

---

## 1. Create a MySQL database (hPanel)

1. hPanel → **Databases → MySQL Databases**.
2. Create a new database and a database user; give the user **all privileges** on it.
3. Note down: **database name**, **username**, **password**, and **host**
   (usually `localhost`). Names look like `u123456789_optizone`.

> **You do NOT need to create any tables.** The app creates them automatically on
> first boot and seeds the storefront catalog. If you'd rather pre-create them
> (or just want to see the structure), open **phpMyAdmin → your database → SQL**
> and paste the contents of [`database.sql`](./database.sql). Don't add a
> `CREATE DATABASE`/`USE` line — you're already inside the database Hostinger made.

## 2. Connect the code with GitHub (hPanel → Git)

1. hPanel → **Advanced → Git** → **Create a new repository**.
2. Paste your GitHub repository URL and the branch you deploy from
   (e.g. `main`), and choose the install path (your app folder, e.g. `optizone`).
   For a private repo, add hPanel's SSH deploy key to GitHub first (**Repo →
   Settings → Deploy keys**).
3. Click **Create**. Hostinger clones the repo into that folder.
4. (Optional) enable **Auto-Deployment**: copy the webhook URL Hostinger shows
   and add it in **GitHub → repo → Settings → Webhooks**. Every push then pulls
   the new code automatically. *Auto-deploy only pulls files — you still rebuild
   the frontend after frontend changes; see step 5 and "Updating after a push".*

> Prefer not to use Git? Upload the whole project via **File Manager / SFTP**
> **except** `node_modules/` and `dist/` (both are built on the server).

## 3. Create the Node.js application (hPanel)

hPanel → **Advanced → Node.js** → **Create application**:

| Field | Value |
|---|---|
| Node.js version | **20.19** or newer (required by Vite 7) |
| Application root | the folder you uploaded to (e.g. `optizone`) |
| Application URL | your domain / subdomain |
| Application startup file | **`app.js`** |

Create it. Hostinger provisions the app and shows a control panel for it.

## 4. Set environment variables

In the Node.js app panel, add these **environment variables** (▸ *Environment variables*):

```
NODE_ENV=production
ADMIN_EMAIL=you@yourdomain.com
ADMIN_PASSWORD=a-strong-password
JWT_SECRET=a-long-random-string-change-me
USE_MYSQL=true
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u123456789_optizone
DB_USER=u123456789_admin
DB_PASSWORD=your-db-password
```

> The admin login is the **owner email** (`ADMIN_EMAIL`) + `ADMIN_PASSWORD`.
> Setting `ADMIN_PASSWORD` in production is required to sign in to the admin —
> if you omit it, a random password is generated (not shown in production logs)
> and admin sign-in stays locked until you set `ADMIN_PASSWORD` or use "Forgot
> password". The storefront/API run regardless. Replace the sample `JWT_SECRET`
> above with the output of `openssl rand -hex 32` — never deploy the placeholder.
>
> Do **not** commit real secrets to git. `.env.example` lists every variable.

## 5. Install dependencies & build the frontend

Open the app's terminal (Node.js app panel → **Terminal**, or hPanel → **Advanced
→ Terminal**) in the app root and run **one command**:

```bash
npm run deploy:build
```

This installs dependencies **including the build tools** and compiles the React
app into `dist/`. Use it instead of the panel's "Run NPM install" button.

> **Why not just `npm install`?** You set `NODE_ENV=production` in step 4, which
> makes a plain `npm install` skip devDependencies — and Vite (the build tool)
> is one of them, so `npm run build` would fail with "vite: not found". The
> `deploy:build` script runs `npm install --include=dev && vite build`, which
> installs Vite and builds in one go. (If you ever see "vite: not found", this is
> the fix.)

`npm run deploy:build` must be run whenever you change **frontend** code. The
server serves the compiled `dist/` folder.

## 6. Start / restart

Click **Restart** in the Node.js app panel. Visit:

- **Storefront:** `https://yourdomain.com/`
- **Admin panel:** `https://yourdomain.com/admin` (log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

On first boot the app creates its tables and seeds the default catalog/content.
Everything you then change in the admin panel is saved to MySQL.

---

## Updating the site after a GitHub push

Every time you push new code to the deploy branch:

1. **Pull the code** — if you enabled Auto-Deployment (step 2) it pulls itself;
   otherwise open hPanel → **Git** and click **Deploy / Pull**.
2. **Rebuild + restart** — in the app terminal run `npm run deploy:build`, then
   click **Restart** in the Node.js app panel.
   - Backend-only change (files under `server/`)? You can skip the rebuild and
     just **Restart**.
   - Frontend change (anything under `src/`, `public/`, styles)? Run
     `npm run deploy:build` so `dist/` is regenerated.

Your MySQL data (products you edited in the admin, orders, bookings, accounts)
is untouched by deploys — it lives in the database, not in the code.

## Notes

- **Uploads.** Product/hero images uploaded in the admin are stored under
  `server/data/uploads/` and served at `/uploads/...`. Keep this folder writable
  (it is by default on Hostinger). Back it up with your database.
- **No MySQL?** If you leave the `DB_*` vars blank (or set `USE_MYSQL=false`), the
  app runs on a JSON file at `server/data/db.json` — handy for a quick test, but
  MySQL is recommended for production.
- **Change the admin password** any time by updating `ADMIN_PASSWORD` and
  restarting. For extra safety you can set `ADMIN_PASSWORD_HASH` to a bcrypt hash
  instead of a plaintext password.
- **Seeing a “Frontend not built yet” message?** Run `npm run build` and restart.
- **Reset content to defaults:** `npm run seed` (leaves orders/bookings intact).
- **Health check:** `GET /api/health` returns `{ ok: true, store: "mysql" | "file" }`.
