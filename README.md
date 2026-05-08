Library System - REST vs GraphQL Implementation

1. Project Overview

This project is a Library Management System developed as part of the Web Programming & Applications course.  
It demonstrates the comparison between REST API and GraphQL API in terms of performance, flexibility, and data fetching efficiency.

The system includes:
- Backend API using Node.js and Express
- Database using MySQL
- RESTful API implementation
- GraphQL API implementation using Apollo Server
- Frontend built with Next.js
- Benchmark comparison between REST and GraphQL

2. Technology Stack

Frontend:
- Next.js
- React
- CSS / TailwindCSS

Backend:
- Node.js
- Express.js
- Sequelize ORM
- GraphQL (Apollo Server)
- REST API

Database:
- MySQL

3. Project Structure

See full structure in project root folder:
- client/: Frontend application
- server/: Backend application
- docs/: UML diagrams and report
- presentation/: Slides and video

4. Installation Guide

Step 1: Clone repository
git clone <repository-url>

Step 2: Backend setup
cd server
npm install

Step 3: Create environment file
Create .env file in server folder:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_db
PORT=5000

Step 4: Run backend
npm run dev

Step 5: Frontend setup
cd client
npm install
npm run dev

5. API Architecture

REST API:
- /api/books
- /api/users
- /api/borrow

GraphQL API:
- Query: books, users
- Mutation: createBook, updateBook, deleteBook

6. System Architecture

The system follows a 3-tier architecture:
- Presentation Layer: Next.js frontend
- Application Layer: Express backend
- Data Layer: MySQL database

7. Key Features

- Book management (CRUD)
- User management
- Borrow/Return system
- JWT Authentication
- REST API implementation
- GraphQL API implementation
- Performance comparison dashboard

8. Benchmark Analysis

The project compares:
- REST over-fetching and under-fetching issues
- GraphQL single-request efficiency
- Payload size differences
- Network request comparison

9. Authors

Trân - Backend Lead
Vy - Frontend Lead

10. Notes

- .env file is ignored for security reasons
- node_modules is excluded from repository
- Database must be running before backend startup