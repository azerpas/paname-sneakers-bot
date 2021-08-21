// React & Next
import React  from 'react';
import { NextPage } from 'next';
import dynamic from 'next/dynamic'
import useSWR from 'swr';

// Navbar
import { Navbar } from "../src/components/navbar/navbar";
import Bottom from "../src/components/bottombar/bottom";

// Mui
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from '@material-ui/core/Grid';

// Own Components
import { AccessStyle } from "../src/components/access/access.style";
import { Tasks } from "@components/dashboard/tasks";
import { Websites } from '@components/dashboard/websites';
import { Stats } from '@components/dashboard/stats';
import { Raffles } from '@components/dashboard/raffles';

// Apollo
import withApollo from '../src/apollo/withApollo';
import { GET_ME } from '@queries/user';

// Misc
import nextCookie from 'next-cookies';
import * as ROUTES from '@constants/routes';
import { User } from '@generated/client';
import { Session } from '@typeDefs/session';

// API
import { fetcher } from '@utils/api/rest/index';
import { client } from '@utils/api/graphql/index';
import { GET_PROFILES_NAMES, GET_WEBSITES, GET_WEBSITES_RAFFLES } from '@utils/api/graphql/queries';

import { Subscription } from '@components/subscription';

//import { getDataFromTree } from '@apollo/react-ssr';


interface DashboardPageProps {
    data: {
        me: User;
    };
    token: any;
    madePayment: any;
}

type NextAuthPage = NextPage<DashboardPageProps> & {
    isAuthorized?: (session: Session) => boolean;
};

//initFirebase();

const Discordwidget = dynamic(() => import('@components/dashboard/discord'))


const Dashboard: NextAuthPage = ({ data, token,madePayment }) => {
    const {data: userAPI, error: userAPIError, isValidating} = useSWR(() => [`${process.env.NEXT_PUBLIC_API}/user`, token], fetcher, {dedupingInterval: 4000, focusThrottleInterval: 4000});
    //const {data: profiles, error: profilesError, isValidating: isValidatingProfiles} = useSWR(() => [token, GET_PROFILES_NAMES], client, {dedupingInterval: 5000, focusThrottleInterval: 5000});
    const {data: websites, error: websitesError, isValidating: isValidatingWebsites} = useSWR(() => [token, GET_WEBSITES], client, {dedupingInterval: 5000, focusThrottleInterval: 5000});
    const {data: rafflesPerWebsites, error: rafflesPerWebsitesError, isValidating: rafflesPerWebsitesValidating} = useSWR(() => [token, GET_WEBSITES_RAFFLES], client, {dedupingInterval: 5000, focusThrottleInterval: 5000});
    if(userAPI){
        if(!userAPI?.customer.id && !userAPI?.customer.paying){
            return (
                <Box>
                    <Subscription email={data.me.email} alias={data.me.displayName ? data.me.displayName : data.me.email} token={token} madePayment={madePayment} roles={userAPI?.roles}/>
                    <Navbar session={data.me ? true : false} balance={userAPI?.balance}/>
                    <Bottom session={data.me ? true : false} balance={userAPI?.balance} />
                    <Container maxWidth="lg">
                        <Grid container spacing={3}> 
                            <Grid item xs={12} md={8}>
                                <Tasks websites={websites?.websites.edges} balance={userAPI?.balance} token={token}/>
                                <Grid container direction="row" justify="center" alignItems="flex-start" spacing={3}>
                                    <Grid item xs={12} md={5}>
                                        <Websites websites={websites?.websites.edges}/>
                                    </Grid>
                                    <Grid item xs={12} md={5}>
                                        <Stats/> 
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Discordwidget/>
                            </Grid>
                        </Grid>
                    </Container>
                    <AccessStyle />
                </Box>
            );
        }
    }
    if(data){
        return (
            <Box>    
                <Navbar session={data.me ? true : false} balance={userAPI?.balance}/>
                <Bottom session={data.me ? true : false} balance={userAPI?.balance} />
                <Container maxWidth="lg">
                    <Grid container spacing={3}> 
                        <Grid item xs={12} md={8}>
                            <Tasks websites={websites?.websites.edges} balance={userAPI?.balance} token={token} admin={userAPI?.roles.includes("ROLE_ADMIN")}/>
                            <Grid container direction="row" justify="center" alignItems="flex-start" spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Websites websites={websites?.websites.edges}/>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Raffles websites={rafflesPerWebsites?.websites.edges}/> 
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Discordwidget/>
                        </Grid>
                    </Grid>
                </Container>
                <AccessStyle />
            </Box>
        );
    }
    return <h1>Loading...</h1>
}

/*
Dashboard.isAuthorized = (session: Session) => !!session;
*/

Dashboard.getInitialProps = async (ctx: any) => {
    const isServer = ctx.req || ctx.res;
    const { session } = nextCookie(ctx);
    const { token } = nextCookie(ctx);
    const madePayment = ctx.query.session_id;
    if (!session) {
        ctx?.res?.writeHead(302, { Location: ROUTES.LOGIN });
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
    const { data } = await ctx.apolloClient.query({
        query: GET_ME,
        ...(isServer && context),
    });
    return { data, token, madePayment };
}


export default withApollo(Dashboard,  /* { getDataFromTree } */);