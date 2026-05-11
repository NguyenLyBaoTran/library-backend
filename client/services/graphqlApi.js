import { gql } from "@apollo/client";

import client from "./apolloClient";

export async function loginUser(
  username,
  password
) {
  const LOGIN_MUTATION = gql`
    mutation Login(
      $username: String!
      $password: String!
    ) {
      login(
        username: $username
        password: $password
      )
    }
  `;

  const result = await client.mutate({
    mutation: LOGIN_MUTATION,
    variables: {
      username,
      password,
    },
  });

  return result.data.login;
}

// REGISTER
export async function registerUser(
  username,
  email,
  password
) {
  const REGISTER_MUTATION = gql`
    mutation Register(
      $username: String!
      $email: String!
      $password: String!
    ) {
      register(
        username: $username
        email: $email
        password: $password
      )
    }
  `;

  const result = await client.mutate({
    mutation: REGISTER_MUTATION,
    variables: {
      username,
      email,
      password,
    },
  });

  return result.data.register;
}

export async function getAllBooks() {
  const GET_BOOKS = gql`
    query {
      getAllBooks {
        id
        title
        author
        category
        year
      }
    }
  `;

  const result = await client.query({
    query: GET_BOOKS,
    fetchPolicy: "no-cache",
  });

  return result.data.getAllBooks;
}

export async function addBook(
  title,
  author,
  category,
  year
) {
  const ADD_BOOK_MUTATION = gql`
    mutation AddBook(
      $title: String!
      $author: String!
      $category: String
      $year: Int
    ) {
      addBook(
        title: $title
        author: $author
        category: $category
        year: $year
      ) {
        id
        title
      }
    }
  `;

  const result = await client.mutate({
    mutation: ADD_BOOK_MUTATION,
    variables: {
      title,
      author,
      category,
      year,
    },
  });

  return result.data.addBook;
}