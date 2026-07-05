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

## 2. Upload the code

Use whichever you prefer:

- **Git (recommended):** hPanel → **Git** → deploy this repository into your app folder.
- **File Manager / SFTP:** upload the whole project **except** `node_modules/` and `dist/`
  (those are built on the server).

## 3. Create the Node.js application (hPanel)

hPanel → **Advanced → Node.js** → **Create application**:

| Field | Value |
|---|---|
| Node.js version | **18** or newer |
| Application root | the folder you uploaded to (e.g. `optizone`) |
| Application URL | your domain / subdomain |
| Application startup file | **`app.js`** |

Create it. Hostinger provisions the app and shows a control panel for it.

## 4. Set environment variables

In the Node.js app panel, add these **environment variables** (▸ *Environment variables*):

```
NODE_ENV=production
ADMIN_USERNAME=your-admin-name
ADMIN_PASSWORD=a-strong-password
JWT_SECRET=a-long-random-string-change-me
USE_MYSQL=true
DB_HOST=localhost
DB_PORT=3306
DB_NAME=u123456789_optizone
DB_USER=u123456789_admin
DB_PASSWORD=your-db-password
```

> Do **not** commit real secrets to git. `.env.example` lists every variable.

## 5. Install dependencies & build the frontend

In the Node.js app panel use **Run NPM install**, then open the app's terminal
(or hPanel's terminal) in the app root and run the production build:

```bash
npm install        # if not already run by the panel
npm run build      # compiles the React app into dist/
```

`npm run build` must be run whenever you change frontend code. The server serves
the compiled `dist/` folder.

## 6. Start / restart

Click **Restart** in the Node.js app panel. Visit:

- **Storefront:** `https://yourdomain.com/`
- **Admin panel:** `https://yourdomain.com/admin` (log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`)

On first boot the app creates its tables and seeds the default catalog/content.
Everything you then change in the admin panel is saved to MySQL.

---

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
