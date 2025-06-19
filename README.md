Link to the frontend repo:
https://github.com/Cysteine12/Pemike

Link to live website:
https://pemike.vercel.app

# 📦 Pemike-API Documentation

A RESTful API built using **Node.js**, **Express**, **TypeScript**, and **Prisma** ORM for managing a transport booking system. It supports user registration, trip and seat management, vehicle handling, booking, and payment features.

---

## 📁 Project Structure

- **src/** - Main application source code
  - **config/** - Configuration files for Prisma, JWT, email services, etc.
  - **controllers/** - Contains route handlers and request processing logic
  - **middlewares/** - Express middleware implementations
  - **routes/** - Route definitions and API endpoints
  - **services/** - Business logic layer and data interaction
  - **types/** - Custom TypeScript type definitions
  - **utils/** - Helper functions and utilities
  - **validations/** - Input validation schemas (using Zod)
  - **app.ts, server.ts** - Application entry point and Express setup

- **prisma/** - Contains all Prisma ORM related files including:
  - Database schema
  - Seed files
  - Migration history

- **dist/** - Output directory for compiled JavaScript code

- **package.json** - Project metadata, dependencies, and scripts
- **tsconfig.json** - TypeScript compiler configuration

---

## 📦 Dependencies and Their Purpose

### Runtime Dependencies

| Package                | Purpose |
|------------------------|---------|
| express                | Web framework |
| @prisma/client         | Prisma DB client |
| bcryptjs               | Password hashing |
| jsonwebtoken           | JWT authentication |
| passport               | Authentication middleware |
| passport-jwt           | Passport strategy for JWT |
| cookie-parser          | Parse HTTP cookies |
| cors                   | Enable CORS |
| helmet                 | Secure HTTP headers |
| morgan                 | HTTP request logging |
| express-rate-limit     | Basic rate limiting middleware |
| node-cache             | In-memory caching |
| axios                  | Promise-based HTTP client |
| nodemailer             | Sending emails |
| uuid                   | Unique ID generation |
| zod                    | Type-safe validation |
| mysql2                 | MySQL driver for Node.js |
| date-fns               | Utility for working with dates |

### Dev Dependencies

| Package                | Purpose |
|------------------------|---------|
| typescript             | Static typing |
| ts-node                | TypeScript execution engine |
| tsx                    | Zero-config TypeScript runner |
| tsup                   | Bundler for TypeScript |
| nodemon                | Restart server on file changes |
| prisma                 | ORM for Node.js and TypeScript |
| @types/*               | Type definitions for libraries |

---

## 📍 API Routes Overview

### ✅ Auth Routes (`/api/auth`)
- `POST /register` - Register a new user
- `POST /login` - Authenticate a user and provide tokens
- `POST /logout` - Logout a user
- `POST /refresh-token` - Get new access token
- `POST /verify-email` - Confirm user's email with code
- `POST /resend-verification` - Resend verification code
- `POST /forgot-password` - Request a password reset link
- `POST /reset-password` - Reset password with token

### 👤 User Routes (`/api/users`)
- `GET /me` - Get authenticated user's profile
- `PATCH /me` - Update user profile
- `GET /:id` - Get user by ID

### 🚌 Trip Routes (`/api/trips`)
- `GET /` - Fetch all trips
- `POST /` - Create a new trip
- `GET /:id` - Get trip by ID
- `PATCH /:id` - Update trip
- `DELETE /:id` - Delete trip

### 💺 Seat Routes (`/api/seats`)
- `GET /` - Get list of seats
- `POST /` - Create a seat
- `PATCH /:id` - Update seat
- `DELETE /:id` - Delete seat

### 🚗 Vehicle Routes (`/api/vehicles`)
- `GET /` - Get list of vehicles
- `POST /` - Create a vehicle
- `PATCH /:id` - Update vehicle
- `DELETE /:id` - Delete vehicle

### 📆 Booking Routes (`/api/bookings`)
- `POST /` - Book a seat
- `GET /` - Get user’s bookings
- `GET /:id` - Get booking by ID

### 💳 Payment Routes (`/api/payments`)
- `POST /initialize` - Initialize payment
- `GET /verify/:reference` - Verify payment status

### 🛠 Admin Routes (`/api/admin`)
- Admin-only endpoints for managing users, trips, vehicles, etc.

---

## 🧠 Other Components

- **Controllers** - Define logic for handling route requests
- **Services** - Abstracted logic for business rules and database access
- **Middlewares** - Handle errors, authentication, rate limiting
- **Utils** - Reusable helpers (`catchAsync`, `pick`, etc.)
- **Prisma** - ORM schema, database models and seeding