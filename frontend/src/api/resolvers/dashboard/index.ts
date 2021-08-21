import { ObjectType, Resolver, Mutation, Field, Arg, InputType, ID, Ctx, UseMiddleware } from "type-graphql"
import firebaseAdmin from '@utils/auth/admin';
import { fetcher } from '@utils/api/rest';
import { Context } from '@typeDefs/resolver';
import { ApolloError, ForbiddenError } from "apollo-server";
import { isAuthenticated } from "@api/middleware/resolver/isAuthenticated";
import { FirebaseUser } from "@entity/FirebaseUser";

import getConnection from "../../../index";
import { getRaffle, updateBalance } from "@services/api";
import { cCost } from "@constants/tasks";

@InputType()
class TaskInfos {
    @Field()
    size: string;
    @Field()
    email: string;
    @Field()
    fname: string;
    @Field()
    lname: string;
    @Field({ nullable: true })
    phone?: string;
    @Field({ nullable: true })
    housenumber?: string;
    @Field({ nullable: true })
    address?: string;
    @Field({ nullable: true })
    address2?: string;
    @Field({ nullable: true })
    state?: string;
    @Field({ nullable: true })
    city?: string;
    @Field({ nullable: true })
    zip?: string;
    @Field({ nullable: true })
    country?: string;
    @Field({ nullable: true })
    utils?: string;
    @Field({ nullable: true })
    instagram?: string;
    @Field({ nullable: true })
    faking?: string;
    @Field({ nullable: true })
    paypal?: string;
    @Field({ nullable: true })
    birthdate?: string;
    @Field({ nullable: true })
    username?: string;
}

@ObjectType()
class TaskResponse {
    @Field()
    success: boolean;
    @Field({ nullable: true })
    error?: string;
    @Field({ nullable: true })
    code?: string;
}

@Resolver()
export default class DashboardResolver {
    @Mutation(() => TaskResponse)
    @UseMiddleware(isAuthenticated)
    async CreateTasks(
        @Arg("website", type => ID) website: string,
        @Arg("tasks", type => [TaskInfos]) tasks: TaskInfos[],
        @Arg("raffle", type => ID) raffle: number,
        @Ctx() ctx: Context
    ): Promise<TaskResponse>{
        // Identify User through context and Firebase Admin
        // Multiple API calls (Promise)
        // 1. Verify balance 
        // 2. Get Website and Estimated needs (also if website is valid, up, etc...)
        // 3. Compare balance and estimated
        // ------
        // 4. Remove needed credit from user balance
        // ? Use Admin Credentials to do this kind of operations? + admin token? | admin.auth().createCustomToken(uid)
        // https://firebase.google.com/docs/auth/admin/create-custom-tokens#create_custom_tokens_using_the_firebase_admin_sdk
        // 5. Push to batch and commit
        // Requirements
        const token = ctx.request.cookies.token;
        const strict = true;
        try {
            var requirements = await Promise.all([
                getUser(ctx),//fetcher(process.env.NEXT_PUBLIC_API+"/user",token, strict),
                fetcher(process.env.NEXT_PUBLIC_API+website,token, strict),
                getRaffle(raffle) // TODO: graphql pour pas tout récup
            ]);
        } catch (error) {
            if(error instanceof ForbiddenError){
                throw new ForbiddenError(`Forbidden: ${error.message}`);
            }
            if(error === "404") throw new ApolloError("Ressource not found"); 
            throw new ApolloError("(Code 1002): "+error);
        }
        // 1. 2. & 3.
        if(requirements[1].published !== true){
            throw new ForbiddenError("You do not have access to this website");
        }
        const {balance, paying} = requirements[0];
        if(!paying){
            throw new ForbiddenError("It seems that you're not paying your subscription anymore. Please fix it first or contact an administrator at hello@paname.io");
        }
        if(balance){
            const valid = balanceValidation({balance, captcha: requirements[1].estimatedCaptchaCost, proxy: requirements[1].estimatedProxyCost, nbTasks: tasks.length, cloudrun: requirements[1].handledBy === "c" ? true : undefined});
            if(!valid){
                throw new ForbiddenError("Insufficient funds. Please top-up your balance.");
            }
        }else{
            throw new ForbiddenError("Please top-up your balance.");
        }
        // 4. 
        const adminUID = process.env.ADMIN_UID;
        if(!adminUID) throw new ApolloError("The Admin mixed up something... (Code 1000)");
        try {
            var adminToken = await firebaseAdmin.auth().createCustomToken(adminUID)
        } catch (error) {
            throw new ApolloError("The Admin mixed up something... (Code 1001)", error);
        }
        const amount = getTotalCost({captcha: requirements[1].estimatedCaptchaCost, proxy: requirements[1].estimatedProxyCost, nbTasks: tasks.length, cloudrun: requirements[1].handledBy === "c" ? true : undefined});
        try{
            let updatedBalance = await updateBalance(requirements[0].id, -amount);
        }catch(error){
            throw new ApolloError("Error while changing balance. (Code 1003):"+error);
        }

        // 5.
        const db = firebaseAdmin.firestore();
        try{ db.settings({ ignoreUndefinedProperties: true }); }catch(e){}

        const { firebaseId, discordWebhook, id: userId, discordWebhookError } = requirements[0];
        let errorTasks: TaskInfos[] = []
        for(let smallerArray of divideArray(tasks)){ // Divide biggest array into multiple smaller array
            const batch = db.batch();
            for(let task of smallerArray){
                // 6. Check if contains required fields from requirements[1].fields : array
                let result: boolean;
                try {
                    result = verifyFields(task, requirements[1].fields);
                } catch (error) {
                    throw new ApolloError(error);
                }
                if(!result){
                    errorTasks.push(task);
                }else{
                    let ref = db.collection("tasks").doc();
                    batch.set(ref, {
                        site: {
                            id: website, name: requirements[1].name, handledBy: requirements[1].handledBy
                        }, 
                        raffle: {
                            url: requirements[2].url,
                            id: requirements[2].id,
                            
                            raffleType: requirements[2].raffleType,
                            product: {
                                id: requirements[2].product.id,
                                name: requirements[2].product.name,
                                colorway: requirements[2].product.colorway || "",
                                pid: requirements[2].product.pid || "",
                                price: requirements[2].product.price || 0,
                                imageUrl: requirements[2].product.imageUrl || "",
                                releaseAt: requirements[2].product.releaseAt || new Date()
                            }
                        },
                        profile: {
                            ...task
                        }, 
                        user: {firebaseId, discordWebhook, errorWebhook: discordWebhookError , userId},
                        addedAt: new Date().getTime()
                    });
                }
            }
            await batch.commit();
        }
        return { success: true, error: errorTasks.length > 0 ? `${JSON.stringify(errorTasks)}` : "false"/*, errorTasks: errorTasks.length > 0 ? errorTasks : undefined */}
    }
}

const balanceValidation = ({balance, captcha, proxy, nbTasks, cloudrun}: {balance: number, captcha: number, proxy: number, nbTasks: number, cloudrun?: boolean}): boolean => {
    let capTasks = 0;
    let proxyTasks = 0;
    let cloudrunTasks = 0;
    if(captcha){
        capTasks = (captcha * nbTasks);
        if(balance < capTasks) return false;
    }
    if(proxy){
        proxyTasks = (proxy * nbTasks);
        if(balance < proxyTasks) return false;
    }
    // Proxy + Captcha
    if(balance < (capTasks + proxyTasks)) return false;
    // Proxy + Captcha + ?cloudrun
    if(cloudrun){
        cloudrunTasks = nbTasks * cCost;
        if(balance < cloudrunTasks) return false;
        if(balance < (capTasks + proxyTasks + cloudrunTasks)) return false;
    }
    return true;
}

const getTotalCost = ({captcha, proxy, nbTasks, cloudrun}: {captcha: number, proxy: number, nbTasks: number, cloudrun?: boolean}): number => {
    let amount = (captcha * nbTasks) + (proxy * nbTasks) + (cloudrun ? (cCost * nbTasks) : 0.0);
    amount = amount < 0.01 ? 0.01 : amount; // if inferior to 0.1 floor to 0.1
    return amount;
}

const divideArray = (tasks: TaskInfos[]) => {
    const size = 500; 
    let arrayOfArrays = [];
    for (var i=0; i<tasks.length; i+=size) {
        arrayOfArrays.push(tasks.slice(i,i+size));
    }
    return arrayOfArrays;
}

const getUser = async (ctx: Context): Promise<FirebaseUser> => {
    try {
        const connection = await getConnection();
        const userRepo = await connection.getRepository(FirebaseUser);
        const user = await userRepo.findOne({firebaseId: ctx.me!.uid});
        if(user){
            if(!user.customerId){
                throw new ForbiddenError("No customerId found.");
            }
            return user;
        }else{
            throw new ForbiddenError("No user found.");
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

const verifyFields = (task: TaskInfos, fields: string[]): boolean => {
    const userFields = Object.keys(task);
    const missingFields = fields.filter(i => userFields.indexOf(i) < 0);
    if(missingFields.length === 0){
        return true
    }else{
        throw new Error("Some fields might be missing: "+JSON.stringify(missingFields))
    }
}