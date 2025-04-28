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

If you don't have it yet, install it globally:

```bash
npm install -g pnpm
```

## 🛠️ Backend:

### 🚀 Tech Stack

- NestJS with TypeScript
- Prisma ORM (SQLite)
- Jest for unit testing
- Swagger for documentation

### 📦 Setup

```bash
cd backend/api
```

1. Install dependencies

```bash
pnpm install
```

2. Configure environment variables

```bash
# Copy .env.example to .env
cp .env.example .env
```

3. Generate the database

```bash
npx prisma migrate dev --name init
```

4. Seed with sample data

```bash
npx prisma db seed
```

5. Start the server

```bash
pnpm run start:dev
```

### 📚 API Documentation

Available at:
http://localhost:3001/api

Swagger includes all endpoints with query params, payload examples, and error cases.

### 🧪 Run Tests

```bash
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
- Tailwind CSS v4 – Utility-first CSS framework for rapid UI development

### 📦 Installation

```bash
cd frontend
pnpm install
```

### 🔧 Configuration

```bash
# Copy .env.example to .env
cp .env.example .env
```

### 🚀 Development Server

```bash
pnpm dev
```

The application will be available at http://localhost:5173

### 🧪 Testing

```bash
# Run tests in watch mode
pnpm test

# Run tests with UI interface
pnpm test:ui
```

### 📝 Linting and Formatting

```bash
# Run linter
pnpm lint

# Format code
pnpm format
```

### 🏗️ Production Build

```bash
pnpm build
```

Production files will be generated in the `dist` folder.

To preview the production build:

```bash
pnpm preview
```

## 🤝 Author

Crafted by Pauline as part of a technical assessment.
