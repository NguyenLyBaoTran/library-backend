import "@/styles/globals.css";

import { ApolloProvider } from "@apollo/client/react"; 
import client from "../services/apolloClient";

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}