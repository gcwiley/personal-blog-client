# Personal Blog — Angular Client

A personal blog web application built with Angular and Angular Material. Features JWT-based authentication, full post management (create, read, update, delete), and a responsive UI. Designed to be served by a companion Node.js/Express API.

---

## Features

- **Authentication** — Sign in and sign up with JWT token management and automatic session expiry detection
- **Post Management** — Browse, search, create, edit, and delete blog posts
- **Protected Routes** — Auth guard restricts access to authenticated users; unsaved changes guard prevents accidental navigation
- **Lazy Loading** — All pages are lazy-loaded for optimal bundle size
- **View Transitions** — Native Angular view transitions between pages
- **Theme Support** — Light/dark theme switching via `ThemeService`
- **Text-to-Speech** — Post reading via `SpeechService`

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 21 |
| Language | TypeScript 5.9 |
| UI Components | Angular Material 21 + Angular CDK |
| HTTP | Angular `HttpClient` with Fetch API |
| Auth | JWT (stored in `localStorage`) |
| Styling | SCSS |
| Testing | Vitest |
| Linting | ESLint + `angular-eslint` |

---

## Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [Angular CLI](https://angular.dev/tools/cli) v21+
- The companion **Express API server** running on `http://localhost:3000`

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server (proxies /api to localhost:3000)
npm start