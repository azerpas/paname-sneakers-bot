import {
    ObjectType,
    Field,
    Arg,
    Ctx,
    Resolver,
    Mutation,
    Query,
} from 'type-graphql';

import { Context } from '@typeDefs/resolver';

import checkRecaptcha from '@services/google/recaptcha';
import {addContact} from '@services/mailchimp';

const SCORE = process.env.RECAPTCHA_SCORE_BYPASS || 0.3;

@ObjectType()
class MailSession {
    @Field()
    id: string;
}

@Resolver()
export default class MailResolvers {
    @Mutation(() => MailSession)
    async SignUpMail(
        @Arg("recaptcha") recaptcha: string,
        @Arg("email") email: string,
        @Arg("firstName") firstName: string,
        @Arg("lastName") lastName: string,
        @Ctx() ctx: Context
    ): Promise<MailSession>{
        const requirement = await checkRecaptcha({response: recaptcha, ip: ctx.request.socket.remoteAddress || ""})
        const reqJson = await requirement.json();
        if(requirement.ok && reqJson.success){
            if(reqJson.score > SCORE){
                const id = await addContact({ 
                    listId: process.env.MAILCHIMP_AUDIENCE_ID || '',
                    email,
                    firstName,
                    lastName 
                })
                return {id}
            }
            else{
                throw Error("Error reaching Recaptcha servers [ES]");
            }
        }else{
            if(!requirement.ok){
                // Can't reach Google Recaptcha
                throw Error("Error reaching Recaptcha servers [ER]");
            }
            if(!reqJson.success){
                // Google Recaptcha error codes
                throw Error("Google canno't read your reCaptcha answer. Please refresh the page. Error: "+reqJson["error-codes"].join(" | "));
            }
            else{
                throw Error(`Unknown error: \nOK:${requirement.ok}, S: ${reqJson.success}`);
            }
        }
        
    }
}