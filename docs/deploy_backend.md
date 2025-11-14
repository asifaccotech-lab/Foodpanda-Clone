Deploying the Backend API (Recommended)
=======================================

Goal
----
Expose the backend (Express + Postgres) under a public URL and wire the frontend to it.

Option A: Render (managed hosting)
----------------------------------
Prerequisites:
- Git repo containing this project (backend/ directory at root)
- Render account

Steps:
1) Create a Postgres database on Render:
   - Name: foodapp-db
   - Note the "Internal Database URL" (or external if needed)

2) Create a Web Service for the backend:
   - Root Directory: backend
   - Environment: Node
   - Build Command: npm ci
   - Start Command: node src/index.js
   - Port: 10000 (Render sets PORT; we read PORT from env)

3) Environment variables (Render's Service):
   - NODE_ENV=production
   - PORT=10000
   - JWT_SECRET: generate a strong secret (e.g., via Render's "Generate")
   - CORS_ORIGIN=https://YOUR-STATIC-FRONTEND-DOMAIN
   - DATABASE_URL: paste the database's connection string
     - If using Render Postgres, use the "External Database URL" for public access or "Internal" if in same network.

4) Auto-deploy: enable (optional)

5) Deploy the service. On success, you’ll get a public URL, e.g.:
   - https://foodapp-backend.onrender.com
   The API base will be: https://foodapp-backend.onrender.com/api

Option B: Fly.io / Railway / Heroku
-----------------------------------
Similar approach:
- Provision Postgres (Railway or Neon.tech)
- Set DATABASE_URL, JWT_SECRET, CORS_ORIGIN
- Start command: node src/index.js
- Ensure PORT from platform is honored via env (we use PORT)

Frontend Wiring
---------------
- For CRA build, set REACT_APP_API_BASE_URL to the public API base (e.g., https://foodapp-backend.onrender.com/api) before building.
- For the static demo deployment (frontend/public), we also support a runtime global:
  - In frontend/public/index.html, we set:
    window.__API_BASE_URL__ = 'http://localhost:4000/api';
  - Update this to your public API base:
    window.__API_BASE_URL__ = 'https://foodapp-backend.onrender.com/api';

CORS
----
- Set CORS_ORIGIN in backend to your deployed frontend domain, e.g.:
  - CORS_ORIGIN=https://YOUR-STATIC-FRONTEND-DOMAIN

Seeding
-------
- In production, it's safer to disable SEED_ON_START:
  - SEED_ON_START=false
- Run a one-time seed locally if needed, or implement admin tools to seed.

Verification
------------
- Health check: GET /health
- Test: GET /api/restaurants should return paginated list
- Auth: POST /api/auth/login with admin@foodapp.local and admin123 (if seeded)

Troubleshooting
---------------
- Database SSL: We enable SSL for DATABASE_URL; adjust dialectOptions in backend/src/config/database.js if your provider requires different SSL settings.
- CORS errors: verify CORS_ORIGIN matches the exact frontend origin.
- Port conflicts: The backend reads PORT env. Platforms set this automatically.

Need me to deploy for you?
--------------------------
Provide:
- Hosting platform of choice (Render recommended)
- A Postgres connection string (or permission to provision one)
- Desired frontend domain
I’ll wire the environment variables, build, and update the frontend config to point to the public API.