import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';

import withApollo from 'next-with-apollo';
import {signOut} from '@utils/auth/sessionHandler';
import { Context } from '@typeDefs/resolver';
const httpLink = new HttpLink({
  uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/graphql`,
  credentials: 'same-origin',
});

//@ts-ignore
const getErrorLink = (ctx: Context = { req: null, res: null }) =>
  onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(
        ({ message, extensions, locations, path }) => {
          console.log('GraphQL error:', message, extensions);
          //@ts-ignore
          if (extensions.code === 'UNAUTHENTICATED') {
            signOut(ctx.req, ctx.res, ctx.apolloClient);
          }
          //@ts-ignore
          if (extensions.code === 'FORBIDDEN') {
            signOut(ctx.req, ctx.res, ctx.apolloClient);
          }
        }
      );
    }

    if (networkError) {
      console.log('Network error', networkError);

      //@ts-ignore
      if (networkError.statusCode === 401) {
        //@ts-ignore
        signOut(ctx.request, ctx.response, ctx.apolloClient);
      }
    }
  });

export default withApollo(
  ({ ctx, headers, initialState }) =>
    new ApolloClient({
      //@ts-ignore
      link: getErrorLink(ctx).concat(httpLink),
      cache: new InMemoryCache().restore(initialState || {}),
    })
);