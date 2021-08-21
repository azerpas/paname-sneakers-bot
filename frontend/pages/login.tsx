// Next
import React from 'react';

// Navbar
import { Navbar } from "../src/components/navbar/navbar";
import Bottom from "../src/components/bottombar/bottom";

// Mui
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

// Own Components
import { Login } from "../src/components/access/login/login";
import { AccessPaper } from "../src/components/access/access.style";
import { AccessStyle } from "../src/components/access/access.style";

// Apollo
import withApollo from '../src/apollo/withApollo';
// Misc
import nextCookie from 'next-cookies';
import * as ROUTES from '@constants/routes';

const login = () => {
    return (
        <Box>
            <Navbar session={false}/>
            <Bottom session={false}/>
            <Container maxWidth="sm">
                <AccessPaper elevation={3}>
                    <Login />
                </AccessPaper>
            </Container>
            <AccessStyle />
        </Box>
    );
}

login.getInitialProps = async (ctx: any) => {
    const isServer = ctx.req || ctx.res;
    // @ts-ignore
    const { session } = nextCookie(ctx);
    if (session) {
        ctx?.res?.writeHead(302, { Location: ROUTES.DASHBOARD });
        ctx?.res?.end();
    }
    return { props: {} }
}

export default withApollo(login);