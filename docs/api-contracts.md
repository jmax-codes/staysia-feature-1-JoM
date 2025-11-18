# API Contracts

Complete documentation of all internal API endpoints with request/response schemas.

## Base URL
- Development: `http://localhost:3000`
- Production: `https://staysia.com`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

Get token from localStorage after login:
```javascript
const token = localStorage.getItem("bearer_token");
```

## Properties API

### GET /api/properties
Search and filter properties.

**Query Parameters:**
- `city` (optional) - Filter by city name
- `area` (optional) - Filter by area name
- `type` (optional) - Property type (villa, apartment, hotel, etc.)
- `adults` (optional) - Minimum adult capacity
- `children` (optional) - Minimum child capacity
- `pets` (optional) - Allow pets (true/false)
- `rooms` (optional) - Minimum number of rooms
- `limit` (optional) - Results per page (default: 50)
- `sortBy` (optional) - Sort field (rating, price, name)

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Luxury Villa Bali",
    "city": "Bali",
    "area": "Seminyak",
    "type": "Villa",
    "price": 1500000,
    "rating": 4.8,
    "imageUrl": "/images/property1.jpg",
    "isGuestFavorite": true,
    "reviewCount": 120,
    "description": "Beautiful luxury villa...",
    "address": "Jl. Seminyak No. 123",
    "latitude": -8.6917,
    "longitude": 115.1721
  }
]
```

### GET /api/properties/[id]
Get detailed property information.

**Path Parameters:**
- `id` - Property ID

**Response 200:**
```json
{
  "id": 1,
  "name": "Luxury Villa Bali",
  "city": "Bali",
  "area": "Seminyak",
  "type": "Villa",
  "description": "Beautiful luxury villa with ocean view",
  "address": "Jl. Seminyak No. 123",
  "latitude": -8.6917,
  "longitude": 115.1721,
  "rating": 4.8,
  "reviewCount": 120,
  "isGuestFavorite": true,
  "imageUrl": "/images/property1.jpg",
  "price": 1500000,
  "host": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "joinedDate": "2024-01-01"
  },
  "rooms": [
    {
      "id": 1,
      "name": "Deluxe Ocean View",
      "description": "Spacious room with ocean view",
      "capacity": 2,
      "adults": 2,
      "children": 1,
      "pets": 0,
      "price": 1500000,
      "imageUrl": "/images/room1.jpg"
    }
  ]
}
```

**Response 404:**
```json
{
  "error": "Property not found"
}
```

### GET /api/properties/[id]/pricing-calculation
Calculate pricing for date range.

**Path Parameters:**
- `id` - Property ID

**Query Parameters:**
- `checkIn` - Check-in date (ISO format)
- `checkOut` - Check-out date (ISO format)
- `roomId` (optional) - Specific room ID

**Response 200:**
```json
{
  "basePrice": 1500000,
  "nights": 3,
  "breakdown": [
    {
      "date": "2024-11-20",
      "price": 1500000,
      "isPeakSeason": false,
      "isBestDeal": false
    },
    {
      "date": "2024-11-21",
      "price": 2250000,
      "isPeakSeason": true,
      "peakReason": "Weekend",
      "isBestDeal": false
    }
  ],
  "subtotal": 5250000,
  "discount": 0,
  "total": 5250000
}
```

### POST /api/properties/favorite
Toggle property favorite status. **Requires authentication.**

**Request Body:**
```json
{
  "propertyId": 1,
  "isFavorite": true
}
```

**Response 200:**
```json
{
  "success": true,
  "isFavorite": true
}
```

## Rooms API

### GET /api/rooms
Get all rooms for a property.

**Query Parameters:**
- `propertyId` - Property ID (required)

**Response 200:**
```json
[
  {
    "id": 1,
    "propertyId": 1,
    "name": "Deluxe Ocean View",
    "description": "Spacious room with ocean view",
    "capacity": 2,
    "adults": 2,
    "children": 1,
    "pets": 0,
    "price": 1500000,
    "imageUrl": "/images/room1.jpg"
  }
]
```

### GET /api/rooms/[id]
Get detailed room information.

**Path Parameters:**
- `id` - Room ID

**Response 200:**
```json
{
  "id": 1,
  "propertyId": 1,
  "name": "Deluxe Ocean View",
  "description": "Spacious room with ocean view",
  "capacity": 2,
  "adults": 2,
  "children": 1,
  "pets": 0,
  "price": 1500000,
  "imageUrl": "/images/room1.jpg",
  "amenities": ["WiFi", "AC", "TV"],
  "property": {
    "id": 1,
    "name": "Luxury Villa Bali"
  }
}
```

### GET /api/rooms/[id]/pricing-calculation
Calculate room pricing for date range.

Same as property pricing calculation but for specific room.

## Reviews API

### GET /api/reviews
Get reviews for a property.

**Query Parameters:**
- `propertyId` - Property ID (required)
- `limit` (optional) - Results per page (default: 20)
- `offset` (optional) - Pagination offset (default: 0)

**Response 200:**
```json
{
  "reviews": [
    {
      "id": 1,
      "propertyId": 1,
      "userId": 1,
      "rating": 5,
      "comment": "Amazing place! Highly recommended.",
      "createdAt": "2024-11-01T10:00:00Z",
      "user": {
        "id": 1,
        "name": "Jane Smith"
      }
    }
  ],
  "total": 120,
  "averageRating": 4.8
}
```

### POST /api/reviews
Create a new review. **Requires authentication.**

**Request Body:**
```json
{
  "propertyId": 1,
  "rating": 5,
  "comment": "Amazing place! Highly recommended."
}
```

**Response 201:**
```json
{
  "id": 1,
  "propertyId": 1,
  "userId": 1,
  "rating": 5,
  "comment": "Amazing place!",
  "createdAt": "2024-11-17T10:00:00Z"
}
```

## Currency API

### GET /api/currencies
Get list of supported currencies.

**Response 200:**
```json
[
  {
    "id": 1,
    "code": "USD",
    "name": "US Dollar",
    "symbol": "$"
  },
  {
    "id": 2,
    "code": "EUR",
    "name": "Euro",
    "symbol": "€"
  }
]
```

### GET /api/exchange-rates
Get current exchange rates. Cached for 1 hour.

**Query Parameters:**
- `base` (optional) - Base currency code (default: IDR)
- `target` - Target currency code (required)

**Response 200:**
```json
{
  "base": "IDR",
  "target": "USD",
  "rate": 0.000063,
  "timestamp": "2024-11-17T10:00:00Z"
}
```

## Authentication API

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response 201:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "emailVerified": false
}
```

**Response 400:**
```json
{
  "error": "Email already exists"
}
```

### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Response 401:**
```json
{
  "error": "Invalid credentials"
}
```

### POST /api/auth/verify-email
Verify email with token from verification email.

**Request Body:**
```json
{
  "token": "verification-token-here"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### POST /api/auth/request-reset
Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Reset email sent"
}
```

### POST /api/auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "reset-token-here",
  "password": "NewSecurePass123!"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

## User API

### GET /api/user/profile
Get current user profile. **Requires authentication.**

**Response 200:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "emailVerified": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### PUT /api/user/profile
Update user profile. **Requires authentication.**

**Request Body:**
```json
{
  "name": "John Updated"
}
```

**Response 200:**
```json
{
  "id": 1,
  "name": "John Updated",
  "email": "john@example.com"
}
```

### POST /api/user/change-email
Change user email. **Requires authentication.**

**Request Body:**
```json
{
  "newEmail": "newemail@example.com",
  "password": "CurrentPassword123!"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Verification email sent to new address"
}
```

### POST /api/user/change-password
Change user password. **Requires authentication.**

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### POST /api/user/become-host
Upgrade user to host/tenant role. **Requires authentication.**

**Request Body:**
```json
{
  "businessName": "My Property Business",
  "phoneNumber": "+62812345678"
}
```

**Response 200:**
```json
{
  "success": true,
  "role": "tenant"
}
```

### GET /api/user/status
Check user authentication status.

**Response 200:**
```json
{
  "isAuthenticated": true,
  "user": {
    "id": 1,
    "name": "John Doe",
    "role": "user"
  }
}
```

## Tenant API (Host/Property Manager)

### GET /api/tenant/properties
Get all properties for current tenant. **Requires authentication (tenant role).**

**Response 200:**
```json
[
  {
    "id": 1,
    "name": "Luxury Villa Bali",
    "city": "Bali",
    "area": "Seminyak",
    "type": "Villa",
    "rating": 4.8,
    "reviewCount": 120,
    "rooms": [
      {
        "id": 1,
        "name": "Deluxe Ocean View",
        "price": 1500000
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### POST /api/tenant/properties
Create new property. **Requires authentication (tenant role).**

**Request Body:**
```json
{
  "name": "New Villa",
  "city": "Bali",
  "area": "Seminyak",
  "type": "Villa",
  "description": "Beautiful villa",
  "address": "Jl. Seminyak No. 123",
  "latitude": -8.6917,
  "longitude": 115.1721,
  "imageUrl": "/images/property.jpg"
}
```

**Response 201:**
```json
{
  "id": 2,
  "name": "New Villa",
  "city": "Bali",
  "tenantId": 1
}
```

### PUT /api/tenant/properties/[id]
Update property. **Requires authentication (tenant role).**

**Path Parameters:**
- `id` - Property ID

**Request Body:**
```json
{
  "name": "Updated Villa Name",
  "description": "Updated description"
}
```

**Response 200:**
```json
{
  "id": 1,
  "name": "Updated Villa Name",
  "description": "Updated description"
}
```

### DELETE /api/tenant/properties/[id]
Delete property. **Requires authentication (tenant role).**

**Path Parameters:**
- `id` - Property ID

**Response 200:**
```json
{
  "success": true,
  "message": "Property deleted"
}
```

## Peak Season Rates API

### GET /api/peak-season-rates
Get peak season rates for property/room.

**Query Parameters:**
- `propertyId` (optional) - Property ID
- `roomId` (optional) - Room ID

**Response 200:**
```json
[
  {
    "id": 1,
    "propertyId": 1,
    "roomId": null,
    "startDate": "2024-12-20",
    "endDate": "2024-12-26",
    "multiplier": 1.5,
    "reason": "Christmas Holiday"
  },
  {
    "id": 2,
    "propertyId": 1,
    "roomId": 1,
    "startDate": "2024-12-31",
    "endDate": "2025-01-01",
    "multiplier": 2.0,
    "reason": "New Year's Eve"
  }
]
```

## Room Availability API

### GET /api/room-availability
Check room availability for date range.

**Query Parameters:**
- `roomId` - Room ID (required)
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)

**Response 200:**
```json
{
  "available": true,
  "roomId": 1,
  "startDate": "2024-11-20",
  "endDate": "2024-11-23",
  "unavailableDates": []
}
```

**Response 200 (Unavailable):**
```json
{
  "available": false,
  "roomId": 1,
  "startDate": "2024-11-20",
  "endDate": "2024-11-23",
  "unavailableDates": ["2024-11-21", "2024-11-22"]
}
```

## Error Responses

All API endpoints follow consistent error response format:

**400 Bad Request:**
```json
{
  "error": "Invalid input",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Please login to access this resource"
}
```

**403 Forbidden:**
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

## Rate Limiting

- Public endpoints: 100 requests/minute
- Authenticated endpoints: 300 requests/minute
- Search endpoints: 30 requests/minute

Exceeded rate limit returns:
```json
{
  "error": "Rate limit exceeded",
  "retryAfter": 60
}
```
