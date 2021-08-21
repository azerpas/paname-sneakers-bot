import Stripe from "stripe";
import { NextApiResponse, NextApiRequest } from 'next';

import getBodyRaw from "raw-body";
import { userCheckout } from "@utils/api/rest";

import firebaseAdmin from "@utils/auth/admin";
import getConnection from "../../src/index";
import { FirebaseUser } from "@entity/FirebaseUser";

export default async (
    request: NextApiRequest,
    response: NextApiResponse
) => {
    const secret = process.env.STRIPE_SECRET;
    if(!secret){
        response.status(500).json({error:"Webhook error (2000)"}); 
        return
    }
    const stripe = new Stripe(secret, { apiVersion: '2020-08-27' });

    const endpointSecret = process.env.ENDPOINT_SECRET || "";

    const rawBody = await getBodyRaw(request);
    const sig = request.headers['stripe-signature'] || "";
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
    }
    catch (err) {
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // https://stripe.com/docs/billing/subscriptions/webhooks
    switch (event.type) {
        case 'invoice.paid':
            // Continue to provision the subscription as payments continue to be made.
            // Store the status in your database and check when a user accesses your service.
            // This approach helps you avoid hitting rate limits.
            break;
        case 'customer.subscription.updated':
        case 'checkout.session.completed': {
            // @ts-ignore
            const { customer, metadata, id } = event.data.object;
            const { price, userUid } = metadata;
            try{
                if(event.type === 'checkout.session.completed'){
                    if(price !== process.env.NEXT_PUBLIC_STRIPE_SUB_ULTIMATE && price !== process.env.NEXT_PUBLIC_STRIPE_SUB_BASIC){
                        return response.status(404).send(`Webhook Error, ressource (price) not found: ${customer}`);
                    }
                }
                const connection = await getConnection();
                const userRepo = await connection.getRepository(FirebaseUser);
                console.log(`${event.type}: ${customer} or ${userUid} or ${id}`)
                const user = await userRepo.findOne(event.type === 'checkout.session.completed' ? {firebaseId: userUid} : {customerId: customer});
                if(user){
                    if(event.type === 'checkout.session.completed') { 
                        // Checking that user is not trying to trick us into paying less
                        if(user.roles.includes("ROLE_ULTIMATE")){
                            if(price !== process.env.NEXT_PUBLIC_STRIPE_SUB_ULTIMATE){
                                return response.status(403).send(`You are not an Ultimate user. There might be an error in the payment process.`);
                            }
                        }
                        if(user.roles.includes("ROLE_BASIC")){
                            if(price !== process.env.NEXT_PUBLIC_STRIPE_SUB_BASIC){
                                return response.status(403).send(`You are not an Basic user. There might be an error in the payment process.`);
                            }
                        }
                        user.customerId = customer;
                        user.subCheckoutSession = id;
                    };
                    user.paying = true;
                    await connection.manager.save(user);
                    return response.status(200).send('');
                }else{
                    return response.status(404).send(`Webhook Error, user not found: ${userUid}`);
                }
            }catch(e){
                console.log("Failed request")
                console.error(e);
                return response.status(500).send("Error while storing payment: "+e.message);
            }
            break;
        }
        case 'payment_intent.succeeded': {
            // @ts-ignore
            const { customer, metadata, id, amount } = event.data.object;
            const { type, userUid, chargeAmount } = metadata;
            if(type === "balance"){
                try {
                    const connection = await getConnection();
                    const userRepo = await connection.getRepository(FirebaseUser);
                    const user = await userRepo.findOne({firebaseId: userUid});
                    if(user){
                        user.balance = chargeAmount/100 + (user.balance ? user.balance : 0.0);
                        await connection.manager.save(user);
                        return response.status(200).send({"balance": user.balance});
                    }else{
                        return response.status(404).send(`Webhook Error, user not found: ${userUid}`);
                    }
                } catch (error) {
                    console.log("Error");
                    console.log(error);
                    return response.status(404).send(`Webhook Error, canno't get connection: ${error}`);
                }
            }
            break;
        }
        case 'invoice.payment_failed': {
            // @ts-ignore
            const { customer } = event.data.object;
            try{
                const connection = await getConnection();
                const userRepo = await connection.getRepository(FirebaseUser);
                const user = await userRepo.findOne({customerId: customer})
                if(user){
                    user.paying = false;
                    await connection.manager.save(user);
                    return response.status(200).send({"paying": user.paying});
                }else{
                    // TODO: send message to discord
                    return response.status(404).send(`Webhook Error, user not found: ${customer}`);
                }
            }catch(error){
                console.log("Error");
                console.log(error);
                return response.status(404).send(`Webhook Error, canno't get connection: ${error}`);
            }
            break;
        }
        default:
          console.log(`Unhandled event type ${event.type}`);
    }
    response.status(200).send({"nice": event.type});
    
};

export const config = {
    api: {
      bodyParser: false,
    },
}