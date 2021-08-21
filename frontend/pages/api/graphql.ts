import * as admin from 'firebase-admin';
import adminApp from '@utils/auth/admin';

import cors from 'micro-cors';
import "reflect-metadata";

import { applyMiddleware } from 'graphql-middleware';
import { ApolloServer } from 'apollo-server-micro';
import { buildSchema } from 'type-graphql';
import resolvers from '@api/resolvers';
import meMiddleware from '@api/middleware/global/me';
import sentryMiddleware from '@api/middleware/global/sentry';

import {ServerResponse, ServerRequest} from '@typeDefs/server';
import { Context } from '@typeDefs/resolver';

export const config = {
    api: {
        bodyParser: false,
    },
}

export default async (req: ServerRequest, res: ServerResponse) => {
    const withCors = cors({
        origin: '*',
    });

    const schema = await buildSchema({
        resolvers,
        dateScalarMode: 'isoDate',
    });

    const server = new ApolloServer({ 
        schema: applyMiddleware(schema, meMiddleware, sentryMiddleware), 
        context: async({req, res, apolloClient, me}): Promise<Context> => {
            return {
                request: req,
                response: res,
                apolloClient: apolloClient
            }
        },
        tracing: true, 
        engine: { reportSchema: true } }
    );
    
    const handler = withCors(
        server.createHandler({ path: '/api/graphql' })
    );

    return handler(req, res);
}