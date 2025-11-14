# API Documentation

## Overview

This document provides detailed information about the eCommerce Admin Dashboard API endpoints.

## Base URL

```
http://localhost:3000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Login

**Endpoint:** `POST /api/login`

**Description:** Authenticate a user and receive a JWT token.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required, min: 6 characters)"
}
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error Responses:**

- **Code:** 400 Bad Request
```json
{
  "error": "Please provide email and password"
}
```

- **Code:** 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

- **Code:** 401 Unauthorized
```json
{
  "error": "Account is inactive"
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

---

#### Get Current User

**Endpoint:** `GET /api/me`

**Description:** Get information about the currently authenticated user.

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**

- **Code:** 401 Unauthorized
```json
{
  "error": "No token provided, authorization denied"
}
```

- **Code:** 401 Unauthorized
```json
{
  "error": "Token is not valid"
}
```

- **Code:** 401 Unauthorized
```json
{
  "error": "User not found or inactive"
}
```

**Example:**
```bash
curl http://localhost:3000/api/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

### Health Check

#### Check API Health

**Endpoint:** `GET /health`

**Description:** Check if the API is running and get server status.

**Request Headers:** None required

**Success Response:**
- **Code:** 200 OK
- **Content:**
```json
{
  "status": "OK",
  "timestamp": "2025-11-13T12:00:00.000Z",
  "uptime": 3600.5
}
```

**Example:**
```bash
curl http://localhost:3000/health
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |

## Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": "Optional additional details"
}
```

## JWT Token

### Token Structure

The JWT token contains the following payload:

```json
{
  "id": 1,
  "email": "user@example.com",
  "role": "admin",
  "iat": 1699876543,
  "exp": 1699962943
}
```

### Token Expiration

Default token expiration is 24 hours. After expiration, users must log in again.

### Using the Token

Include the token in the Authorization header for all protected routes:

```
Authorization: Bearer YOUR_TOKEN_HERE
```

## Rate Limiting

Currently, there is no rate limiting implemented. Consider implementing rate limiting for production use.

## CORS Policy

CORS is enabled for all origins in development. Configure appropriately for production.

## Postman Collection

You can import the following into Postman for easy testing:

### Environment Variables
```json
{
  "baseUrl": "http://localhost:3000",
  "token": ""
}
```

### Collection
1. Create a new collection named "eCommerce Admin API"
2. Add requests as documented above
3. Use `{{baseUrl}}` and `{{token}}` variables

## WebSocket Support

Currently, WebSockets are not implemented. This may be added in future versions for real-time updates.

## Pagination

For endpoints that return lists (future implementation), use these query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field
- `order`: Sort order (asc/desc)

Example:
```
GET /api/products?page=2&limit=20&sort=createdAt&order=desc
```

## Filtering

For list endpoints (future implementation), you can filter results:

```
GET /api/products?category=electronics&minPrice=100&maxPrice=500
```

## Future Endpoints (Planned)

The following endpoints are planned for future releases:

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

### Orders
- `GET /api/orders` - List orders
- `GET /api/orders/:id` - Get order details
- `POST /api/orders` - Create an order
- `PUT /api/orders/:id` - Update order status (admin only)

### Categories
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get a category
- `POST /api/categories` - Create a category (admin only)

### Users
- `GET /api/users` - List users (admin only)
- `GET /api/users/:id` - Get user details (admin only)
- `PUT /api/users/:id` - Update user (admin only)
