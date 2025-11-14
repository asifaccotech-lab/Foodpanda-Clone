API Documentation
=================

Base URL
--------
http://localhost:4000/api

Authentication
--------------
- JWT-based. Obtain token via /auth/login.
- Send Authorization: Bearer <token> for protected routes.

Endpoints
---------

Auth
----
- POST /auth/register
  - body: { name, email, password }
  - 201: { id, name, email, token }
- POST /auth/login
  - body: { email, password }
  - 200: { id, name, email, token }
- GET /auth/me (protected)
  - 200: { id, name, email, role }

Restaurants
-----------
- GET /restaurants
  - query: search (optional), page, pageSize
  - 200: { items: [...], page, totalPages, totalItems }
- GET /restaurants/:id
  - 200: { id, name, description, imageUrl, rating, deliveryFee, menu: [...] }

Menu
----
- GET /restaurants/:id/menu
  - 200: [ { id, name, description, price, imageUrl, isAvailable } ]

Cart (protected)
----------------
- GET /cart
  - 200: { items: [{ id, menuItemId, name, quantity, unitPrice, lineTotal }], total }
- POST /cart
  - body: { menuItemId, quantity }
  - 200: cart state
- PUT /cart/item/:id
  - body: { quantity }
  - 200: cart state
- DELETE /cart/item/:id
  - 204

Orders (protected)
------------------
- POST /orders
  - body: { addressId (optional), restaurantId (optional) }
  - 201: { id, status, totalPrice }
- GET /orders
  - 200: [ { id, status, totalPrice, createdAt } ]
- GET /orders/:id
  - 200: { id, status, totalPrice, items: [...], trackingCode }
- GET /orders/:id/tracking
  - 200: { status, etaMinutes }

Admin (protected, role=admin)
-----------------------------
- GET /admin/orders
  - 200: [ ... ]
- PUT /admin/orders/:id/status
  - body: { status }
  - 200: updated order

Error Format
------------
- 4xx/5xx: { error: "message" }

Notes
-----
- This API is for demo purposes and uses Sequelize sync + seed data on startup (configurable).
- Extend endpoints as needed for production use (pagination, sorting, filtering, validations).