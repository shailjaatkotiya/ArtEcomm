# ArtEcomm

An art e-commerce store: an immersive, black-and-white React storefront backed by a Node.js / Express REST API and a PostgreSQL database.

## Demo

https://github.com/user-attachments/assets/your-upload-id

> The walkthrough recording lives in the repo as [`Video Project 7.mp4`](Video%20Project%207.mp4). GitHub only autoplays videos that are uploaded through its UI, so to embed it inline drag the file into a README edit on github.com and replace the link above with the generated `user-attachments` URL.

<video src="Video%20Project%207.mp4" controls width="100%"></video>

If the player above does not render, [download / open the demo video](Video%20Project%207.mp4).

## Stack

**Frontend** (`frontend-new/`)
- React 19 + Vite 8
- Tailwind CSS 4
- React Router 7
- Framer Motion (page + element animation)
- three.js via `@react-three/fiber` + `@react-three/drei` (immersive painting-ring backdrop)
- lucide-react icons

**Backend** (`Backend/`)
- Node.js + Express 5
- PostgreSQL (`pg`)
- Joi request validation
- Swagger UI API docs
- CORS, dotenv

## Project layout

```
ArtEcomm/
├── Backend/            # Express REST API
│   ├── src/
│   │   ├── app.js          # express app, route + swagger wiring
│   │   ├── server.js       # entry point
│   │   ├── config/db.js    # pg pool
│   │   ├── controllers/    # art + user handlers
│   │   ├── routes/         # /api/arts, /api/users
│   │   ├── middleware/     # validate, errorHandler
│   │   ├── validators/     # joi schemas
│   │   └── swagger.json    # API spec
│   └── database.sql        # schema + seed data
└── frontend-new/       # React + Vite storefront
    └── src/
        ├── components/     # Hero, About, Product, Cart, 3D backdrop, etc.
        ├── pages/          # gallery, product item, contact
        ├── context/        # CartContext
        ├── data/ + lib/    # catalog + API client
        └── App.jsx
```

## Getting started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Database

```bash
createdb artecomm
psql -d artecomm -f Backend/database.sql
```

This creates the `arts`, `users`, `cart_items`, and `orders` tables and seeds 20 sample art items.

### 2. Backend

```bash
cd Backend
npm install
```

Create `Backend/.env`:

```env
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=artecomm
DB_PASSWORD=your_password
DB_PORT=5432
```

Run it:

```bash
npm run dev     # nodemon (hot reload)
# or
npm start
```

API: `http://localhost:5000`
Swagger docs: `http://localhost:5000/`

### 3. Frontend

```bash
cd frontend-new
npm install
npm run dev     # vite dev server
```

Build for production:

```bash
npm run build
npm run preview
```

## API

Base URL: `http://localhost:5000`

### Arts — `/api/arts`

| Method | Path             | Description                                  |
|--------|------------------|----------------------------------------------|
| GET    | `/api/arts`      | List arts (filters: `type`, `material`, `color`, `shape`, `special_edition`) |
| GET    | `/api/arts/:id`  | Get one art item                             |
| POST   | `/api/arts`      | Create art item                              |
| PUT    | `/api/arts/:id`  | Update art item                              |
| DELETE | `/api/arts/:id`  | Delete art item                              |

### Users — `/api/users`

| Method | Path              | Description       |
|--------|-------------------|-------------------|
| GET    | `/api/users`      | List users        |
| GET    | `/api/users/:id`  | Get one user      |
| POST   | `/api/users`      | Create user       |
| PUT    | `/api/users/:id`  | Update user       |
| DELETE | `/api/users/:id`  | Delete user       |

All requests/responses are documented interactively at the Swagger root (`/`).
