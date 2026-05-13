# Library Management System (Dual-API Architecture)

This project is a Library Management System built with Node.js, Express, Sequelize, and Apollo Server. It implements a dual-stack API design, supporting both RESTful and GraphQL endpoints to manage books, users, and borrowing records.

## Deployment Information
- **Live API URL:** https://library-backend-production-244f.up.railway.app/
- **GraphQL Endpoint:** https://library-backend-production-244f.up.railway.app/graphql
- **REST Base URL:** https://library-backend-production-244f.up.railway.app/api/books
- **Frontend Integration:** (Optional) Ready for connection via Apollo Client or Axios.

## Key Features
- Dual-API Design: Full support for REST and GraphQL to compare efficiency (Over-fetching/Under-fetching).
- Authentication and Authorization: Stateless security using JWT (JSON Web Tokens).
- Role-based Access Control: Differentiation between Admin (Manage books/returns) and User (Borrow books).
- Stateless Architecture: No session storage, making it scalable and modern.

---

## Setup Instructions

### 1. Prerequisites
- Node.js installed (v16 or higher).
- MySQL database (Railway Cloud Database).

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

### 3. Running the Server

```bash
# Start server with Nodemon (Development)
npm run dev

```

---

## Environment Variables (.env)

Create a .env file in the server directory:

```env
PORT=5000
JWT_SECRET=secret
DB_NAME=railway
DB_USER=root
DB_PASSWORD=your_railway_password
DB_HOST=your_railway_host_url
DB_PORT=your_railway_port

```

---

## Testing Credentials (REQUIRED)

Use these pre-registered accounts to test the system:

| Role | Username | Password | Permissions |
| --- | --- | --- | --- |
| Admin | admin_library | password123 | Add/Update/Delete/Return Books |
| User | user_test | password123 | View books, Borrow books |

---

## API Documentation

### 1. GraphQL Endpoint

* URL: http://localhost:5000/graphql (Local) or [Your-Railway-Link]/graphql
* Use Case: Optimized for Frontend to fetch exactly what data is needed.
* Example Query (Get all available books):

```graphql
query {
  getAllBooks {
    id
    title
    isAvailable
  }
}

```

### 2. RESTful Endpoints

* Base URL: http://localhost:5000/api/books (Local) or [Your-Railway-Link]/api/books
* Use Case: Administrative tasks or checking full book history.
* Endpoints:
* GET /api/books: List all books (Shows Over-fetching).
* GET /api/books/:id: Book details with borrowing history (Shows Under-fetching).
* POST /api/books: Admin adds new books (Supports Bulk Create).
* DELETE /api/books/:id: Admin removes a book.



---

## Implementation Detail (Rubric ID: 3)

This system demonstrates how GraphQL solves Over-fetching (by allowing clients to select specific fields) and how REST can suffer from Under-fetching (requiring multiple calls or large nested objects to get related data like BorrowRecords). Both APIs share the same Sequelize Models to ensure data consistency and system integrity.
