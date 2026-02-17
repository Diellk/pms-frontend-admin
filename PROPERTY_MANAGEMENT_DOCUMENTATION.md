# Property Management System - Admin Documentation

## Overview

The Property Management System provides hotel administrators with comprehensive tools to manage room types, perform bulk operations, and maintain property-wide consistency. This system enables efficient management of large properties with powerful bulk operations and detailed reporting.

---

## Table of Contents

1. [Room Type Management](#room-type-management)
2. [Bulk Room Operations](#bulk-room-operations)
3. [Property Statistics](#property-statistics)
4. [Floor Management](#floor-management)
5. [API Reference](#api-reference)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

---

## Room Type Management

### Overview

Room types define the different categories of rooms in your hotel (e.g., Standard, Deluxe, Suite). Each room type includes pricing, specifications, amenities, and availability settings.

### Room Type Attributes

| Attribute | Type | Required | Description |
|-----------|------|----------|-------------|
| `typeName` | String | Yes | Unique name for the room type |
| `basePrice` | BigDecimal | Yes | Base price per night |
| `maxOccupancy` | Integer | Yes | Maximum number of guests |
| `description` | String | No | Detailed description |
| `size` | Double | No | Room size in square meters |
| `bedType` | String | No | Type of bed (King, Queen, Twin) |
| `numberOfBeds` | Integer | No | Number of beds in the room |
| `amenities` | List<String> | No | List of amenities |
| `images` | List<String> | No | URLs to room images |
| `active` | Boolean | No | Whether room type is available for booking |

### Common Amenities

```
- WiFi
- TV
- Mini Bar
- Air Conditioning
- Safe
- Hair Dryer
- Coffee Maker
- Balcony
- Sea View
- City View
- Bathtub
- Shower
- Work Desk
- Sofa
- Kitchen
```

---

## Bulk Room Operations

### Overview

Bulk operations allow administrators to perform actions on multiple rooms simultaneously, saving time and ensuring consistency across the property.

### Supported Bulk Operations

1. **Bulk Room Creation** - Create multiple rooms at once
2. **Bulk Status Update** - Update status of multiple rooms
3. **Bulk Deletion** - Delete multiple rooms (with safety checks)
4. **Bulk Type Assignment** - Reassign rooms to different room types
5. **Floor-Wide Operations** - Update all rooms on a specific floor

### Bulk Operation Response Format

All bulk operations return a detailed response:

```json
{
  "successCount": 8,
  "failureCount": 2,
  "totalCount": 10,
  "successMessages": [
    "Room 201 created successfully",
    "Room 202 created successfully",
    ...
  ],
  "errorMessages": [
    "Room 205 already exists",
    "Failed to create room 208: Invalid floor"
  ],
  "allSuccessful": false
}
```

---

## Property Statistics

### Overview

Property statistics provide administrators with real-time insights into room inventory, occupancy, and maintenance status.

### Available Statistics

#### Room Type Statistics
- Total room types in the system
- Active room types (available for booking)
- Inactive room types

#### Room Statistics
- Total rooms in the property
- Ready rooms (available for check-in)
- Occupied rooms (currently in use)
- Cleaning rooms (housekeeping in progress)
- Maintenance rooms (under repair)
- Out-of-order rooms (unavailable)

#### Floor Statistics
- Total number of floors
- Average rooms per floor

#### Availability Metrics
- Availability rate (% of ready rooms)
- Maintenance rate (% of rooms under maintenance)

### Statistics Response Example

```json
{
  "totalRoomTypes": 5,
  "activeRoomTypes": 4,
  "inactiveRoomTypes": 1,
  "totalRooms": 120,
  "readyRooms": 95,
  "occupiedRooms": 18,
  "cleaningRooms": 5,
  "maintenanceRooms": 2,
  "outOfOrderRooms": 0,
  "totalFloors": 10,
  "roomsPerFloor": 12,
  "availabilityRate": 79.17,
  "maintenanceRate": 1.67
}
```

---

## Floor Management

### Overview

Floor management enables administrators to organize and manage rooms by floor level, making it easy to perform floor-wide operations.

### Floor Operations

1. **View Floor Rooms** - List all rooms on a specific floor
2. **Update Floor Status** - Change status of all rooms on a floor
3. **Floor Statistics** - Get metrics for a specific floor

### Use Cases

- **Maintenance Mode:** Set entire floor to maintenance during renovations
- **Cleaning Schedule:** Mark entire floor for cleaning after events
- **Floor Inspection:** Prepare entire floor for inspection

---

## API Reference

### Base URLs

```
Room Types: /api/admin/room-types
Bulk Operations: /api/admin/property
```

### Authentication

All endpoints require JWT authentication with ADMIN role:
```
Authorization: Bearer <jwt-token>
```

---

## Room Type API Endpoints

### Create Room Type

```http
POST /api/admin/room-types
Content-Type: application/json

{
  "typeName": "Deluxe King",
  "basePrice": 250.00,
  "maxOccupancy": 2,
  "description": "Spacious room with king bed and city view",
  "size": 35.0,
  "bedType": "King",
  "numberOfBeds": 1,
  "amenities": ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Safe"],
  "images": [
    "https://example.com/images/deluxe-1.jpg",
    "https://example.com/images/deluxe-2.jpg"
  ],
  "active": true
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "typeName": "Deluxe King",
  "basePrice": 250.00,
  "maxOccupancy": 2,
  "description": "Spacious room with king bed and city view",
  "size": 35.0,
  "bedType": "King",
  "numberOfBeds": 1,
  "amenities": ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Safe"],
  "images": ["https://example.com/images/deluxe-1.jpg", ...],
  "active": true,
  "totalRooms": 0,
  "availableRooms": 0,
  "createdAt": "2026-02-17T10:30:00",
  "updatedAt": "2026-02-17T10:30:00"
}
```

---

### Get All Room Types

```http
GET /api/admin/room-types
```

**Optional Query Parameters:**
- `active` - Filter by active status (true/false)

**Examples:**
```http
GET /api/admin/room-types
GET /api/admin/room-types?active=true
GET /api/admin/room-types?active=false
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "typeName": "Deluxe King",
    "basePrice": 250.00,
    "maxOccupancy": 2,
    "totalRooms": 15,
    "availableRooms": 12,
    ...
  },
  {
    "id": 2,
    "typeName": "Standard Queen",
    "basePrice": 150.00,
    "maxOccupancy": 2,
    "totalRooms": 30,
    "availableRooms": 25,
    ...
  }
]
```

---

### Get Room Type by ID

```http
GET /api/admin/room-types/{id}
```

**Example:**
```http
GET /api/admin/room-types/1
```

---

### Get Room Type by Name

```http
GET /api/admin/room-types/name/{typeName}
```

**Example:**
```http
GET /api/admin/room-types/name/Deluxe%20King
```

---

### Update Room Type

```http
PUT /api/admin/room-types/{id}
Content-Type: application/json

{
  "typeName": "Deluxe King Suite",
  "basePrice": 275.00,
  "maxOccupancy": 3,
  "description": "Updated description",
  "size": 40.0,
  "bedType": "King",
  "numberOfBeds": 1,
  "amenities": ["WiFi", "TV", "Mini Bar", "Air Conditioning", "Safe", "Balcony"],
  "active": true
}
```

**Response (200 OK):** Updated room type object

---

### Activate Room Type

```http
POST /api/admin/room-types/{id}/activate
```

Makes the room type available for booking.

**Response (200 OK):** Updated room type object

---

### Deactivate Room Type

```http
POST /api/admin/room-types/{id}/deactivate
```

Makes the room type unavailable for booking (existing bookings remain valid).

**Response (200 OK):** Updated room type object

---

### Delete Room Type

```http
DELETE /api/admin/room-types/{id}
```

**Safety Check:** Cannot delete if rooms of this type exist.

**Response (200 OK):**
```json
{
  "message": "Room type deleted successfully"
}
```

**Error Response (409 Conflict):**
```json
{
  "error": "Cannot delete room type. There are 15 rooms of this type. Please reassign or delete those rooms first."
}
```

---

### Get Property Statistics

```http
GET /api/admin/room-types/statistics
```

**Response (200 OK):**
```json
{
  "totalRoomTypes": 5,
  "activeRoomTypes": 4,
  "inactiveRoomTypes": 1,
  "totalRooms": 120,
  "readyRooms": 95,
  "occupiedRooms": 18,
  "cleaningRooms": 5,
  "maintenanceRooms": 2,
  "outOfOrderRooms": 0,
  "totalFloors": 10,
  "roomsPerFloor": 12,
  "availabilityRate": 79.17,
  "maintenanceRate": 1.67
}
```

---

## Bulk Operation API Endpoints

### Bulk Create Rooms

```http
POST /api/admin/property/rooms/bulk-create
Content-Type: application/json

{
  "roomTypeId": 1,
  "floor": 3,
  "roomNumbers": ["301", "302", "303", "304", "305", "306", "307", "308", "309", "310"],
  "status": "READY"
}
```

**Room Status Options:**
- `READY` - Room is ready for check-in
- `CLEANING` - Room is being cleaned
- `MAINTENANCE` - Room is under maintenance
- `OCCUPIED` - Room is currently occupied
- `OUT_OF_ORDER` - Room is not available

**Response (200 OK):**
```json
{
  "successCount": 10,
  "failureCount": 0,
  "totalCount": 10,
  "successMessages": [
    "Room 301 created successfully",
    "Room 302 created successfully",
    "Room 303 created successfully",
    ...
  ],
  "errorMessages": [],
  "allSuccessful": true
}
```

**Duplicate Room Response:**
```json
{
  "successCount": 8,
  "failureCount": 2,
  "totalCount": 10,
  "successMessages": [
    "Room 301 created successfully",
    ...
  ],
  "errorMessages": [
    "Room 305 already exists",
    "Room 308 already exists"
  ],
  "allSuccessful": false
}
```

---

### Bulk Update Room Status

```http
POST /api/admin/property/rooms/bulk-update-status
Content-Type: application/json

{
  "roomIds": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  "status": "MAINTENANCE",
  "notes": "Scheduled maintenance for HVAC systems"
}
```

**Response (200 OK):**
```json
{
  "successCount": 10,
  "failureCount": 0,
  "totalCount": 10,
  "successMessages": [
    "Room 301 status updated to MAINTENANCE",
    "Room 302 status updated to MAINTENANCE",
    ...
  ],
  "errorMessages": [],
  "allSuccessful": true
}
```

---

### Bulk Delete Rooms

```http
DELETE /api/admin/property/rooms/bulk-delete
Content-Type: application/json

[1, 2, 3, 4, 5]
```

**Safety Check:** Cannot delete occupied rooms.

**Response (200 OK):**
```json
{
  "successCount": 4,
  "failureCount": 1,
  "totalCount": 5,
  "successMessages": [
    "Room 301 deleted successfully",
    "Room 302 deleted successfully",
    "Room 303 deleted successfully",
    "Room 304 deleted successfully"
  ],
  "errorMessages": [
    "Room 305 is occupied and cannot be deleted"
  ],
  "allSuccessful": false
}
```

---

### Bulk Assign Room Type

```http
POST /api/admin/property/rooms/bulk-assign-type?roomIds=1,2,3,4,5&roomTypeId=2
```

Reassigns multiple rooms to a different room type.

**Query Parameters:**
- `roomIds` - Comma-separated list of room IDs
- `roomTypeId` - Target room type ID

**Response (200 OK):**
```json
{
  "successCount": 5,
  "failureCount": 0,
  "totalCount": 5,
  "successMessages": [
    "Room 301 assigned to Standard Queen",
    "Room 302 assigned to Standard Queen",
    ...
  ],
  "errorMessages": [],
  "allSuccessful": true
}
```

---

### Get Rooms by Floor

```http
GET /api/admin/property/floors/{floor}/rooms
```

**Example:**
```http
GET /api/admin/property/floors/3/rooms
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "number": 301,
    "name": "Room 301",
    "floor": 3,
    "roomType": { ... },
    "roomStatus": "READY",
    ...
  },
  ...
]
```

---

### Bulk Update Floor Status

```http
POST /api/admin/property/floors/{floor}/bulk-update-status?status=CLEANING
```

Updates the status of all rooms on a specific floor.

**Example:**
```http
POST /api/admin/property/floors/3/bulk-update-status?status=MAINTENANCE
```

**Response (200 OK):**
```json
{
  "message": "Updated 12 rooms on floor 3 to MAINTENANCE",
  "count": 12
}
```

---

## Usage Examples

### Example 1: Setup New Room Type

**Step 1: Create Room Type**
```bash
curl -X POST http://localhost:8080/api/admin/room-types \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "typeName": "Executive Suite",
    "basePrice": 450.00,
    "maxOccupancy": 4,
    "description": "Luxury suite with separate living area and panoramic views",
    "size": 65.0,
    "bedType": "King + Sofa Bed",
    "numberOfBeds": 2,
    "amenities": [
      "WiFi",
      "Smart TV",
      "Mini Bar",
      "Air Conditioning",
      "Safe",
      "Coffee Maker",
      "Balcony",
      "Sea View",
      "Jacuzzi",
      "Work Desk",
      "Living Room"
    ],
    "active": true
  }'
```

**Step 2: Create Rooms for This Type**
```bash
curl -X POST http://localhost:8080/api/admin/property/rooms/bulk-create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "roomTypeId": 5,
    "floor": 10,
    "roomNumbers": ["1001", "1002", "1003", "1004", "1005"],
    "status": "READY"
  }'
```

---

### Example 2: Schedule Floor Maintenance

```bash
# Get all rooms on floor 5
curl -X GET http://localhost:8080/api/admin/property/floors/5/rooms \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Set entire floor to maintenance
curl -X POST "http://localhost:8080/api/admin/property/floors/5/bulk-update-status?status=MAINTENANCE" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Example 3: Room Type Migration

Reassign rooms from one type to another:

```bash
# First, get rooms of old type
curl -X GET "http://localhost:8080/api/rooms/type/1/available?startDate=2026-02-17&endDate=2026-12-31" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Reassign to new type
curl -X POST "http://localhost:8080/api/admin/property/rooms/bulk-assign-type?roomIds=1,2,3,4,5&roomTypeId=3" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### Example 4: Property Expansion

Add an entire new floor:

```bash
curl -X POST http://localhost:8080/api/admin/property/rooms/bulk-create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "roomTypeId": 2,
    "floor": 11,
    "roomNumbers": [
      "1101", "1102", "1103", "1104", "1105",
      "1106", "1107", "1108", "1109", "1110",
      "1111", "1112", "1113", "1114", "1115"
    ],
    "status": "READY"
  }'
```

---

### Example 5: Seasonal Room Type Updates

Update pricing and availability for seasonal changes:

```bash
# Deactivate winter rooms
curl -X POST http://localhost:8080/api/admin/room-types/3/deactivate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update pricing for peak season
curl -X PUT http://localhost:8080/api/admin/room-types/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "typeName": "Deluxe King",
    "basePrice": 350.00,
    "maxOccupancy": 2,
    ...
  }'
```

---

## Best Practices

### Room Type Management

1. **Unique Names** - Use clear, descriptive names for room types
2. **Accurate Pricing** - Set competitive base prices (can be adjusted with rate rules)
3. **Complete Information** - Fill in all details for better guest experience
4. **Quality Images** - Provide multiple high-quality images
5. **Regular Updates** - Keep amenities and descriptions current

### Bulk Operations

1. **Test First** - Test bulk operations on a small set before full deployment
2. **Verify IDs** - Double-check room IDs before bulk deletion
3. **Use Floor Operations** - Prefer floor-wide updates for consistency
4. **Review Results** - Always check the operation response for failures
5. **Backup Strategy** - Have a rollback plan for major bulk changes

### Status Management

1. **READY vs OCCUPIED** - Only mark as OCCUPIED when guest checks in
2. **CLEANING** - Set status during housekeeping to prevent double bookings
3. **MAINTENANCE** - Use for repairs, renovations, or inspections
4. **OUT_OF_ORDER** - Reserve for long-term unavailability

### Property Organization

1. **Floor Numbering** - Use consistent floor numbering scheme
2. **Room Numbering** - Follow standard convention (floor + sequential)
3. **Type Distribution** - Balance room types across floors
4. **Maintenance Planning** - Schedule floor-wide maintenance strategically

---

## Error Handling

### Common Errors

**400 Bad Request**
```json
{
  "error": "Room type with name 'Deluxe King' already exists"
}
```

**404 Not Found**
```json
{
  "error": "Room type not found with ID: 999"
}
```

**409 Conflict**
```json
{
  "error": "Cannot delete room type. There are 15 rooms of this type."
}
```

**500 Internal Server Error**
```json
{
  "error": "Failed to create room type: Database connection error"
}
```

---

## Validation Rules

### Room Type

- ✅ Type name must be unique
- ✅ Base price must be positive
- ✅ Max occupancy must be at least 1
- ✅ Size must be positive (if provided)
- ✅ Number of beds must be at least 1 (if provided)

### Bulk Operations

- ✅ At least one room must be specified
- ✅ Room type must exist
- ✅ Room numbers must be valid integers
- ✅ Floor number must be positive
- ✅ Status must be valid enum value

---

## Permissions

All endpoints require:
- ✅ Valid JWT token
- ✅ ADMIN role
- ✅ Active user account

---

## Performance Considerations

### Bulk Operations

- **Batch Size:** Recommended maximum 100 rooms per operation
- **Timeouts:** Large operations may take several seconds
- **Concurrency:** Multiple bulk operations can run in parallel
- **Database:** Uses transaction management for consistency

### Statistics

- **Caching:** Statistics are calculated in real-time
- **Performance:** Optimized queries for large properties
- **Refresh:** Statistics reflect immediate changes

---

## Troubleshooting

### Issue: Bulk Create Fails for Some Rooms

**Problem:** Some room numbers already exist  
**Solution:** Check existing rooms first, or review error messages in response

### Issue: Cannot Delete Room Type

**Problem:** Rooms of this type still exist  
**Solution:** Reassign rooms to different type or delete rooms first

### Issue: Floor Update Affects Occupied Rooms

**Problem:** Setting floor to maintenance includes occupied rooms  
**Solution:** Get floor rooms first, filter out occupied, then update individually

### Issue: Room Type Not Available for Booking

**Problem:** Room type is inactive  
**Solution:** Use activate endpoint to make it available

---

## API Endpoint Summary

### Room Types (11 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/room-types` | Create room type |
| GET | `/api/admin/room-types` | Get all room types |
| GET | `/api/admin/room-types/{id}` | Get by ID |
| GET | `/api/admin/room-types/name/{name}` | Get by name |
| GET | `/api/admin/room-types/active` | Get active types |
| GET | `/api/admin/room-types/inactive` | Get inactive types |
| PUT | `/api/admin/room-types/{id}` | Update room type |
| POST | `/api/admin/room-types/{id}/activate` | Activate |
| POST | `/api/admin/room-types/{id}/deactivate` | Deactivate |
| DELETE | `/api/admin/room-types/{id}` | Delete |
| GET | `/api/admin/room-types/statistics` | Get statistics |

### Bulk Operations (6 endpoints)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/property/rooms/bulk-create` | Create multiple rooms |
| POST | `/api/admin/property/rooms/bulk-update-status` | Update multiple statuses |
| DELETE | `/api/admin/property/rooms/bulk-delete` | Delete multiple rooms |
| POST | `/api/admin/property/rooms/bulk-assign-type` | Reassign room types |
| GET | `/api/admin/property/floors/{floor}/rooms` | Get floor rooms |
| POST | `/api/admin/property/floors/{floor}/bulk-update-status` | Update floor status |

**Total Endpoints:** 17

---

## Support

For additional help or questions:
- Review the implementation summary document
- Check the quick reference guide
- Contact the development team

---

**Last Updated:** February 17, 2026  
**Version:** 1.0.0  
**Status:** Production Ready
