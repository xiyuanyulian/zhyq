import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { split, concat, from, ApolloLink, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { getMainDefinition } from '@apollo/client/utilities';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';







import { authLink, errorLink, createWebSocketLink, createUploadLink, isUpload } from './graphql';
import { createHttpLink } from './graphql/http.link';

export function createApollo(httpLink: HttpLink) {

    let link: ApolloLink;

    const http = createHttpLink(httpLink);
    const uploadLink = createUploadLink();
    const ws = createWebSocketLink({});

    link = split(
        ({ query, variables }) => {
            const { kind, variableDefinitions } = getMainDefinition(query);
            const operation = getMainDefinition(query)['operation'];
            return kind === 'OperationDefinition' && operation === 'mutation' && isUpload({ variables });
        },
        uploadLink,
        http,
    );

    // link = concat(authLink, link); // middleware

    link = split(
        // split based on operation type
        ({ query }) => {
            const { kind } = getMainDefinition(query);
            const operation = getMainDefinition(query)['operation'];
            return kind === 'OperationDefinition' && operation === 'subscription';
        },
        ws,
        link,
    );

    return {
        link: from([authLink, errorLink, link]),
        cache: new InMemoryCache(),
    };

    // return {
    //   link:  ApolloLink.from([authLink, restLink, errorLink, retryLink, httpLink]),
    //   cache: new InMemoryCache(),
    // };
}

@NgModule({
    imports: [HttpClientModule],
    providers: [
        {
            provide: APOLLO_OPTIONS,
            useFactory: createApollo,
            deps: [HttpLink],
        },
    ],
})
export class GraphQLModule { }
