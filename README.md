# React Authentication with JWT (Access + Refresh)

## Tech
- React, React Router
- Axios with interceptors
- React Query
- React Hook Form
- Tailwind CSS

## API Endpoints (expected)
- POST /auth/login -> { accessToken, refreshToken }
- POST /auth/refresh { refreshToken } -> { accessToken }
- POST /auth/logout { refreshToken } -> 200 OK
- GET /me (protected) -> user payload

## Setup
1. Install deps:
   - `npm i axios @tanstack/react-query react-hook-form react-router-dom`
2. Configure API base:
   - Vite: set `VITE_API_BASE_URL` in `.env` (e.g., `VITE_API_BASE_URL=http://localhost:4000`)
3. Run:
   - `npm run dev`

## Auth Model
- Access token: stored in memory (lost on refresh).
- Refresh token: stored in `localStorage`.
- Interceptors:
  - Attach `Authorization: Bearer <accessToken>` to all requests.
  - On `401`, try `/auth/refresh` with the refresh token, retry once.
  - On refresh failure, clear tokens and redirect to `/login`.

## Protected Routes
- `ProtectedRoute` checks auth and blocks unauthenticated users.

## Deployment
- Build: `npm run build` then deploy `dist/` to Netlify/Vercel/etc.
- Ensure `VITE_API_BASE_URL` points to your public API.
- Configure SPA fallback (redirect all routes to `/index.html`).

## Public URL
- Deployed at: <YOUR_PUBLIC_URL_HERE>
