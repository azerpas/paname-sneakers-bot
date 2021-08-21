import { buildSchema } from 'type-graphql';
import resolvers from '@api/resolvers';

export const schema = buildSchema({
    resolvers
});