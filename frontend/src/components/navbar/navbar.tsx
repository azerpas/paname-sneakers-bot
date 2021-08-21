// React & next
import React from 'react';
import Link from "next/link";

// Styles
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Hidden from '@material-ui/core/Hidden'
import Button from '@material-ui/core/Button'
import styled from "styled-components";

// Apollo 
import { useApolloClient } from '@apollo/client';

// Own components
import { MiniLogo } from "../svg/MiniLogo";
import { white } from "../components"
import { signOut } from '@utils/auth/sessionHandler';

// Balance
import { Balance } from '@components/navbar/balance';

//Grid
import Grid from '@material-ui/core/Grid';

import * as ROUTES from "@constants/routes"

const Header = styled(AppBar)`
    padding: 1rem 0;
    background-color: transparent;
    box-shadow: unset;
    position: relative;
`;

const Title = styled(Typography)<{component?: string}>` 
    font-weight: 800;
`;

const To = styled.a<{menu?: boolean}>` 
    color: ${white};
    cursor: pointer;
    ${props => !props.menu && `display: inline-flex;`}
    ${props => props.menu && `text-transform: uppercase;`}
    ${props => props.menu && `font-weight: 700;`}
    ${props => props.menu && `margin-left: auto;`}
`;


export const Navbar = ({session, balance} : {session?: any, balance?: number | undefined }) => {
    const apolloClient = useApolloClient();
    return (
        <Header position="relative">
            <Toolbar>
                <Link href={!session ? ROUTES.INDEX : ROUTES.DASHBOARD}>
                    <To>
                        <MiniLogo></MiniLogo>
                        <Box ml={2}>
                            <Title variant="h3" component="h2">paname</Title>
                        </Box>
                    </To>
                </Link>
                
                {/* <To> is a Mui Styled component */}
                <Hidden smDown>
                    {
                        !session && (
                            <Link href={ROUTES.LOGIN}><To menu={true}>Log in</To></Link>
                        )
                    }
                    {
                        session && (
                            <Box ml="auto" width="auto">
  
                                <Grid container direction="row" justify="center" alignItems="stretch" spacing={1} style={{width: "auto"}}>
                                   
                                    <Grid item xl={4}>
                                        <Balance value={balance}/>
                                    </Grid>
                                    <Grid item xl={5}>
                                        <Link href={!session ? ROUTES.INDEX : ROUTES.DOCUMENTATION}>
                                            <Button style={{height:"100%", whiteSpace:"nowrap"}} >
                                                <To>
                                                    Documentation 
                                                </To>
                                            </Button>
                                        </Link>
                                    </Grid>
                                    <Grid item xl={3}>
                                        <Link href={!session ? ROUTES.INDEX : ROUTES.SETTINGS}>
                                            <Button style={{height:"100%", whiteSpace:"nowrap"}} >
                                                <To>
                                                    Settings 
                                                </To>
                                            </Button>
                                        </Link>
                                    </Grid>
                                    <Grid item xl={3}>
                                        <Button 
                                            style={{height:"100%", whiteSpace:"nowrap",fontWeight: "bold"}} 
                                            onClick={() => {signOut(undefined, undefined,apolloClient)}}>
                                            <To menu={true}>Sign out</To>
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        )
                    }
                </Hidden>
            </Toolbar>
        </Header>
    );
    
};
