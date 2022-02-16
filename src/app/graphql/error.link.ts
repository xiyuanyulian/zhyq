import {split, concat, from, ApolloLink} from '@apollo/client/core';
import {WebSocketLink} from '@apollo/client/link/ws';
import {onError} from '@apollo/client/link/error';
import { HttpHeaders } from '@angular/common/http';




const errorLink = onError(({ graphQLErrors, networkError, operation, forward, response }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

export { errorLink };
