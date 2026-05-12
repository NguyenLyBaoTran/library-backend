const { gql } = require("graphql-tag");

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    category: String
    published_year: Int
    isAvailable: Boolean
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String
  }

  type BorrowRecord {
    id: ID!
    user_id: Int!
    book_id: Int!
    borrow_date: String
    status: String
  }

  type Query {
    getAllBooks: [Book]
    getBookById(id: ID!): Book
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): String
    
    login(username: String!, password: String!): String
    addBook(title: String!, author: String!, category: String, published_year: Int): Book
    borrowBook(book_id: ID!): BorrowRecord
    returnBook(record_id: ID!): BorrowRecord
  }
`;

module.exports = typeDefs;