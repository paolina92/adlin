# Meeting Room Booking API

A RESTful API built with NestJS & Prisma that allows users to search and book meeting rooms based on availability.

## 🚀 Tech Stack

- **Node.js + NestJS** (modular and strongly typed framework)
- **TypeScript**
- **Prisma ORM** with SQLite
- **Jest** for unit testing
- **Swagger** for API documentation

---

## 📦 Setup

```bash
# 1. Install dependencies
npm install

# 2. Generate the database with Prisma
npx prisma migrate dev --name init

# 3. Seed the database with sample data
npx prisma db seed

# 4. Start the API server
npm run start:dev
```

## 📚 API Documentation

A Swagger-based API UI is available at:

http://localhost:3001/api
