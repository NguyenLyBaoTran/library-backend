# Library Management System (Dual-API Architecture)

This project is a Library Management System built with Node.js, Express, Sequelize, and Apollo Server. It implements a dual-stack API design, supporting both RESTful and GraphQL endpoints to manage books, users, and borrowing records.

## Tech Stack
- Backend: Node.js, Express.js
- APIs: GraphQL (Apollo Server), REST API
- Database: MySQL (Hosted on Railway)
- ORM: Sequelize
- Security: JWT (JSON Web Tokens), Bcrypt

## Deployment Information
- Live API URL: https://library-backend-production-244f.up.railway.app/
- GraphQL Endpoint: https://library-backend-production-244f.up.railway.app/graphql
- REST Base URL: https://library-backend-production-244f.up.railway.app/api/books
- Frontend Integration: Ready for connection via Apollo Client or Axios.

## Key Features
- Dual-API Design: Full support for REST and GraphQL to compare efficiency (Over-fetching/Under-fetching).
- Authentication and Authorization: Stateless security using JWT.
- Role-based Access Control: Differentiation between Admin (Manage inventory/returns) and User (Borrow books).
- Stateless Architecture: No session storage, ensuring high scalability.

---

## Project Structure

```text
server/
├── config/          # Database connection (Sequelize)
├── controllers/     # REST API business logic
├── graphql/         # GraphQL Schema (typeDefs) and Resolvers
├── middleware/      # JWT Authentication & Role-based access
├── models/          # Sequelize Models (Book, User, BorrowRecord)
├── routes/          # REST API route definitions
├── .env.example     # Template for environment variables
└── server.js        # Entry point (Express + Apollo Server)

```

---

## Setup Instructions

### 1. Prerequisites

* Node.js (v16 or higher).
* MySQL instance (Local or Railway Cloud).

### 2. Installation

1. Clone the repository:

```bash
git clone [https://github.com/NguyenLyBaoTran/library-system.git](https://github.com/NguyenLyBaoTran/library-system.git)

```

2. Navigate to the server directory:

```bash
cd server

```

3. Install dependencies:

```bash
npm install

```

### 3. Environment Configuration

Create a .env file in the /server directory based on the .env.example:

```env
PORT=5000
DB_HOST=your_host
DB_PORT=your_port
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=railway
JWT_SECRET=your_secret_key

```

### 4. Running the Server

```bash
# Development mode
npm run dev

```

---

## Testing Credentials (REQUIRED)

| Role | Username | Password | Permissions |
| --- | --- | --- | --- |
| Admin | admin_library | password123 | Full CRUD, Confirm Returns |
| User | user_test | password123 | View books, Borrow books |

---

## API Documentation & Comparison

### 1. GraphQL Endpoint

* URL: https://library-backend-production-244f.up.railway.app/graphql
* Solution for Over-fetching: Clients can request only necessary fields.

```graphql
query {
  getAllBooks {
    id
    title
    published_year
    isAvailable
  }
}

```

### 2. RESTful Endpoints

* Base URL: https://library-backend-production-244f.up.railway.app/api/books
* Fixed Structure: Always returns all fields defined in the controller.
* GET /api/books: Fetch available books.
* GET /api/books/:id: Fetch specific book details with borrow history.
* POST /api/books: Create new book (Admin only).
* DELETE /api/books/:id: Remove book (Admin only).

---

## Implementation Detail (Rubric ID: 3)

This system serves as a technical benchmark for evaluating API performance:

1. Over-fetching Analysis:
The REST endpoint (/api/books) returns large JSON objects containing timestamps and full metadata. Using GraphQL, the frontend reduces payload size by selecting only essential fields.
2. Under-fetching Analysis:
To display a book's detail along with its borrow records, REST may require multiple calls. GraphQL resolves this in a single request using nested Resolvers, improving network efficiency.
3. Data Consistency:
Both API styles share the same Sequelize Models, ensuring that any "isAvailable" update via a GraphQL Mutation is immediately reflected in REST API queries.