# 📅 Meeting Room Booking App

A full-stack web application that allows users to search and book meeting rooms based on their availability.

## 📂 Project Structure

```
adlin/
├── backend/
│   └── api/         NestJS REST API
└── frontend/        Vue 3 app (WIP)
```

## 🛠️ Backend:

### 🚀 Tech Stack

- NestJS with TypeScript
- Prisma ORM (SQLite)
- Jest for unit testing
- Swagger for documentation

### 📦 Setup

cd backend/api

1. Install dependencies
   npm install

2. Generate the database
   npx prisma migrate dev --name init

3. Seed with sample data
   npx prisma db seed

4. Start the server
   npm run start:dev

### 📚 API Documentation

Available at:
http://localhost:3000/api

Swagger includes all endpoints with query params, payload examples, and error cases.

### 🧪 Run Tests

cd backend/api
npm run test

## 🖥️ Frontend:

### 🚀 Tech Stack

- Vue 3 + TypeScript
- Pinia (state management)
- Vite (build tool)

## 🤝 Author

Crafted by Pauline as part of a technical assessment.
