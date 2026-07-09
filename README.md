# Aurelia

Aurelia is a full-stack workspace for the Velmont Private Bank concept.

## Project Structure

- `frontend/` contains the customer-facing web experience.
- `backend/` contains the NestJS API.
- `docs/` contains the product and operating blueprint.

## Run The Frontend

```powershell
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Run The Backend

```powershell
npm run backend:dev
```

The backend API runs at `http://localhost:3000/api/v1` after backend dependencies are installed.

If the backend reports that `nest` is missing, run:

```powershell
npm --prefix backend install
```

## Email OTP Auth App

Separate workspaces were added so the existing frontend and Nest backend stay untouched:

- `auth-frontend/` contains the React + Vite + Tailwind OTP signup flow.
- `auth-backend/` contains the Spring Boot + PostgreSQL + Flyway + SendGrid auth service.

Run the auth frontend:

```powershell
npm run auth:frontend:dev
```

The auth frontend runs at `http://localhost:5174`.

Run the auth backend:

```powershell
npm run auth:backend:run
```

The auth backend expects Maven plus PostgreSQL credentials in `auth-backend/.env`, and serves `http://localhost:8080/api/v1/auth`.

### Remembered sign-in

The auth app now supports persistent login for installed users:

- successful registration creates an HTTP-only session cookie
- returning users are restored automatically through `GET /api/v1/auth/session`
- the success screen can open the private vault at `http://localhost:5173`
- the vault checks the auth session endpoint before falling back to its demo login
- if the cookie expires, users can sign back in with email and password instead of signing up again

Useful local overrides:

- `FRONTEND_URLS=http://localhost:5174,http://localhost:5173` controls auth backend CORS origins.
- `VITE_VAULT_APP_URL=http://localhost:5173` controls the auth frontend "Open Private Vault" link.
- `window.AURELIA_AUTH_SESSION_ENDPOINT` can override the vault session restore endpoint before `frontend/app.js` loads.
