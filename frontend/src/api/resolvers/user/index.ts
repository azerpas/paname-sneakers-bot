import {
    ObjectType,
    Field,
    Ctx,
    Resolver,
    Query,
    UseMiddleware,
    Mutation,
    Arg,
} from 'type-graphql';
  
import { Context } from '@typeDefs/resolver';
import { isAuthenticated } from '@api/middleware/resolver/isAuthenticated';
import { FirebaseUser } from '@entity/FirebaseUser';
import getConnection from "../../../index";
import { ApolloError } from 'apollo-server';

@ObjectType()
class User {
    @Field()
    uid: string;

    @Field()
    email: string;

    @Field(type => [String])
    roles: string[];

    @Field()
    displayName: string;
}

@ObjectType()
class Settings{
    @Field()
    webhook: string | undefined;
    @Field()
    errorWebhook: string | undefined;
}
  
@Resolver()
export default class UserResolver {
    @Query(() => User)
    @UseMiddleware(isAuthenticated)
    async me(@Ctx() ctx: Context): Promise<User> {
        const rolesObject = ctx.me!.customClaims || {};

        const roles = Object.keys(rolesObject).filter(
            key => rolesObject[key]
        );

        return {
            uid: ctx.me!.uid,
            email: ctx.me!.email || '',
            roles,
            displayName: ctx.me!.displayName || ''
        };
    }

    @Mutation(() => Settings)
    @UseMiddleware(isAuthenticated)
    async settings(
        @Ctx() ctx: Context,
        @Arg("webhook") webhook?: string | undefined,
        @Arg("errorWebhook") errorWebhook?: string | undefined
    ): Promise<Settings> {
        const connection = await getConnection();
        const userRepo = await connection.getRepository(FirebaseUser);
        const user = await userRepo.findOne({firebaseId: ctx.me!.uid});
        if(!user) throw new ApolloError("Can't find you. Please contact an admin.")
        if(webhook) user.discordWebhook = webhook;
        if(errorWebhook) user.discordWebhookError = errorWebhook;
        await connection.manager.save(user);
        await connection.close();
        return {webhook, errorWebhook};
    }
}
  