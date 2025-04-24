📅 Meeting Room Booking App
A full-stack web application that allows users to search and book meeting rooms based on their availability.

✅ Backend: NestJS + Prisma (SQLite)

🛠️ Frontend: Vue 3 + TypeScript (WIP)

📂 Project Structure
adlin/
├── backend/
│ └── api/ → NestJS REST API
└── frontend/ → Vue 3 app (to be implemented)

🔧 Backend – API (NestJS)
🚀 Tech Stack
NestJS with TypeScript

Prisma ORM (SQLite)

Jest for unit testing

Swagger for documentation

📦 Setup
cd backend/api

1. Install dependencies
   npm install

2. Generate the database
   npx prisma migrate dev --name init

3. Seed with sample data
   npx prisma db seed

4. Start the server
   npm run start:dev

📚 API Documentation
Available at:
http://localhost:3000/api

Swagger includes all endpoints with query params, payload examples, and error cases.

🔗 API Endpoints
GET /rooms
List all rooms
Optional query parameters:

capacity (min number of people)

equipment (TV or Retro Projecteur)

GET /reservations
List all reservations between two dates
Required query parameters:

startDate

endDate

POST /reservations
Create a new reservation if the room is available

PUT /reservations/:id
Update a reservation's start and end date (conflict-checked)

DELETE /reservations/:id
Delete a reservation by ID

🧪 Run Tests
cd backend/api
npm run test

Unit tests are implemented using Jest. Prisma is mocked and the conflict detection logic is tested.

🖥️ Frontend (coming soon)
The frontend will be developed in frontend/ using:

Vue 3 + TypeScript

Pinia (state management)

Vite (build tool)

Lightweight UI and unit tests

Users will be able to search rooms, view reservations, and book/edit/delete without authentication.

🤝 Author
Crafted by Pauline as part of a technical assessment.
