import { gql } from "@apollo/client";
import client from "./apolloClient";

export async function loginUser(
  username,
  password
) {
  const mutation = gql`
    mutation {
      login(
        username: "${username}"
        password: "${password}"
      )
    }
  `;

  const result = await client.mutate({
    mutation,
  });

  return result.data.login;
}

export async function registerUser(username, email, password) {
  const mutation = gql`
    mutation {
      register(
        username: "${username}"
        email: "${email}"
        password: "${password}"
      )
    }
  `;

  const result = await client.mutate({
    mutation,
  });

  return result.data.register;
}

export async function getAllBooks() {
  const query = gql`
    query {
      getAllBooks {
        id
        title
        author
        category
        year
        isAvailable
      }
    }
  `;

  const result = await client.query({
    query,
    fetchPolicy: "no-cache",
  });

  return result.data.getAllBooks;
}

export async function borrowBook(
  book_id
) {
  const mutation = gql`
    mutation {
      borrowBook(
        book_id: "${book_id}"
      ) {
        id
        status
      }
    }
  `;

  const result = await client.mutate({
    mutation,
  });

  return result.data.borrowBook;
}