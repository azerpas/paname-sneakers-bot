// React & SWR
import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import useSWR from "swr";

// Apollo
import withApollo from "src/apollo/withApollo";
import nextCookie from 'next-cookies';
import { GET_ME } from '@queries/user';

// MUI & Style
import Box from "@material-ui/core/Box";
import LinearProgress from "@material-ui/core/LinearProgress";
import Container from "@material-ui/core/Container";
import { H1title, Title } from "@components/typography/title";
import { MiniLogo } from "@components/svg/MiniLogo";
import { Heart2 } from "@styled-icons/remix-fill/Heart2";
import Modal from "@material-ui/core/Modal";
import {Content} from "./index.style";
import {Boxx} from "@components/container/index";

// Checkout
import {Elements} from '@stripe/react-stripe-js';
import StripeSubscription from "@components/checkout/subscription";

// Types
import { User } from "@typeDefs/user";
import { Session } from "@typeDefs/session";
import * as ROUTES from '@constants/routes';
import { loadStripe } from "@stripe/stripe-js";
import { fetcher } from "@utils/api/rest";
import { toDashboard } from "@utils/auth/sessionHandler";
import styled from "styled-components";

interface SubscriptionPageProps {
    email:string;
    roles: string[] | undefined;
    madePayment: boolean;
    alias: string;
    token?: string;
}

type NextAuthPage = NextPage<SubscriptionPageProps> & {
    isAuthorized?: (session: Session) => boolean;
};

export const Subscription: NextAuthPage = ({email, roles, madePayment, alias, token} : SubscriptionPageProps) => {

    // Stripe
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC!);
    
    // SWR
    const {data: userAPI, error: userAPIError, isValidating} = useSWR(() => madePayment ? [`${process.env.NEXT_PUBLIC_API}/user`, token] : null, fetcher, {dedupingInterval: 4000, focusThrottleInterval: 4000});
    
    const getStripeButtons = () => {
        if(!roles) return <h6>We're currently having issues with Stripe, <a href="mailto:hello@paname.io">please contact an admin!</a>. ERR: NO_ROLES_1 </h6>
        if(roles.includes("ROLE_ULTIMATE") || roles.includes("ROLE_ALPHA")){
            if(!process.env.NEXT_PUBLIC_STRIPE_SUB_ULTIMATE || !process.env.NEXT_PUBLIC_STRIPE_SUB_ULTIMATE_3_MONTHS){
                return <h6>We're currently having issues with Stripe, <a href="mailto:hello@paname.io">please contact an admin!</a>. ERR: KEY_NOT_SET </h6>
            }else{
                return(
                    <>
                        <StripeSubscription email={email} priceId={process.env.NEXT_PUBLIC_STRIPE_SUB_ULTIMATE!} addLabel=" (29.99€/month)"/>
                        <StripeSubscription email={email} priceId={process.env.NEXT_PUBLIC_STRIPE_SUB_ULTIMATE_3_MONTHS!} addLabel=" (79.99€/3 months)"/>
                    </>
                );
            }
        }else if(roles.includes("ROLE_BASIC")){
            if(!process.env.NEXT_PUBLIC_STRIPE_SUB_BASIC){
                return <h6>We're currently having issues with Stripe, <a href="mailto:hello@paname.io">please contact an admin!</a>. ERR: KEY_NOT_SET </h6>
            }else{
                return(
                    <>
                        <StripeSubscription email={email} priceId={process.env.NEXT_PUBLIC_STRIPE_SUB_BASIC!}/>
                    </>
                );
            }
        }else{
            return <h6>We're currently having issues with Stripe, <a href="mailto:hello@paname.io">please contact an admin!</a>. ERR: NO_ROLES_2 </h6>
        }
    }

    if(userAPI){
        if(userAPI?.customer.id && userAPI?.customer.paying){
            window.location.href = ROUTES.DASHBOARD;
        }
    }
    return(
        <main>
            <style jsx>{`
                .MuiBox-root{
                    outline: none;
                }
            `}</style>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={true}
            >
                <Boxx mx={5} borderRadius={8}>
                    <Content maxWidth="lg">
                        <Boxx textAlign="center" pb={3}>
                            <Box mt={4} pt={3}>
                                <MiniLogo/>
                            </Box>
                            { 
                                !madePayment ? 
                                <>
                                    <H1title size={3.5} m={{mt:0.3}}>Welcome to paname.io<br/> <Alias>{alias}</Alias></H1title>
                                    <h3>Set-up your monthly billing to start the adventure. 🚀</h3>
                                    <Elements stripe={stripePromise}>
                                        {getStripeButtons()}
                                    </Elements>
                                </> : 
                                <>
                                    <H1title>Thanks! You're subscription has been made. <Heart2 width="60px" color="red"/></H1title>
                                    <h3>Please <i>wait a few seconds</i> while we verify your payment...</h3>
                                    <LinearProgress color="primary" />
                                </>
                            }
                        </Boxx>
                    </Content>
                </Boxx>
            </Modal>
        </main>
    );
};

const Alias = styled.span`
    font-weight: 500;
    ${({theme}) => `
        color: ${theme.palette.primary.dark};
    `}
`;