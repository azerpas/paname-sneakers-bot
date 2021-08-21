import { AuthenticationError } from 'apollo-server-micro';

import firebaseAdmin from '@utils/auth/admin';

import { Context } from '@typeDefs/resolver';
import { User } from '@typeDefs/user';

export default async (
  resolve: Function,
  root: any,
  args: any,
  context: Context,
  info: any
) => {
  const { session } = context.request.cookies;

  if (!session) {
    return await resolve(root, args, context, info);
  }

  const CHECK_REVOKED = true;

  const me = await firebaseAdmin
    .auth()
    .verifySessionCookie(session, CHECK_REVOKED)
    .then(async claims => {
      return (await firebaseAdmin.auth().getUser(claims.uid)) as User;
    })
    .catch(error => {
      throw new AuthenticationError(error.message);
    });

  context.me = me;

  return await resolve(root, args, context, info);
};
