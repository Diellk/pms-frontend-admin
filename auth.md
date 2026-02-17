## 1. Authentication Endpoints

**Base URL:** `/api/auth`

### 1.1 Login
- **Endpoint:** `POST /api/auth/login`
- **Description:** Authenticate user and receive JWT token
- **Request Body:**
```json
{
  "username": "frontdesk1",
  "password": "password123"
}
```
- **Response (Success - 200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "tokenType": "Bearer",
  "userId": 1,
  "username": "frontdesk1",
  "name": "John",
  "surname": "Smith",
  "email": "john.smith@hotel.com",
  "userType": "FRONT_DESK"
}
```
- **Response (Error - 401):**
```json
{
  "error": "Invalid credentials"
}
```

### 1.2 Validate Token
- **Endpoint:** `POST /api/auth/validate`
- **Description:** Validate a JWT token
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response (Success - 200):**
```json
{
  "valid": true,
  "message": "Token is valid"
}
```

### 1.3 Get Current User
- **Endpoint:** `GET /api/auth/me`
- **Description:** Get current authenticated user's information
- **Headers:**
  - `Authorization: Bearer <token>`
- **Response (Success - 200):**
```json
{
  "userId": 1,
  "username": "frontdesk1",
  "name": "John",
  "surname": "Smith",
  "email": "john.smith@hotel.com"
}
```