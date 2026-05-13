import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
} from "@apollo/client";

import { HttpLink } from "@apollo/client/link/http";

const httpLink = new HttpLink({
  uri: "https://library-backend-production-244f.up.railway.app/graphql",
});

const authLink = new ApolloLink(
  (operation, forward) => {
    let token = null;

    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }

    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        authorization: token
          ? `Bearer ${token}`
          : "",
      },
    }));

    return forward(operation);
  }
);

const client = new ApolloClient({
  link: authLink.concat(httpLink),

  cache: new InMemoryCache(),
});

export default client;