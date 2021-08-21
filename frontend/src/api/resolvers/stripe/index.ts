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
import { ApolloError, ForbiddenError, ValidationError } from 'apollo-server';
import getConnection from "../../../index";

// Services
import Stripe from "stripe";
import { FirebaseUser } from '@entity/FirebaseUser';
import { getStripeTotal, getVariableFee } from '@services/stripe';
import { FIXED_FEE } from '@constants/stripe';


@ObjectType()
class Session{
    @Field({nullable: false})
    id: string;
}

@ObjectType()
class Transaction{
    @Field(type => Number)
    amount: Number;
    @Field(type => String)
    type: String;
    @Field(type => Date)
    date: Date;
}

@Resolver()
export default class StripeResolver {
    @Mutation(() => Session)
    @UseMiddleware(isAuthenticated)
    async createSession(
        @Arg("priceId") priceId: string,
        @Ctx() ctx: Context,
        @Arg("customerId", {nullable: true}) customerId?: string,
    ): Promise<Session> {
        const secret = process.env.STRIPE_SECRET;
        if(!secret) throw new ApolloError("Checkout error (2000)");
        if(!ctx.me) throw new ForbiddenError("Checkout Forbidden");
        const stripe = new Stripe(secret, { apiVersion: '2020-08-27' });
        try{
            const session = await stripe.checkout.sessions.create({
                mode: "subscription",
                payment_method_types: ["card"],
                customer: customerId,
                line_items: [
                  {
                    price: priceId,
                    quantity: 1,
                  },
                ],
                metadata:{
                    "price": priceId,
                    "userUid": ctx.me.uid
                },
                success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
                allow_promotion_codes: true
              });
              return {id: session.id}
        }catch(e){
            throw new ApolloError(e.message);
        }
    }

    @Mutation(() => Session)
    @UseMiddleware(isAuthenticated)
    async paymentIntent(
        @Arg("amount") amount: number,
        @Arg("balance") balance: boolean,
        @Arg("customerId") customerId: string,
        @Ctx() ctx: Context
    ): Promise<Session> {
        if(amount < 2) throw new ValidationError("Amount is inferior 2");
        const secret = process.env.STRIPE_SECRET;
        if(!secret) throw new ApolloError("Checkout error (2000)");
        if(!ctx.me) throw new ForbiddenError("Checkout Forbidden");
        const stripe = new Stripe(secret, { apiVersion: '2020-08-27' });
        
        if(customerId === "cus_not_need_to_pay"){
            try {
                const connection = await getConnection();
                const userRepo = await connection.getRepository(FirebaseUser);
                const user = await userRepo.findOne({firebaseId: ctx.me!.uid});
                if(user){
                    const customer = await stripe.customers.create();
                    user.customerId = customer.id;
                    customerId = customer.id;
                    await connection.manager.save(user);
                    await connection.close();
                }else{
                    throw new ForbiddenError("No user found.");
                }
            }catch(error){
                throw new ApolloError(`Error while trying to set your customer id, error (2020). ${error.message}`);
            }
        }
        const chargeAmount = amount;
        amount = getStripeTotal(amount);
        try{
            const session = await stripe.paymentIntents.create({
                amount,
                currency: "EUR",
                customer: customerId,
                metadata: {
                    integration_check: 'accept_a_payment',
                    type: balance ? "balance" : null,
                    userUid: ctx.me.uid,
                    chargeAmount
                }
            });
            return {id: session.client_secret!}
        }catch(e){
            throw new ApolloError(e.message);
        }
    }

    @Query(() => Session)
    @UseMiddleware(isAuthenticated)
    async getSession(@Ctx() ctx: Context): Promise<Session> {
        try {
            const connection = await getConnection();
            const userRepo = await connection.getRepository(FirebaseUser);
            const user = await userRepo.findOne({firebaseId: ctx.me!.uid});
            if(user){
                if(!user.customerId){
                    throw new ForbiddenError("No customerId found.");
                }
                await connection.close();
                return {id: user.customerId}
            }else{
                throw new ForbiddenError("No user found.");
            }
        } catch (error) {
            console.log("Stripe Error: ");
            console.log(error);
            throw new Error(error);
        }
        
    }


    @Query(returns => [Transaction])
    @UseMiddleware(isAuthenticated)
    async paymentIntentList(
        @Arg("customerId") customerId: string,
        @Arg("limit") limit: number,
        @Ctx() ctx: Context
    ): Promise<Transaction[]> {
        const secret = process.env.STRIPE_SECRET;
        if(!secret) throw new ApolloError("Paymentlist error (2000)");
        if(!ctx.me) throw new ForbiddenError("Checkout Forbidden");
        const stripe = new Stripe(secret, { apiVersion: '2020-08-27' });

        let listOfTransactions: Transaction[] = [];

        if(customerId === "cus_not_need_to_pay"){
            return listOfTransactions;
        }

        try{
            const paymentList = await stripe.paymentIntents.list({
                limit: limit,
                customer: customerId,
            }); 
            for(var i=0; i < paymentList.data.length ; i++){
                //Convert Unix to Human date
                const milliseconds = paymentList.data[i]['created'] * 1000
                const date = new Date(milliseconds);
                const amount = paymentList.data[i]['amount'];
                const type = paymentList.data[i]['description'] === "Subscription update" ? "Subscription" : "Balance";
                
                listOfTransactions.push({date, amount, type})
            }
            return listOfTransactions;
        }catch(e){
            throw new ApolloError(e.message);
        }
        
    }

}