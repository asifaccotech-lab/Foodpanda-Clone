Database Schema (ER Overview)
=============================

Entities
--------
- User (id, name, email, passwordHash, role)
- Address (id, userId, street, city, state, zip, lat, lng)
- Restaurant (id, name, description, imageUrl, rating, deliveryFee)
- Category (id, name)
- MenuItem (id, restaurantId, categoryId, name, description, price, imageUrl, isAvailable)
- Cart (id, userId)
- CartItem (id, cartId, menuItemId, quantity)
- Order (id, userId, restaurantId, totalPrice, status, trackingCode)
- OrderItem (id, orderId, menuItemId, quantity, unitPrice)

Relationships
-------------
- User 1---N Address
- User 1---1 Cart
- Restaurant 1---N MenuItem
- Category 1---N MenuItem
- Cart 1---N CartItem
- Order 1---N OrderItem
- User 1---N Order
- Restaurant 1---N Order
- MenuItem used by CartItem and OrderItem (FK)

Status values (Order)
---------------------
- pending, confirmed, preparing, out_for_delivery, delivered, cancelled

ASCII Diagram
-------------
User (id) ----< Address (userId)

User (id) ----1 Cart (userId) ----< CartItem (cartId) ----> MenuItem (id)
                                        |
                                        v
                                   MenuItem (id) >---- Restaurant (id)
                                   MenuItem (id) >---- Category (id)

User (id) ----< Order (userId) ----< OrderItem (orderId) ----> MenuItem (id)
                       |
                       v
                 Restaurant (id)

Notes
-----
- Addresses are optional; orders can reference the restaurant and user.
- Carts are per-user and ephemeral until checkout, at which point an order is created.