import {
    ObjectType,
    Field,
    Arg,
    Ctx,
    Resolver,
    Mutation,
    UseMiddleware,
    Query,
} from 'type-graphql';

import firebase from '@utils/auth/client';
import firebaseAdmin from '@utils/auth/admin';
import { userRoles } from "@utils/api/rest";

import { Context } from '@typeDefs/resolver';
import { EXPIRES_IN } from '@constants/cookie';

import checkRecaptcha from '@services/google/recaptcha';
import { keyExists } from '@services/firestore/index';
import { ApolloError } from 'apollo-server';
import { v4 as uuidv4, v4 } from 'uuid';
import { addToGroup } from '@services/mailchimp';

const SCORE = process.env.RECAPTCHA_SCORE_BYPASS || 0.3;

@ObjectType()
class SessionToken {
  @Field()
  token: string;
  @Field()
  accessToken: string;
}

@ObjectType()
class SessionKey {
    @Field()
    uuid: string;
    @Field()
    type: string;
}

@Resolver()
export default class SessionResolver {

    @Query(() => SessionKey)
    async KeyValid(
        @Arg('uuid') uuid: string
    ): Promise<SessionKey>{
        const key = await keyExists(uuid);
        if(key){
            return { uuid: uuid, type: key.type }
        }
        else{
            throw Error("Canno't find key");
        }
    }

    @Mutation(() => SessionToken)
    async SignUp(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Arg('recaptcha') recaptcha: string,
        @Arg('key') key: string,
        @Arg('alias') alias: string,
        @Ctx() ctx: Context
    ): Promise<SessionToken>{
        let requirements = await Promise.all([
            // 1. Check recaptcha | requirements[0]
            checkRecaptcha({response: recaptcha, ip: ctx.request.socket.remoteAddress || ""}),
            // 2. Check key firestore | requirements[1]
            keyExists(key)
        ]);
        const reqJson = await requirements[0].json();
        if(requirements[1] && requirements[0].ok && reqJson.success){
            if(reqJson.score > SCORE){
                // 3. Update Firestore
                const displayName = alias.replace(" ","");
                if(!displayName.includes("#")){
                    throw new ApolloError("Please insert a valid Discord ID (Ex: 'John#1432')")
                }
                const newUser = await firebaseAdmin.auth().createUser({email, password, displayName});
                
                // 4. Get ID Token
                const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
                if (!user) {
                    throw new Error('No user found.');
                }
                const idToken = await user.getIdToken();

                // TODO: 5 6 7 8 can be done at the same time, they're independant : Promise.all
                // 5. Modify user roles in API
                await userRoles(idToken, {uid: user.uid, roles: [`ROLE_USER`, `ROLE_${requirements[1].type.toUpperCase()}`], balance: 0.0, type: requirements[1].type})

                // 6. Flag key to user
                await firebaseAdmin.firestore().collection("keys").doc(requirements[1].uid).update({uid: user.uid});
                
                // 7. Create cookie
                const token = await firebaseAdmin.auth().createSessionCookie(idToken, { expiresIn: EXPIRES_IN, });

                // 8. We manage the session ourselves.
                await firebase.auth().signOut();
                
                // TODO: send mail
                return {token, accessToken: idToken};
            }else{
                // Score too low
                throw Error("Error reaching Recaptcha servers [ES]");
            }
        }else{
            if(!requirements[1]){
                // Key's not valid
                throw Error("Key is either invalid or already used");
            }
            if(!requirements[0].ok){
                // Can't reach Google Recaptcha
                throw Error("Error reaching Recaptcha servers [ER]");
            }
            if(!reqJson.success){
                // Google Recaptcha error codes
                throw Error("Google canno't read your reCaptcha answer. Please refresh the page. Error: "+reqJson["error-codes"].join(" | "))
            }
            throw Error(`Unknown error: \nK: ${requirements[1]}, OK:${requirements[0].ok}, S: ${reqJson.success}`);
        }
    }

    @Mutation(() => SessionToken)
    async LogIn(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Arg('recaptcha') recaptcha: string,
        @Ctx() ctx: Context
    ): Promise<SessionToken>{

        let requirements = await Promise.all([
            // 1. Check recaptcha | requirements[0]
            checkRecaptcha({response: recaptcha, ip: ctx.request.socket.remoteAddress || ""}),
        ]);
        const reqJson = await requirements[0].json();
        if(requirements[0].ok && reqJson.success){
            if(reqJson.score > SCORE){
                const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);
                if (!user) {
                    throw new Error('No user found.');
                }
                const idToken = await user.getIdToken();

                const token = await firebaseAdmin.auth().createSessionCookie(idToken, { expiresIn: EXPIRES_IN, });

                if(!token){
                    throw new Error('Error while getting token.')
                }
                // TODO: Verify uid is still linked to a key
                // We manage the session ourselves.
                await firebase.auth().signOut();
                return { token, accessToken: idToken }
            }
            else{
                // Score too low
                throw Error("Error reaching Recaptcha servers [ES]");
            }
        }else{
            if(!requirements[0].ok){
                // Can't reach Google Recaptcha
                throw Error("Error reaching Recaptcha servers [ER]");
            }
            if(!reqJson.success){
                // Google Recaptcha error codes
                throw Error("Google canno't read your reCaptcha answer. Please refresh the page. Error: "+reqJson["error-codes"].join(" | "));
            }
            throw Error(`Unknown error: \nK: ${requirements[1]}, OK:${requirements[0].ok}, S: ${reqJson.success}`);
        }
    }

    @Mutation(() => SessionToken)
    async SignUpBasic(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Arg('recaptcha') recaptcha: string,
        @Arg('alias') alias: string,
        @Ctx() ctx: Context
    ): Promise<SessionToken>{

        let requirements = await Promise.all([
            // 1. Check recaptcha | requirements[0]
            checkRecaptcha({response: recaptcha, ip: ctx.request.socket.remoteAddress || ""}),
        ]);

        const reqJson = await requirements[0].json();
        if(requirements[0].ok && reqJson.success){
            if(reqJson.score > SCORE){
                // 3. Update Firestore
                const newUser = await firebaseAdmin.auth().createUser({email, password});
                const userData = {
                    roles: ["ultimate", "user"],
                    email: email
                }
                const [key, meta, {user}] = await Promise.all([
                    firebaseAdmin.firestore().collection("keys").add({type: "ultimate", uid: newUser.uid, uuid: uuidv4()}),
                    firebaseAdmin.firestore().collection("users").doc(newUser.uid).set(userData),
                    firebase.auth().signInWithEmailAndPassword(email, password)
                ]);
                if (!user) {
                    throw new Error('No user found.');
                }

                const [_, idToken] = await Promise.all([
                    user.updateProfile({displayName: alias}),
                    user.getIdToken()
                ]);
                if(!process.env.MAILCHIMP_INTEREST_PLAN || !process.env.MAILCHIMP_INTEREST_ULTIMATE) throw new Error('Issue #1 with mailchimp, please contact an admin');
                const [__, token, ___] = await Promise.all([
                    userRoles(idToken, {uid: user.uid, roles: [`ROLE_USER`, `ROLE_ULTIMATE`], balance: 2.0, type: "ultimate"}),
                    firebaseAdmin.auth().createSessionCookie(idToken, { expiresIn: EXPIRES_IN, }),
                    firebase.auth().signOut(),
                    addToGroup({
                        email,
                        interests: {[process.env.MAILCHIMP_INTEREST_ULTIMATE]: true}
                    })
                ]);
                // TODO: send mail
                return { token, accessToken: idToken }
            }else{
                // Score too low
                throw Error("Error reaching Recaptcha servers [ES]");
            }
        }else{
            if(!requirements[0].ok){
                // Can't reach Google Recaptcha
                throw Error("Error reaching Recaptcha servers [ER]");
            }
            if(!reqJson.success){
                // Google Recaptcha error codes
                throw Error("Google canno't read your reCaptcha answer. Please refresh the page. Error: "+reqJson["error-codes"].join(" | "));
            }
            throw Error(`Unknown error: \nK: ${requirements[1]}, OK:${requirements[0].ok}, S: ${reqJson.success}`);
        }
    }
}