# Art Ecommerce - Node.js/Express Backend API

A RESTful API server for the Art Ecommerce site. Built with Express.js and PostgreSQL (`pg` pool), with request validation using `Joi`, and structured per feature (MVC-like).

## Proposed Project Structure

```
ArtEcomm/
├── database.sql
├── package.json
├── .env
├── .env.example
└── src/
    ├── server.js              # Entry point, starts HTTP server
    ├── app.js                 # Express app setup + route mounting
    ├── config/
    │   └── db.js              # PostgreSQL connection pool
    ├── middleware/
    │   ├── validate.js        # Generic Joi validation middleware factory
    │   └── errorHandler.js    # Global Express error handler
    ├── routes/
    │   ├── user.routes.js
    │   ├── art.routes.js
    │   └── cart.routes.js
    ├── controllers/
    │   ├── user.controller.js
    │   ├── art.controller.js
    │   └── cart.controller.js
    └── validators/
        ├── user.validator.js
        ├── art.validator.js
        └── cart.validator.js
```

## Proposed Changes

### Setup Files

#### [NEW] package.json
Auto-generated via `npm init -y` with dependencies:
- `express`, `pg`, `joi`, `dotenv`, `cors`

#### [NEW] .env / .env.example
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=art_ecommerce
```

---

### Config

#### [NEW] src/config/db.js
PostgreSQL `Pool` instance using env variables. Exports `query()` helper.

---

### Middleware

#### [NEW] src/middleware/validate.js
Factory function: `validate(schema)` → Express middleware that validates `req.body` via Joi.

#### [NEW] src/middleware/errorHandler.js
Global 4-param Express error handler — catches all thrown/next(err) errors and returns JSON.

---

### Users Module

**CRUD:** Create, Get All, Get by ID, Update, Delete

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users` | Create user |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

**Validation:** `name` (required), `email` (required, valid email), `number` (optional, max 20 chars), `address` (optional).

---

### Arts Module

**CRUD:** Create, Get All (with filters), Get by ID, Update, Delete

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/arts` | Create art item |
| GET | `/api/arts` | Get all arts (with optional query filters) |
| GET | `/api/arts/:id` | Get art by ID |
| PUT | `/api/arts/:id` | Update art item |
| DELETE | `/api/arts/:id` | Delete art item |

**Query filters** (on GET /arts): `type`, `material`, `color`, `shape`, `special_edition`

**Validation:** `image_url` (required, URI), `price` (required, positive number), `description` (required, 2-5 words), enums for type/material/color/shape.

---

### Cart Module

Manages server-side cart (junction table `cart_items`). Frontend Redux will be primary, but this provides persistence endpoints.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart/:userId` | Get all cart items for user |
| POST | `/api/cart` | Add art item to cart |
| DELETE | `/api/cart` | Remove art item from cart |

**Validation:** `user_id` & `art_id` required integers.

---

## Verification Plan

### Manual API Testing (using a tool like Postman or curl)

> No existing automated tests are present. Verification will be done manually.

1. **Start server:** `npm run dev` (or `node src/server.js`)
2. **Users:**
   - `POST /api/users` with valid/invalid body → check 201 vs 400
   - `GET /api/users` → check list returned
   - `PUT /api/users/:id` → check updated data returned
   - `DELETE /api/users/:id` → check 200 + verify not found on re-GET
3. **Arts:**
   - `POST /api/arts` → valid/invalid body → check 201 vs 400
   - `GET /api/arts?type=digital&shape=portrait` → check filtered results
   - `PUT /api/arts/:id` → check updates
   - `DELETE /api/arts/:id` → check removal
4. **Cart:**
   - `POST /api/cart` with `{user_id, art_id}` → check item added
   - `GET /api/cart/:userId` → returns user's cart items
   - `DELETE /api/cart` with `{user_id, art_id}` → check item removed
