const { gql } = require("graphql-tag");

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
    category: String
    year: Int
  }

  type User {
    id: ID!
    username: String!
    email: String!
    role: String
  }

  type Query {
    getAllBooks: [Book]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): String
    
    login(username: String!, password: String!): String
    addBook(title: String!, author: String!, category: String, year: Int): Book
  }
`;

module.exports = typeDefs;