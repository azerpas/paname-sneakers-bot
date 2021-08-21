import { MiddlewareFn } from 'type-graphql';
import { ForbiddenError } from 'apollo-server';

import { Context } from '@typeDefs/resolver';

export const isAuthenticated: MiddlewareFn<Context> = async (
  { context },
  next
) => {
  if (!context.me) {
    throw new ForbiddenError('Not authenticated as user.');
  }

  return next();
};
