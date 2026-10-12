# Sunfield Fortuna

```
Fortuna/
  frontend/   React + Vite (React Router)
  backend/    Node + Express API
  database/   fortuna.sql (MySQL / MariaDB schema + seed data)
```

## Run locally (XAMPP)

1. Start **Apache** and **MySQL** in the XAMPP Control Panel.
2. Open http://localhost/phpmyadmin → **Import** → choose `database/fortuna.sql` → Go.
3. Backend:
   ```
   cd backend
   copy .env.example .env        (Mac/Linux: cp .env.example .env)
   npm install
   npm run dev                   (http://localhost:5000/api/health)
   ```
4. Frontend (new terminal):
   ```
   cd frontend
   npm install
   npm run dev                   (http://localhost:5173)
   ```
   Vite proxies `/api` to the backend, so no extra config is needed in development.

## Hero image per page
Drop an image into `frontend/src/assets/heroes/` named after the page:
`home`, `mission`, `involved`, `news`, `contact`, `login` (png, jpg, jpeg or webp).
Pages without their own image use `home`. Hero text for each page lives in `frontend/src/data/heroes.js`.

## Before deploying
- Build the frontend with `npm run build` and upload `frontend/dist` (the `.htaccess` in it makes deep links work on Apache).
- If the API is on another domain, set `VITE_API_URL` when building and `CORS_ORIGIN` in the backend `.env`.
- Create a dedicated MySQL user for the site instead of `root`, and set a real password in the production `.env`.
- Fill in the TODO contact details in `frontend/src/data/site.js`.
