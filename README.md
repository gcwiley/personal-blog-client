# My Blog App

A full-stack personal blog application built with **Angular** and **Node.js/Express**, deployed on **Google App Engine** with a **PostgreSQL** (Cloud SQL) database.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21, Angular Material, TypeScript |
| Backend | Node.js, Express 5, Sequelize ORM |
| Database | PostgreSQL (Google Cloud SQL) |
| Auth | JWT (HS256) |
| Deployment | Google App Engine (Standard) |
| Secrets | Google Secret Manager |

---

## Project Structure

```bash
my-blog-app/
├── my-blog-client/   # Angular frontend
└── my-blog-server/   # Express API server
```

---

## Prerequisites

- Node.js 22+
- npm 11+
- PostgreSQL (local) or Google Cloud SQL instance
- [Cloud SQL Auth Proxy](https://cloud.google.com/sql/docs/postgres/sql-proxy) (for Cloud SQL in development)
- Google Cloud project with Secret Manager and Cloud SQL APIs enabled

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repo-url>
cd my-blog-app
```

### 2. Server setup

```bash
cd my-blog-server
npm install
```

Create a `.env` file in `my-blog-server/`:

```env
NODE_ENV=development

# Database
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=127.0.0.1
DB_PORT=5432

# Auth
JWT_SECRET=your_jwt_secret

# CORS
CORS_ORIGIN=http://localhost:4200
```

If connecting to Cloud SQL locally, start the Auth Proxy first:

```bash
cloud-sql-proxy YOUR_PROJECT:YOUR_REGION:YOUR_INSTANCE --port 5432
```

Start the dev server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

### 3. Client setup

```bash
cd my-blog-client
npm install
npm start
```

The Angular dev server runs at `http://localhost:4200` and proxies `/api` requests to `localhost:3000`.

---

## API Endpoints

### Auth — `/api/auth`

| Method | Path | Description | Auth Required |

|---|---|---|---|
| POST | `/register` | Register a new user | No |
| POST | `/signin` | Sign in, returns JWT | No |
| POST | `/signout` | Sign out | No |

### Posts — `/api/posts`

| Method | Path | Description | Auth Required |

|---|---|---|---|
| GET | `/` | Get all posts (paginated) | No |
| GET | `/count` | Get total post count | No |
| GET | `/recent` | Get recently created posts | No |
| GET | `/search` | Search posts | No |
| GET | `/:id` | Get post by ID | No |
| POST | `/` | Create a new post | Yes |
| PATCH | `/:id` | Update a post | Yes |
| DELETE | `/:id` | Delete a post | Yes |

### Users — `/api/users`

| Method | Path | Description | Auth Required |

|---|---|---|---|
| GET | `/profile` | Get user profile | Yes |
| PATCH | `/profile` | Update user profile | Yes |
| DELETE | `/profile` | Delete user account | Yes |

---

## Scripts

### Server

| Command | Description |

|---|---|
| `npm run dev` | Start with nodemon (hot reload) |
| `npm start` | Start production server |
| `npm run check` | Run lint/checks |
| `npm run check-env` | Validate environment variables |
| `npm run deploy` | Deploy to Google App Engine |

### Client

| Command | Description |

|---|---|
| `npm start` | Start Angular dev server |
| `npm run build` | Production build |
| `npm run build-move` | Build and move dist to server |
| `npm test` | Run tests with Vitest |
| `npm run lint` | Run ESLint |

---

## Deployment

The app is deployed as a single unit on Google App Engine — the Express server serves the compiled Angular app as static files.

1. Build the Angular client and move the dist to the server:

   ```bash
   cd my-blog-client && npm run build-move
   ```

2. Deploy from the server directory:

   ```bash
   cd my-blog-server && npm run deploy
   ```

Secrets (`DB_PASSWORD`, `JWT_SECRET`, `CORS_ORIGIN`, etc.) are managed via Google Secret Manager and must be configured before deploying.

---

## License

MIT — see [LICENSE](my-blog-server/LICENSE)
