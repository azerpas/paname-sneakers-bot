// Navbar
import { Navbar } from "../../src/components/navbar/navbar";
import Bottom from "../../src/components/bottombar/bottom";

// Mui
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

// Own Components
import { Register } from "@components/access/register";
import { AccessPaper } from "../../src/components/access/access.style";
import { AccessStyle } from "../../src/components/access/access.style";

import * as ROUTES from "@constants/routes";
import nextCookie from 'next-cookies';

// API
import { useGetMeQuery } from "@generated/client";
import { useRouter } from "next/router";

const join = () => {
    // Apollo
    const {data: meData, loading: meLoading, error: meError} = useGetMeQuery();
    if(meData){
        const router = useRouter();
        router.push(ROUTES.DASHBOARD);
    }
    return(
        <Box>
            <Navbar/>
            <Bottom/>
            <Container maxWidth="sm">
                <AccessPaper elevation={3}>
                    <Register />
                </AccessPaper>
            </Container>
            <AccessStyle />
        </Box>
    );
}

export default join;