[![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)](https://github.com/<owner>/<repo>/actions/workflows/ci.yml)

# Express Project

Simple Express + Mongoose API for books, authors and users.

> **Note:** Replace `<owner>/<repo>` in the badge URL above with your GitHub `owner/repo` to enable the badge link and status.

## Requirements

- Node.js (18+ recommended)
- npm
- MongoDB (for local runs) — you can set `MONGO_URI` in `.env`

## Environment

Create a `.env` file in the project root (not checked into git) with:

```
MONGO_URI=mongodb://localhost:27017/your-db
JWT_SECRET=your_jwt_secret
PORT=3000
```

For tests the project sets `JWT_SECRET=test_jwt_secret` by default.

## Install

```bash
npm install
```

## Scripts

- Start server: `npm start` (reads `.env`)
- Start dev: `npm run start:dev`
- Import generated books: `npm run import:books` (see `data/books.json`)
- Run tests: `npm test`

## Import books.json

Generate or add a `data/books.json` file with an array of book objects matching the `Book` model and run:

```bash
npm run import:books -- --clear    # clears existing books (prompt unless --force provided)
```

## Testing

This project uses Jest + Supertest and an in-memory MongoDB for fast, isolated tests.

```bash
npm test
```

## Continuous Integration

A GitHub Actions workflow (`.github/workflows/ci.yml`) runs the test suite on push and pull requests (Node 18 and 20).

## Docker (Production)

A production docker-compose is provided in `docker-compose.prod.yml`.

Quick steps to run in production mode locally (example):

1. Create a `.env.prod` file (keep it secret) with values such as:

```
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=example
MONGO_URI=mongodb://root:example@mongo:27017/your-db?authSource=admin
JWT_SECRET=your_prod_jwt_secret
PORT=3000
```

2. Build and start the production stack:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up --build -d
```

3. Check services and logs:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f app
```

Notes:

- In production deploys you should use real credentials and secrets management (Docker secrets, cloud KMS, or your orchestrator).
- The app exposes a `/health` endpoint used by the Docker healthcheck.
- The `mongo` service uses a named volume `mongo-data` to persist data across restarts.
