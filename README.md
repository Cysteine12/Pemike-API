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

# 📘 API Routes Overview

## 🔐 Auth Routes (`/api/auth`)

| Method | Endpoint            | Description               | Auth Required |
|--------|---------------------|---------------------------|----------------|
| POST   | `/register`         | Register new user         | ❌             |
| POST   | `/login`            | Login                     | ❌             |
| POST   | `/verify-email`     | Verify email with token   | ❌             |
| POST   | `/forgot-password`  | Send reset password email | ❌             |
| POST   | `/reset-password`   | Reset password            | ❌             |
| POST   | `/change-password`  | Change password           | ✅ JWT         |
| POST   | `/refresh-token`    | Refresh access token      | ❌             |
| POST   | `/request-otp`      | Request OTP               | ❌             |
| POST   | `/verify-otp`       | Verify OTP                | ❌             |
| POST   | `/logout`           | Logout                    | ❌             |

---

## 📅 Booking Routes (`/api/bookings`)

| Method | Endpoint   | Description        | Auth Required | Role     |
|--------|------------|--------------------|----------------|----------|
| GET    | `/`        | Get all bookings   | ✅ JWT         | CUSTOMER |
| GET    | `/:id`     | Get a booking      | ✅ JWT         | CUSTOMER |
| POST   | `/`        | Create a booking   | ✅ JWT         | CUSTOMER |

---

## 💳 Payment Routes (`/api/payments`)

| Method | Endpoint                      | Description                | Auth Required | Role     |
|--------|-------------------------------|----------------------------|----------------|----------|
| GET    | `/`                           | Get all payments           | ✅ JWT         | CUSTOMER |
| GET    | `/:id`                        | Get a payment              | ✅ JWT         | CUSTOMER |
| POST   | `/initialize-payment`         | Start a new payment        | ✅ JWT         | CUSTOMER |
| POST   | `/verify-payment/:reference`  | Verify payment by reference| ✅ JWT         | CUSTOMER |
| POST   | `/payment-webhook`            | Webhook callback           | ❌             | Webhook  |

---

## 🪑 Seat Routes (`/api/seats`)

| Method | Endpoint          | Description                  | Auth Required |
|--------|-------------------|------------------------------|----------------|
| GET    | `/trip/:id`       | Get seats for a trip         | ❌             |
| POST   | `/reserve`        | Reserve seat (customer)      | ❌             |

---

## 🚌 Trip Routes (`/api/trips`)

| Method | Endpoint    | Description         | Auth Required | Role  |
|--------|-------------|---------------------|----------------|-------|
| GET    | `/`         | Get all trips       | ❌             |       |
| GET    | `/search`   | Search trips        | ❌             |       |
| GET    | `/:id`      | Get trip by ID      | ❌             |       |
| POST   | `/`         | Create a trip       | ✅ JWT         | ADMIN |
| PATCH  | `/:id`      | Update a trip       | ✅ JWT         | ADMIN |
| DELETE | `/:id`      | Delete a trip       | ✅ JWT         | ADMIN |

---

## 👤 User Routes (`/api/users`)

| Method | Endpoint      | Description         | Auth Required |
|--------|---------------|---------------------|----------------|
| GET    | `/profile`    | Get own profile     | ✅ JWT         |
| PATCH  | `/profile`    | Update own profile  | ✅ JWT         |

---

## 🚗 Vehicle Routes (`/api/vehicles`)

| Method | Endpoint              | Description                   | Auth Required | Role  |
|--------|-----------------------|-------------------------------|----------------|--------|
| GET    | `/`                   | Get all vehicles              | ✅ JWT         | ADMIN  |
| GET    | `/status/:status`     | Filter vehicles by status     | ✅ JWT         | ADMIN  |
| GET    | `/search`             | Search by license plate       | ✅ JWT         | ADMIN  |
| GET    | `/:id`                | Get vehicle by ID             | ✅ JWT         | ADMIN  |
| POST   | `/`                   | Create new vehicle            | ✅ JWT         | ADMIN  |
| PATCH  | `/:id`                | Update vehicle details        | ✅ JWT         | ADMIN  |
| DELETE | `/:id`                | Delete a vehicle              | ✅ JWT         | ADMIN  |

---

## 🛠️ Admin Routes (`/api/admin`)

### 👥 Users

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | `/users`              | Get all users                |
| GET    | `/users/role/:role`   | Filter users by role         |
| GET    | `/users/search`       | Search users by name         |
| GET    | `/users/:id`          | Get user by ID               |
| POST   | `/users`              | Create user (admin account)  |
| PATCH  | `/users/role`         | Update user's role           |

### 🪑 Seats

| Method | Endpoint                | Description                  |
|--------|-------------------------|------------------------------|
| GET    | `/seats/trip/:tripId`   | Get seats for a trip         |
| POST   | `/seats/reserve`        | Admin reserves a seat        |

### 💳 Payments

| Method | Endpoint                                  | Description                          |
|--------|-------------------------------------------|--------------------------------------|
| GET    | `/payments`                               | Get all payments                     |
| GET    | `/payments/status/:status`                | Filter by payment status             |
| GET    | `/payments/booking/status/:status`        | Filter by booking status             |
| GET    | `/payments/booking/user/:userId`          | Filter by user                       |
| GET    | `/payments/search`                        | Search payments by reference         |
| GET    | `/payments/:id`                           | Get payment by ID                    |

> 🔐 All admin routes require `JWT` authentication and `ADMIN` role.
---

## 🧠 Other Components

- **Controllers** - Define logic for handling route requests
- **Services** - Abstracted logic for business rules and database access
- **Middlewares** - Handle errors, authentication, rate limiting
- **Utils** - Reusable helpers (`catchAsync`, `pick`, etc.)
- **Prisma** - ORM schema, database models and seeding