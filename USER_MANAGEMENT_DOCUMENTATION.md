# User Management System Documentation

## Overview

The User Management System provides comprehensive administrator-only functionality to manage all users in the hotel PMS system. This includes creating, reading, updating, and deleting user accounts for different roles: Administrators, Front Desk Staff, Housekeeping Staff, and Maintenance Staff.

---

## Table of Contents

1. [Architecture](#architecture)
2. [User Roles](#user-roles)
3. [API Endpoints](#api-endpoints)
4. [Data Models](#data-models)
5. [Security](#security)
6. [Usage Examples](#usage-examples)
7. [Database Changes](#database-changes)

---

## Architecture

### Components

```
Controller Layer:
├── UserManagementController.java      # Admin-only REST endpoints

Service Layer:
├── UserManagementService.java         # Business logic for user operations

Repository Layer:
├── UserRepository.java                # Base user repository
├── AdministratorRepository.java       # Administrator-specific queries
├── FrontDeskRepository.java           # Front desk staff queries
├── HousekeepingUserRepository.java    # Housekeeping staff queries
└── MaintenanceRepository.java         # Maintenance staff queries

Entity Layer:
├── User.java (abstract)               # Base user entity
├── Administrator.java                 # Admin user
├── FrontDesk.java                     # Front desk staff
├── Housekeeping.java                  # Housekeeping staff
├── Maintenance.java                   # Maintenance staff
└── Guest.java                         # Guest user

DTOs:
├── UserDTO.java                       # User data transfer object
├── CreateUserRequest.java             # Create user request
├── UpdateUserRequest.java             # Update user request
├── ChangePasswordRequest.java         # Password change request
└── UserStatisticsDTO.java             # User statistics

Enums:
└── UserRole.java                      # User role enumeration
```

---

## User Roles

The system supports the following user roles:

| Role | Enum Value | Description | Database Value |
|------|-----------|-------------|----------------|
| Administrator | `ADMIN` | Full system access, can manage all users | `ADMIN` |
| Front Desk Staff | `FRONT_DESK` | Check-in/check-out, bookings, guest management | `FRONT_DESK` |
| Housekeeping Staff | `HOUSEKEEPING` | Cleaning tasks, room status updates | `HOUSEKEEPING` |
| Maintenance Staff | `MAINTENANCE` | Maintenance tasks, room repairs | `MAINTENANCE` |
| Guest | `GUEST` | Limited access to self-service features | `GUEST` |

---

## API Endpoints

### Base URL
```
/api/admin/users
```

**Note:** All endpoints require ADMIN role authentication.

---

### Create Operations

#### Create User
```http
POST /api/admin/users
Content-Type: application/json

{
  "username": "john.doe",
  "password": "SecurePass123!",
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@hotel.com",
  "phone": "+41791234567",
  "role": "FRONT_DESK"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "username": "john.doe",
  "name": "John",
  "surname": "Doe",
  "email": "john.doe@hotel.com",
  "phone": "+41791234567",
  "role": "FRONT_DESK",
  "active": true,
  "createdAt": "2026-02-17T10:30:00",
  "updatedAt": "2026-02-17T10:30:00",
  "fullName": "John Doe"
}
```

**Validation:**
- Username must be unique
- Email must be unique and valid format
- Password is automatically hashed using BCrypt
- All required fields must be provided

---

### Read Operations

#### Get All Users
```http
GET /api/admin/users
```

**Optional Query Parameters:**
- `role` - Filter by role (ADMIN, FRONT_DESK, HOUSEKEEPING, MAINTENANCE)
- `active` - Filter by status (true/false)

**Examples:**
```http
GET /api/admin/users?role=FRONT_DESK
GET /api/admin/users?active=true
GET /api/admin/users?role=HOUSEKEEPING&active=true
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "john.doe",
    "name": "John",
    "surname": "Doe",
    "email": "john.doe@hotel.com",
    "phone": "+41791234567",
    "role": "FRONT_DESK",
    "active": true,
    "createdAt": "2026-02-17T10:30:00",
    "updatedAt": "2026-02-17T10:30:00",
    "fullName": "John Doe"
  }
]
```

---

#### Get User by ID
```http
GET /api/admin/users/{id}
```

**Response (200 OK):** Single UserDTO object

---

#### Get User by Username
```http
GET /api/admin/users/username/{username}
```

**Example:**
```http
GET /api/admin/users/username/john.doe
```

---

#### Get Users by Role
```http
GET /api/admin/users/role/{role}
```

**Examples:**
```http
GET /api/admin/users/role/ADMIN
GET /api/admin/users/role/FRONT_DESK
GET /api/admin/users/role/HOUSEKEEPING
GET /api/admin/users/role/MAINTENANCE
```

---

#### Get Active Users
```http
GET /api/admin/users/active
```

Returns all users with `active = true`.

---

#### Get Inactive Users
```http
GET /api/admin/users/inactive
```

Returns all users with `active = false`.

---

#### Get User Statistics
```http
GET /api/admin/users/statistics
```

**Response (200 OK):**
```json
{
  "totalUsers": 25,
  "activeUsers": 22,
  "inactiveUsers": 3,
  "administratorCount": 2,
  "frontDeskCount": 5,
  "housekeepingCount": 12,
  "maintenanceCount": 6
}
```

---

### Update Operations

#### Update User
```http
PUT /api/admin/users/{id}
Content-Type: application/json

{
  "name": "Jane",
  "surname": "Smith",
  "email": "jane.smith@hotel.com",
  "phone": "+41791234999",
  "active": true
}
```

**Notes:**
- All fields are optional
- Only provided fields will be updated
- Username and email uniqueness is validated
- Cannot change user role (must delete and recreate)

**Response (200 OK):** Updated UserDTO object

---

#### Change Password
```http
PUT /api/admin/users/{id}/password
Content-Type: application/json

{
  "newPassword": "NewSecurePass456!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password changed successfully"
}
```

**Notes:**
- Password is automatically hashed using BCrypt
- No need to provide old password (admin override)

---

#### Activate User
```http
POST /api/admin/users/{id}/activate
```

Sets the user's `active` status to `true`.

**Response (200 OK):** Updated UserDTO object

---

#### Deactivate User
```http
POST /api/admin/users/{id}/deactivate
```

Sets the user's `active` status to `false`.

**Response (200 OK):** Updated UserDTO object

**Use Cases:**
- Temporarily disable user access without deleting
- Suspend employee accounts
- Deactivate former employees

---

### Delete Operations

#### Delete User
```http
DELETE /api/admin/users/{id}
```

**Response (200 OK):**
```json
{
  "message": "User deleted successfully"
}
```

**Notes:**
- This is a hard delete (permanent)
- Consider deactivating instead of deleting for audit trail
- Cannot be undone

---

## Data Models

### UserDTO

Complete user information without sensitive data:

```java
{
  "id": Long,
  "username": String,
  "name": String,
  "surname": String,
  "email": String,
  "phone": String,
  "role": UserRole,
  "active": boolean,
  "createdAt": LocalDateTime,
  "updatedAt": LocalDateTime,
  "fullName": String  // Computed: name + surname
}
```

---

### CreateUserRequest

Request for creating a new user:

```java
{
  "username": String,      // Required, unique
  "password": String,      // Required (will be hashed)
  "name": String,         // Required
  "surname": String,      // Required
  "email": String,        // Required, unique, valid email
  "phone": String,        // Optional
  "role": UserRole        // Required (ADMIN, FRONT_DESK, HOUSEKEEPING, MAINTENANCE)
}
```

---

### UpdateUserRequest

Request for updating user information:

```java
{
  "username": String,     // Optional
  "name": String,        // Optional
  "surname": String,     // Optional
  "email": String,       // Optional, valid email
  "phone": String,       // Optional
  "active": Boolean      // Optional
}
```

---

### ChangePasswordRequest

Request for changing user password:

```java
{
  "newPassword": String   // Required
}
```

---

### UserStatisticsDTO

System-wide user statistics:

```java
{
  "totalUsers": long,
  "activeUsers": long,
  "inactiveUsers": long,
  "administratorCount": long,
  "frontDeskCount": long,
  "housekeepingCount": long,
  "maintenanceCount": long
}
```

---

## Security

### Password Security

- **Hashing Algorithm:** BCrypt (configured in `SecurityConfig`)
- **Password Storage:** Never stored in plain text
- **Password Strength:** Enforce strong password policies in frontend

### Authentication

- All endpoints require JWT authentication
- Only users with ADMIN role can access these endpoints
- JWT token must be included in Authorization header:
  ```
  Authorization: Bearer <jwt-token>
  ```

### Authorization

Future enhancement: Add role-based access control using Spring Security annotations:

```java
@PreAuthorize("hasRole('ADMIN')")
public ResponseEntity<?> createUser(...) {
    // ...
}
```

---

## Usage Examples

### Example 1: Create Front Desk Staff

```bash
curl -X POST http://localhost:8080/api/admin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "username": "mary.jones",
    "password": "SecurePass123!",
    "name": "Mary",
    "surname": "Jones",
    "email": "mary.jones@hotel.com",
    "phone": "+41791234567",
    "role": "FRONT_DESK"
  }'
```

---

### Example 2: Get All Housekeeping Staff

```bash
curl -X GET "http://localhost:8080/api/admin/users/role/HOUSEKEEPING" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Example 3: Deactivate a User

```bash
curl -X POST http://localhost:8080/api/admin/users/5/deactivate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Example 4: Update User Information

```bash
curl -X PUT http://localhost:8080/api/admin/users/3 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "phone": "+41799999999",
    "email": "new.email@hotel.com"
  }'
```

---

### Example 5: Change User Password

```bash
curl -X PUT http://localhost:8080/api/admin/users/3/password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "newPassword": "NewSecurePassword456!"
  }'
```

---

### Example 6: Get User Statistics

```bash
curl -X GET http://localhost:8080/api/admin/users/statistics \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Database Changes

### User Entity Updates

The `User` entity has been enhanced with the following fields:

```sql
ALTER TABLE users ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
```

### Migration Notes

- Existing users will default to `active = true`
- Timestamps will be automatically set for existing records
- No data loss - all existing user data is preserved

---

## Features Summary

✅ **User CRUD Operations**
- Create users with different roles
- Read user information (by ID, username, role, status)
- Update user details
- Delete users (hard delete)

✅ **User Status Management**
- Activate/deactivate user accounts
- Track active vs inactive users
- Filter users by status

✅ **Password Management**
- Secure password hashing (BCrypt)
- Admin password reset capability
- No plain text password storage

✅ **User Statistics**
- Total user count
- Active/inactive breakdown
- Count by role type

✅ **Audit Trail**
- Creation timestamp
- Last update timestamp
- Track user lifecycle

✅ **Data Validation**
- Username uniqueness
- Email uniqueness and format validation
- Required field validation
- Role validation

---

## Future Enhancements

### Recommended Features

1. **Role-Based Access Control (RBAC)**
   - Fine-grained permissions
   - Custom role definitions
   - Permission inheritance

2. **Password Policies**
   - Minimum length requirements
   - Complexity requirements (uppercase, lowercase, numbers, special chars)
   - Password expiration
   - Password history (prevent reuse)

3. **User Activity Logging**
   - Login history
   - Action audit trail
   - Failed login attempts
   - Session management

4. **Bulk Operations**
   - Bulk user creation (CSV import)
   - Bulk activation/deactivation
   - Bulk password reset

5. **User Profile Management**
   - Profile pictures
   - Department assignment
   - Shift schedules
   - Emergency contact information

6. **Email Notifications**
   - Account creation notification
   - Password reset emails
   - Account status changes
   - Welcome emails for new users

7. **Two-Factor Authentication (2FA)**
   - SMS-based 2FA
   - Email-based 2FA
   - Authenticator app support

8. **Self-Service Features**
   - User profile updates (non-admin)
   - Password change (with old password)
   - Notification preferences

---

## Error Handling

### Common Error Responses

**400 Bad Request** - Validation error
```json
{
  "error": "Username already exists: john.doe"
}
```

**404 Not Found** - User not found
```json
{
  "error": "User not found with ID: 123"
}
```

**500 Internal Server Error** - Server error
```json
{
  "error": "Failed to create user: Database connection error"
}
```

---

## Testing Recommendations

### Unit Tests
- Test user creation with all roles
- Test validation (unique username, email)
- Test password hashing
- Test user update operations
- Test statistics calculation

### Integration Tests
- Test complete user lifecycle (create → read → update → delete)
- Test role-based filtering
- Test status activation/deactivation
- Test password change flow

### Security Tests
- Test authentication requirements
- Test authorization (admin-only access)
- Test password strength
- Test SQL injection prevention
- Test XSS prevention

---

## Support & Maintenance

### Common Issues

**Issue:** "Username already exists"
- **Solution:** Check if username is already taken before creating user

**Issue:** "Email already exists"
- **Solution:** Verify email uniqueness in the system

**Issue:** "User not found"
- **Solution:** Verify the user ID exists in the database

**Issue:** "Password too weak"
- **Solution:** Implement password policy validation in frontend

---

## Conclusion

The User Management System provides a comprehensive, secure, and scalable solution for managing all users in the hotel PMS. It follows best practices for security, data validation, and API design, making it easy to integrate with frontend applications.

For questions or support, refer to the API documentation or contact the development team.
