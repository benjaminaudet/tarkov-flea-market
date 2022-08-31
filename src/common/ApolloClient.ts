import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

// Cache implementation
const cache = new InMemoryCache()

await persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
});

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: 'https://api.tarkov.dev/graphql',
})

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})