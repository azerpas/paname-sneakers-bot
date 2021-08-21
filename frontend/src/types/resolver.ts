import { ServerRequest, ServerResponse } from './server'
import { User } from '@typeDefs/user'
import { ApolloClient } from 'apollo-client';
import { NormalizedCacheObject } from '@apollo/react-hooks';

export type Context = {
    request: ServerRequest;
    response: ServerResponse;
    res?: ServerResponse;
    req?: ServerRequest;
    me?: User;
    apolloClient: ApolloClient<NormalizedCacheObject>;
}