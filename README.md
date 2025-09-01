# TodoListApplication

A modern, full-stack todo list application built with Vue 3, TypeScript, and Node.js.

## Features
- Create and complete todo list items
- Mark todos as complete/incomplete
- Edit existing todos
- Delete todos with confirmation
- Responsive design with Tailwind CSS

## Tech Stack
Frontend:
- Vue 3 with Composition API
- TypeScript
- Vite for build tooling
- Vitest for testing
- Tailwind CSS for styling
- Heroicons for icons

Backend:
- Node.js with Express
- TypeScript
- TypeORM for database operations
- PostgreSQL database
- Jest for testing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Docker (for PostgreSQL)
- npm or yarn

## Database Setup
This application uses a postgres database. I set mine up with docker. 
I also used TypeORM for object-relational mapping and data migrations. 

1. `docker pull postgres`
2. `docker run --name todoListPostgres -e POSTGRES_PASSWORD=<yourpassword> -p 5432:5432 -d postgres`
3. Navigate to \ToDoListServer
4. create .env file, using the .env.example file as a guide
5. run migrations by running `npx typeorm-ts-node-commonjs migration:run -d src/data-source.ts`

# Database considerations
since this is a sample project, I did not add the ability for different users to have different to do lists.
If I added this functionality, I would have a "users" database, and the primary key in the "users" table would be used as a foreign key in my "todoItems" table. 
I would likely use a standard login library, although I have not used enough to have a specific opinion on which one right now. 

As is, I view it as a software that a tech-savvy user can download and use themselves, if they know how to set up a database on their machine. 
Or a shared todo list that anyone can add things to, so that the entire userbase can work collaboratively to complete the same list of tasks. 

## Project Structure
```
TodoListApplication/
├── ToDoList/              # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable Vue components
│   │   ├── views/         # Page components
│   │   ├── services/      # API client layer
│   │   ├── types/         # TypeScript interfaces
│   │   └── models/        # Data models and enums
│   └── tests/             # Frontend tests
│
└── ToDoListServer/        # Backend application
    ├── src/
    │   ├── entity/        # Database models
    │   ├── migration/     # Database migrations
    │   └── tests/         # Backend tests
    └── data-source.ts     # Database configuration
```

## Running the Application

1. Start the database (if using Docker):
   ```bash
   docker start todoListPostgres
   ```

2. Start the backend:
   ```bash
   cd ToDoListServer
   npm install
   npm start
   ```

3. Start the frontend:
   ```bash
   cd ToDoList
   npm install
   npm run dev
   ```

The application should now be running at http://localhost:5173

## Testing

Run frontend tests:
```bash
cd ToDoList
npm run test
```

Run backend tests:
```bash
cd ToDoListServer
npm run test
```

## Architecture

The application follows a 3-tier architecture:

1. **Frontend Layer** (Vue + Vite)
   - Components for UI
   - Type-safe API communication
   - Comprehensive test coverage

2. **Service Layer** (Express + TypeORM)
   - REST API endpoints
   - Database operations via TypeORM
   - Environment-based configuration

3. **Data Layer** (PostgreSQL)
   - Persistent storage
   - Migrations for schema changes
   - Docker container for easy setup

# Notes on technology and architecture choices
# API
The api is made with typescript. This was chosen mostly because this would give me experience with a typescript backend, since typescript was the preferred API language for the assignment. 

After using it, I believe it was a very good fit for this project. It's lightweight and takes next to no time to set up. Since this application only performs very simple api functions, it didn't need any of the heavier api structure I'm used to from C# and .NET Core. 

# Frontend
Vue is both what I'm most familiar with for frontend, and is what I will work on in future projects. I chose Vue for familiarity, and to demonstrate my familiarity with the language to the user. 
I've used Vite as my build tool for its fast start up capabilities. 
Vite supports TypeScript, handles environment variables easily, and supports CSS preprocessers (although I didn't use it for this project, I like Sass).

# Service Layer
My service layer is in my frontend project, in the `services` folder. This is where I put any direct calls to the api. 
Any pages that want to call my api have to go through this layer. 
If I change how I access the api, or change what api I want to use, I now only have to make changes in this one layer. 

# Security
My application is safe from SQL injection, since typeORM uses parameterized queries by default. 

# What I would do next on this app
1. I would add accessibility by adding ARIA attributes and running an accessibility tool like WAVE against my website.
2. I would add better error feedback for the user. Right now everything fails silently. For something as small and low stakes as this, I would add a toast popup on error that asked users to try again later.
3. I've been reading a book on web security. I may still, as an exercise for myself, go through the book and look for any updates that I could make to this application to practice web security. 
4. rate limiting and retry functionality. In C# I've used Polly for this, however Polly does not seem to be available for Typescript. Axios Retry is the most lightweight option, and Opossum is the heaviest. I would go with Axios Retry, since this app does not require the heaviest option. 
5. Integration tests