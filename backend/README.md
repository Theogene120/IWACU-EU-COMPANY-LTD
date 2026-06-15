# Iwacu EU — Backend

Express + PostgreSQL API server. Runs independently of the Vite frontend.

## Prerequisites

- Node.js 18+
- PostgreSQL 14+

## One-time setup

### 1. Create the database

```sql
CREATE DATABASE iwacu_db;
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and set DATABASE_URL
```

Minimum `.env`:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/iwacu_db
PORT=4000
```

### 3. Install dependencies

From the **project root**:
```bash
npm run backend:install
# or equivalently: cd backend && npm install
```

### 4. Import existing data from db.json

Run the seed script **while `db.json` still exists** at the project root:

```bash
npm run backend:seed
# or: cd backend && npm run seed
```

This creates all tables and imports the 89 products, categories, orders, messages,
notifications, analytics, activity log, and site settings from `db.json`.

After a successful seed you will see:
```
[migrate] Tables created/verified
[seed] 89 products
[seed] 5 categories
[seed] 3 orders
...
[seed] ✓ All data imported from db.json. You can now delete db.json.
```

You can then safely **delete `db.json`** from the project root — it is no longer used.

### 5. Move any existing uploaded images (if present)

If you previously uploaded images (stored in `public/uploads/`), they are already
served from that location. No action needed — the backend reads from `../public/uploads`
by default (one directory above `backend/`).

## Running

### Development

Open **two terminals**:

```bash
# Terminal 1 — backend (port 4000)
npm run dev:be

# Terminal 2 — frontend (port 5173, proxies /api and /uploads to port 4000)
npm run dev
```

Then open http://localhost:5173.

### Production

```bash
# Build the frontend
npm run build

# Start the backend (serves API + static frontend from dist/)
NODE_ENV=production npm --prefix backend run start
```

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET/PUT | `/api/products` | List or bulk-sync all products |
| POST/PUT/DELETE | `/api/products/:id` | Create / update / delete one product |
| GET/PUT | `/api/categories` | List or bulk-sync categories |
| GET/PUT | `/api/orders` | List or bulk-sync all orders |
| POST/PUT/DELETE | `/api/orders/:id` | Create / update / delete one order |
| GET/PUT | `/api/messages` | List or bulk-sync messages |
| POST/PUT/DELETE | `/api/messages/:id` | Create / update / delete one message |
| GET/PUT | `/api/notifications` | List or bulk-sync notifications |
| POST/PUT | `/api/notifications/:id` | Create / mark-read one notification |
| GET/PUT | `/api/analytics` | Get or update analytics |
| GET/PUT/POST | `/api/activity-log` | Get, bulk-sync, or add one log entry |
| GET/PUT | `/api/site-settings` | Get or update site settings |
| POST | `/api/upload` | Upload an image (multipart/form-data, field: `image`) |
| POST | `/api/pay` | Payment placeholder |
