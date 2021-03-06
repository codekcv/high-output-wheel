import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { AppProvider } from "src/context";
import { AppProps } from "next/app";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
  }
`;

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/api"
      : "https://high-output-wheel.vercel.app/api",
});

console.log(
  1,
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://high-output-wheel.vercel.app/api"
);

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => (
  <ApolloProvider client={client}>
    <AppProvider>
      <GlobalStyles />
      <Component {...pageProps} />
    </AppProvider>
  </ApolloProvider>
);
export default MyApp;
