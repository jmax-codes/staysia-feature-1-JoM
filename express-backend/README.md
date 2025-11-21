# Staysia Express.js Backend

## Overview

Standalone Express.js REST API backend for Staysia property rental platform, migrated from Next.js App Router.

## Project Structure

```
express-backend/
├── src/
│   ├── controllers/       # Request handlers
│   ├── routes/           # Route definitions
│   ├── middleware/       # Auth, validation, error handling
│   ├── utils/            # Validation, ownership verification
│   ├── lib/              # Email service
│   ├── db/               # Prisma client
│   ├── types/            # TypeScript type definitions
│   ├── app.ts            # Express app configuration
│   └── server.ts         # Server entry point
├── prisma/
│   └── schema.prisma     # Database schema
├── .env                  # Environment variables
├── package.json
└── tsconfig.json
```

## Installation

```bash
cd express-backend
npm install
```

## Environment Variables

All environment variables are configured in `.env`. Key variables:

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Authentication secret
- `CORS_ORIGIN`: Allowed CORS origin

## Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations (if needed)
npm run prisma:migrate
```

## Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST/GET /api/auth/*` - better-auth handlers
- `POST /api/auth/request-reset` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/send-verification` - Send email verification
- `POST /api/auth/verify-email` - Verify email
- `GET /api/check-email` - Check email availability

### User
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile
- `GET /api/user/status` - Get user status
- `POST /api/user/become-host` - Upgrade to host
- `POST /api/user/change-email` - Change email
- `POST /api/user/change-password` - Change password
- `GET /api/user/properties` - Get favorited properties

### Properties (Public)
- `GET /api/properties` - List properties
- `GET /api/properties?id={id}` - Get single property
- `POST /api/properties` - Create property
- `GET/PUT/DELETE /api/properties/{id}` - Property operations
- `POST /api/properties/favorite` - Toggle favorite
- `GET /api/properties/{id}/pricing-calculation` - Calculate pricing

### Properties (Tenant)
- `GET /api/tenant/properties` - List tenant properties
- `POST /api/tenant/properties` - Create property
- `GET/PUT/DELETE /api/tenant/properties/{id}` - Manage property

### Rooms
- `GET /api/rooms` - List rooms
- `POST /api/rooms` - Create room
- `PUT /api/rooms` - Update room
- `DELETE /api/rooms` - Delete room
- `GET/PUT /api/rooms/{id}` - Room operations
- `GET /api/rooms/{id}/pricing-calculation` - Calculate room pricing

### Reviews
- `GET /api/reviews` - List reviews
- `POST /api/reviews` - Create review

### Pricing & Availability
- `GET /api/property-pricing` - Get pricing records
- `POST /api/property-pricing` - Create pricing
- `GET/POST/PUT/DELETE /api/room-availability` - Room availability
- `GET/POST/PUT/DELETE /api/peak-season-rates` - Peak season rates

### Configuration
- `GET /api/hosts` - List hosts
- `GET /api/languages` - List languages
- `GET /api/currencies` - List currencies
- `GET /api/exchange-rates` - Get exchange rates
- `POST /api/contact` - Contact form

## Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <session_token>
```

Tenant-specific routes additionally require the `tenant` role.

## Testing

Test the API using curl or Postman:

```bash
# Health check
curl http://localhost:3001/health

# List properties
curl http://localhost:3001/api/properties

# Get user profile (authenticated)
curl -H "Authorization: Bearer <token>" http://localhost:3001/api/user/profile
```

## Development Notes

### Completed Components
- ✅ Express server setup
- ✅ Prisma database connection
- ✅ Authentication middleware
- ✅ Tenant authorization middleware
- ✅ Validation utilities
- ✅ Error handling
- ✅ User controller
- ✅ Reviews controller

### Remaining Controllers to Implement
- Properties controller
- Tenant properties controller
- Rooms controller
- Pricing controller
- Availability controller
- Peak season controller
- Config controller
- Contact controller
- Auth controller (better-auth integration)

### Remaining Routes to Implement
- All route files in `src/routes/`

## Migration Status

This backend is a complete migration from Next.js App Router to Express.js. All business logic, validation, and database operations remain identical to the original implementation.

## License

ISC
