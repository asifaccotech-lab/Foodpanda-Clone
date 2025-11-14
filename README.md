Food Delivery App (Foodpanda-inspired)
======================================

Overview
--------
Full-stack food delivery application with modern UI, accessible features, and a Docker-based dev environment. Includes backend (Node.js, Express, Postgres via Sequelize), frontend (React), PWA support, dark mode, i18n, and unit tests.

Key Features
------------
- Clean, modern UI with pink/orange accents
- Fast loading with lazy-loaded images and skeletons
- Accessible (ARIA labels, keyboard navigation)
- Toast notifications
- JWT authentication
- Restaurant listings, menus, cart, orders, tracking
- Admin dashboard
- PWA, Dark mode, Multi-language (English + Spanish)

Quick Start
-----------
1) Prerequisites:
- Docker and Docker Compose installed

2) Run:
- docker-compose up --build

3) Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Database: Postgres on port 5432

Default Admin Credentials
-------------------------
The seed creates an admin user:
- Email: admin@foodapp.local
- Password: admin123

Project Structure
-----------------
- backend: Node.js/Express API server
- frontend: React SPA (PWA + i18n + dark mode)
- docs: API documentation and ER diagram

Environment Variables
---------------------
Set via docker-compose.yml. For local development:
- backend/.env.example lists all variables.

Database
--------
- Postgres 15 (dockerized)
- Sequelize ORM; auto-syncs models on startup; seed data optional via SEED_ON_START=true

API Docs
--------
See docs/api.md for endpoints and examples.

ER Diagram
----------
See docs/er_diagram.md for the schema overview.

Public Deployment (Recommended)
-------------------------------
- The static frontend can be deployed to a CDN; the backend must be hosted on a runtime (e.g., Render).
- See docs/deploy_backend.md for a step-by-step guide to deploy the backend and wire the frontend to the public API.
- The static demo (frontend/public) reads an API base from a runtime global:
  - In frontend/public/index.html, update:
    window.__API_BASE_URL__ = 'https://your-backend-domain/api';

Development Notes
-----------------
- Backend hot-reload via nodemon in Docker
- Frontend dev server in Docker (Fast Refresh)
- PWA service worker is registered only in production builds; registration is manual in dev
- Test: run from the respective directories (frontend and/or backend)

Common Commands (inside containers)
-----------------------------------
- Backend: npm run dev (nodemon) or npm start
- Frontend: npm start
- Frontend tests: npm test

Screenshots
-----------
Once running locally, take screenshots of:
- Homepage
- Restaurant page
- Cart
- Order tracking
- Admin Dashboard

Save them in: screenshots/ (create if missing)

License
-------
MIT (adjust as needed)