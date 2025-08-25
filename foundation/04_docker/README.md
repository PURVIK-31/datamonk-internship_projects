## Simple CRUD (Docker + Compose)

### Run

- Copy `env.example` to `.env` and set `DATABASE_URL` if using Neon. Otherwise default local Postgres is used.
- Start: `docker compose up --build`
- App: `http://localhost:8080`
- API: `http://localhost:3000`

### Env

- DATABASE_URL: Postgres connection string
- VITE_API_URL: API base URL used at frontend build time g

### GitHub

- Init: `git init && git add . && git commit -m "init"`
- Add remote and push: `git branch -M main && git remote add origin <your_repo_url> && git push -u origin main`
