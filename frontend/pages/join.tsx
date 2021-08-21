// Next
import { GetServerSideProps } from "next";

// Navbar
import { Navbar } from "../src/components/navbar/navbar";
import Bottom from "../src/components/bottombar/bottom";

// Mui
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

// Own Components
import { Join } from "../src/components/access/join/join";
import { AccessPaper } from "../src/components/access/access.style";
import { AccessStyle } from "../src/components/access/access.style";

import * as ROUTES from "@constants/routes";
import nextCookie from 'next-cookies';

// Apollo
import withApollo from "src/apollo/withApollo";

const join = () => {
    
    return(
        <Box>
            <Navbar/>
            <Bottom/>
            <Container maxWidth="sm">
                <AccessPaper elevation={3}>
                    <Join />
                </AccessPaper>
            </Container>
            <AccessStyle />
        </Box>
    );
}

join.getInitialProps = async (ctx: any) => {
    const isServer = ctx.req || ctx.res;
    // @ts-ignore
    const { session } = nextCookie(ctx);
    if (session) {
        ctx?.res?.writeHead(302, { Location: ROUTES.DASHBOARD });
        ctx?.res?.end();
    }
    return { props: {} }
}

export default withApollo(join);