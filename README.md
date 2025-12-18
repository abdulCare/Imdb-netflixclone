# AbdulFlix (Netflix / IMDb Clone)

Full-stack MERN starter that recreates the Netflix / IMDb experience using TMDB as the content source. The backend is an Express + MongoDB API with JWT auth, while the frontend is a Create React App client that consumes the API.

## Tech stack

- **Frontend:** React (CRA), React Router, React Hook Form + Zod, Axios
- **Backend:** Node.js, Express, Mongoose, JWT, Zod validation, Axios TMDB client
- **Database:** MongoDB
- **Tooling:** Nodemon, Concurrently, dotenv, Helmet, Morgan, Rate Limiting

## Project structure

```
.
├── client/            # React application (CRA)
│   ├── src/api        # Axios clients for API modules
│   ├── src/components # UI building blocks (cards, grid, protected route, etc.)
│   ├── src/context    # Auth provider + hook
│   ├── src/pages      # Pages (Home, Search, Details, Auth, Favorites, Watchlists)
│   └── src/routes     # Centralized routing config
├── server/
│   ├── src/app.js     # Express app and middleware
│   ├── src/server.js  # Server bootstrap + DB connection
│   ├── src/config     # env validation, db connection, TMDB axios instance
│   ├── src/controllers|services|routes|models|middleware|utils|seed
│   └── .env/.env.example
├── package.json       # Root scripts to run client + server concurrently
└── README.md
```

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   npm install --prefix server
   npm install --prefix client
   ```
2. **Environment variables**
   - Copy `server/.env.example` → `server/.env` and fill in:
     - `PORT`, `MONGODB_URI`, `TMDB_API_KEY`, `TMDB_BASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`
   - Copy `client/.env.example` → `client/.env` and set `REACT_APP_API_URL` (defaults to `http://localhost:5000/api`).
3. **Seed demo data (optional)**
   ```bash
   npm run seed --prefix server
   ```
4. **Run the dev stack**
   ```bash
   npm run dev
   ```
   - Server: http://localhost:5000
   - Client: http://localhost:3000

## Server scripts

- `npm run dev --prefix server` – start Express API with Nodemon
- `npm start --prefix server` – start API once
- `npm run seed --prefix server` – seed demo user, favorites, watchlist, and review

## Client scripts

- `npm start --prefix client` – run CRA dev server
- `npm run build --prefix client` – build production assets

## API highlights

All responses use `{ data, meta }` for success or `{ error: { message, code } }` for failures.

- **TMDB proxy:** `/api/tmdb/trending`, `/api/tmdb/search`, `/api/tmdb/movie/:id`, `/api/tmdb/tv/:id`
- **Auth:** `/api/auth/register`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`
- **Favorites:** `/api/favorites` (list/create) + `/api/favorites/:tmdbType/:tmdbId` (delete, optional TMDB merge)
- **Watchlists:** `/api/watchlists` (list/create) + `/api/watchlists/:id/items` (patch)
- **Reviews:** `/api/reviews` (create) + `/api/reviews/:tmdbType/:tmdbId` (list)

## Security & best practices

- Environment variables validated on boot with Zod (`config/env.js`)
- Mongoose connection lifecycle managed with graceful shutdowns
- Helmet, CORS (with credential support), rate limiting, and centralized error handling
- TMDB API key kept server-side via the Axios client with automatic auth
- Input validation handled with Zod schemas shared by the `validate` middleware

## Frontend features

- Auth state persisted via JWT + HttpOnly cookie, surfaced with React context
- Protected routes for favorites + watchlists
- TMDB media grid (trending + search) and detail pages with reviews + favorite toggles
- Simple watchlist creator, favorites management, and review composer (react-hook-form + Zod)

## Next steps

- Hook up CI/testing (Jest for client, supertest for server)
- Deploy MongoDB (Atlas) + host API/Client (Render/Vercel)
- Add redis-backed TMDB cache and pagination/infinite scroll on the client
