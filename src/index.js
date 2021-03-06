import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";

import App from "./App";
import reportWebVitals from "./reportWebVitals";

const httpLink = createHttpLink({
  uri: "https://serene-meadow-46088.herokuapp.com/",
});

const authLink = setContext((request, previousContext) => {
  const token = localStorage.getItem("jwtToken");
  return { headers: { authorization: token ? `Bearer ${token}` : "" } };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
