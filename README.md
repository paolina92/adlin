# 📅 Meeting Room Booking App

A full-stack web application that allows users to search and book meeting rooms based on their availability.

## 📂 Project Structure

```
adlin/
├── backend/
│   └── api/         NestJS REST API
└── frontend/        Vue 3 app (WIP)
```

### 📦 Package manager

This project uses pnpm

If you don’t have it yet, install it globally:

```
npm install -g pnpm
```

## 🛠️ Backend:

### 🚀 Tech Stack

- NestJS with TypeScript
- Prisma ORM (SQLite)
- Jest for unit testing
- Swagger for documentation

### 📦 Setup

```
cd backend/api
```

1. Install dependencies

```
pnpm install
```

2. Generate the database

```
npx prisma migrate dev --name init
```

3. Seed with sample data

```
npx prisma db seed
```

4. Start the server

```
pnpm run start:dev
```

### 📚 API Documentation

Available at:
http://localhost:3001/api

Swagger includes all endpoints with query params, payload examples, and error cases.

### 🧪 Run Tests

```
cd backend/api
pnpm run test
```

## 🖥️ Frontend:

### 🚀 Tech Stack

- Vue 3 – Progressive web framework
- TypeScript – Strongly typed JavaScript
- Vite – Lightning-fast build tool with instant HMR
- Pinia – Intuitive and type-safe store for state management
- Vue Query – Powerful async state manager (data fetching, caching, mutations)
- Tailwind CSS v4 – Utility-first CSS framework for rapid UI development-

## 🤝 Author

Crafted by Pauline as part of a technical assessment.
