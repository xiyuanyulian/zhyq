import {ApolloLink, GraphQLRequest} from '@apollo/client/core';
import { HttpHeaders } from '@angular/common/http';


// import { setContext } from 'apollo-link-context';


const authLink = new ApolloLink((operation, forward) => {
  let headers = {};
  // const jwt: string = authService.getJwt();
  const jwt = 'nifoo';

  if (!jwt) {
    headers = {};
  } else {
    headers = { Authorization: `Bearer ${jwt}` };
  }

  operation.setContext({
    headers: new HttpHeaders(headers),
  });
  return forward(operation);
});

export { authLink };
