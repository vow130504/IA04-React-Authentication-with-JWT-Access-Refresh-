# React Authentication with JWT (Access + Refresh)

Monorepo structure:
- `backend/` Express API issuing short-lived access tokens and refresh tokens
- `frontend/` React SPA with Axios, React Query, React Hook Form, and protected routes

## Prerequisites
- Node.js 18+
- npm or yarn

## Backend
1. Copy env:
   ```
   cd backend
   cp .env.example .env
   ```
   Adjust secrets and CORS_ORIGIN if needed.
2. Install and run:
   ```
   npm install
   npm run dev
   ```
   API at http://localhost:4000

## Frontend
1. Configure API base URL:
   ```
   cd ../frontend
   cp .env.example .env
   ```
2. Install and run:
   ```
   npm install
   npm run dev
   ```
   App at http://localhost:5173

### Demo Credentials
- Email: `test@example.com`
- Password: `password123`

## Auth Flow Highlights
- Access token stored in memory (lost on refresh).
- Refresh token stored in `localStorage`.
- Axios interceptors attach `Authorization: Bearer <accessToken>` and auto-refresh on 401.
- On refresh failure, tokens are cleared and user is redirected to `/login`.
- React Query:
  - `useMutation` for login/logout
  - `useQuery` for fetching `/me`
- React Hook Form handles login form validation.

## Deploy
- Frontend: Netlify/Vercel (set `VITE_API_BASE_URL` to your API URL).
- Backend: Render/Railway/Heroku/Azure/AWS/GCP. Set env vars and allow CORS.

Public URL:
- Frontend: https://YOUR_PUBLIC_FRONTEND_URL
- Backend: https://YOUR_PUBLIC_BACKEND_URL

Ensure `VITE_API_BASE_URL` points to the public backend URL.

## Notes
- Access token lifetime is short (default 60s) to demo refresh.
- Refresh tokens are stored in-memory on server for revocation and rotated on refresh.
