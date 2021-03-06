import { sentry } from 'graphql-middleware-sentry';
import * as Sentry from '@sentry/node';

import { Context } from '@typeDefs/resolver';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
});

export default sentry({
  sentryInstance: Sentry,
  config: {
    environment: process.env.NODE_ENV,
  },
  forwardErrors: true,
  captureReturnedErrors: true,
  withScope: (scope, error, context: Context) => {
    scope.setUser({
      id: context.me?.uid,
      email: context.me?.email,
    });

    scope.setExtra('body', context.request.body);
    scope.setExtra('origin', context.request.headers.origin);
    scope.setExtra('user-agent', context.request.headers['user-agent']);
  },
});
