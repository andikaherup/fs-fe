import { ApolloClient, InMemoryCache, DefaultOptions } from '@apollo/client';

const defaultOptions: DefaultOptions = {
    watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
    },
    query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
    },
};

const apolloClient = new ApolloClient({
    uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
    cache: new InMemoryCache(),
    defaultOptions,
});

export default apolloClient;