// React & SWR
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import useSWR from 'swr';

// Apollo
import withApollo from "src/apollo/withApollo";
import nextCookie from 'next-cookies';
import { GET_ME } from '@queries/user';

import { GET_SESSION } from "@queries/stripe";

// MUI & Style
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

// Checkout
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import StripeCheckout from "@components/checkout/balance";
import StripeSubscription from "@components/checkout/subscription";

// Types
import { User } from "@typeDefs/user";
import { Session } from "@typeDefs/session";
import * as ROUTES from '@constants/routes';

//Balance
import { BalanceWidget } from '@components/checkout/widget';

//PaymentList
import { PaymentList } from '@components/checkout/paymentlist';

//API
import { fetcher } from '@utils/api/rest/index';

// Navbar
import { Navbar } from "../src/components/navbar/navbar";
import Bottom from "../src/components/bottombar/bottom";

interface CheckoutPageProps {
    data: {
        me: User;
    };
    priceId: string;
    customerId: string;
    token: any;
}

type NextAuthPage = NextPage<CheckoutPageProps> & {
    isAuthorized?: (session: Session) => boolean;
};

const Checkout: NextAuthPage = ({data, priceId, customerId,token}) => {
    const {data: userAPI, error: userAPIError, isValidating} = useSWR(() => [`${process.env.NEXT_PUBLIC_API}/user`, token], fetcher, {dedupingInterval: 4000, focusThrottleInterval: 4000});

    useEffect(()=>{
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/";
        document.body.appendChild(script);
    }, []);

    // Use state 
    const [stripeStatus, setStripeStatus] = useState({completed: false, error: ""});
    
    // Stripe
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC!);

    // https://codesandbox.io/s/react-stripe-official-q1loc?fontsize=14&hidenavigation=1&theme=dark&file=/src/styles.css
    return(
        <Box>
            <Navbar session={data.me ? true : false} balance={userAPI?.balance}/>
            <Bottom session={data.me ? true : false} balance={userAPI?.balance}/>
            <Container maxWidth="lg">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={12} md={6}>
                        <BalanceWidget value={userAPI?.balance}>
                            <Elements stripe={stripePromise}>
                                { data.me ? 
                                    <>
                                        <StripeCheckout StripeState={[stripeStatus, setStripeStatus]} email={data.me.email!} uid={data.me.uid!} customerId={customerId} />
                                        <StripeSubscription email={data.me.email!} priceId={priceId}/>
                                    </> :
                                    <>
                                        <Skeleton variant="rect" animation="wave"/>
                                        <Skeleton variant="rect" animation="wave"/>
                                    </>
                                }
                                
                            </Elements>
                        </BalanceWidget>
                    </Grid> 
                    <Grid item xs={12} sm={12} md={6}>
                        <Grid container direction="column">
                            <PaymentList customerId={customerId}/>
                        </Grid>   
                    </Grid> 
                </Grid>
            </Container>
        </Box>
    );
}

Checkout.getInitialProps = async (ctx: any) => {
    const isServer = ctx.req || ctx.res;
    const { session } = nextCookie(ctx);
    const { token } = nextCookie(ctx);
    const priceId = process.env.STRIPE_SUB_ULTIMATE || '';
    if (!session) {
        ctx?.res?.writeHead(302, { Location: ROUTES.DASHBOARD });
        ctx?.res?.end();
    }
    const context = isServer
        ? {
            context: {
                headers: {
                    cookie: ctx?.req?.headers.cookie,
                },
            },
        }
        : null;
    
    try {
        const res = await Promise.all([
            ctx.apolloClient.query({
                query: GET_ME,
                ...(isServer && context),
            }),
            ctx.apolloClient.query({
                query: GET_SESSION,
                ...(isServer && context),
            })
        ]);
        return { data: res[0].data, token, priceId, customerId: res[1].data.getSession.id };
    } catch (error) {
        ctx?.res?.writeHead(302, { Location: ROUTES.DASHBOARD });
        return ctx?.res?.end();
    }
}

export default withApollo(Checkout);
