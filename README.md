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
