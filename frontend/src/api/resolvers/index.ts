import { NonEmptyArray } from 'type-graphql';

import SessionResolvers from './session';
import UserResolvers from './user';
import DashboardResolvers from './dashboard';
import StripeResolvers from './stripe';
import MailResolvers from './mail';

export default [
    SessionResolvers,
    UserResolvers,
    DashboardResolvers,
    StripeResolvers,
    MailResolvers
] as NonEmptyArray<Function>;