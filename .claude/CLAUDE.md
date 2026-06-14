# My Personal Blog Web Application

## Overview

A Node.js/Express REST API backend for my personal web blog application. Serves an Angular SPA from `dist/album-app-client/browser` and exposes a JSON API under `/api`.

## Tech Stack

- **Runtime**: Node.js 24 (ESM modules — `"type": "module"` in package.json)
- **Framework**: Express 4
- **Database**: Fix this!
- **Auth**: Fix this!
- **File Storage**: Fix this!
- **Deploy Target**: Google App Engine (`app.yaml`, nodejs24 runtime)

## Running the Project

```bash
npm run dev     # development (nodemon)
npm start       # production (node)
