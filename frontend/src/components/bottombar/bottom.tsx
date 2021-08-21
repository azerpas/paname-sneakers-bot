// React & Next
import React, { useState } from 'react';
import { useRouter } from 'next/router'

// Mui & Style
import { HomeFill } from '@styled-icons/octicons/HomeFill';
import { Cloud } from '@styled-icons/boxicons-regular/Cloud';
import { Plus } from '@styled-icons/entypo/Plus';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Hidden from '@material-ui/core/Hidden';
import { Icon, Bar,BalanceNav } from './bottom.style';
import Skeleton from '@material-ui/lab/Skeleton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import SettingsIcon from '@material-ui/icons/Settings';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import styled from 'styled-components';
import Divider from '@material-ui/core/Divider';
import { white } from '@components/components';

// Apollo 
import { useApolloClient } from '@apollo/client';
import {signOut} from '@utils/auth/sessionHandler';

// Misc
import * as ROUTES from "@constants/routes";
import Link from 'src/Link';


export const Bottom = ({session,balance} : {session?: any, balance?: number | undefined }) => {
    const apolloClient = useApolloClient();
    //const session = React.useContext(SessionContext);
    const router = useRouter();
    const [nav, setNav] = useState(router.pathname);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const ItemLink = styled(Link)`
        color: ${white};
        &:hover{
            text-decoration: unset;
        }
    `;
    const ItemList = styled(ListItem)`
        &:hover{
            opacity: 0.6;
        }
    `;
    
    return (
        <Hidden mdUp>
            <Bar 
                showLabels
                value={nav} 
                onChange={(event: React.ChangeEvent<{}>, newValue: string) => {
                    if(typeof newValue == "string"){
                        setNav(newValue); 
                        router.push(newValue); 
                    }
                } }
                style={{position: "fixed", bottom: 0, width: "100%", height: "auto", padding: "0.4rem 0"}}
                >
                    <BottomNavigationAction 
                        label="Home" 
                        value={!session ? ROUTES.INDEX : ROUTES.DASHBOARD} 
                        icon={<Icon icon={HomeFill} />} />
                    { 
                        !session && (
                            <BottomNavigationAction 
                                label="Go to cloud" 
                                value={!session ? ROUTES.LOGIN : ROUTES.DASHBOARD} 
                                icon={<Icon icon={Cloud} />} 
                            />
                        )
                    }
                    {
                        session && (

                            <BalanceNav
                                label={
                                    balance === undefined ?  
                                    <Skeleton animation="wave" variant="text"/> :
                                    (balance !== null ? balance.toFixed(2) + "€" : 0.00)
                                }
                                value={!session ? ROUTES.LOGIN : ROUTES.BALANCE} 
                                icon={<Icon icon={Plus} />} />
                                
                        )
                    }
                    {
                        session && (
                            <BottomNavigationAction 
                                label="Open menu"
                                onClick={() => setDrawerOpen(true)}
                                icon={<MenuIcon/>}
                            /> 
                        )
                    } 
            </Bar>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <div role="presentation" onClick={() => setDrawerOpen(false)} onKeyDown={() => setDrawerOpen(false)}>
                    <List>
                        <ItemLink href={ROUTES.DOCUMENTATION}>
                            <ItemList button>
                                <ListItemIcon><MenuBookIcon/></ListItemIcon>
                                <ListItemText>Documentation</ListItemText>
                            </ItemList>
                        </ItemLink>
                        <ItemLink href={ROUTES.SETTINGS}>
                            <ItemList button>
                                <ListItemIcon><SettingsIcon/></ListItemIcon>
                                <ListItemText>Settings</ListItemText>
                            </ItemList>
                        </ItemLink>
                        <Divider/>
                        <ListItem onClick={() => {signOut(undefined, undefined,apolloClient)}}>
                            <ListItemIcon><ExitToAppIcon/></ListItemIcon>
                            <ListItemText>Sign out</ListItemText>
                        </ListItem>
                    </List>
                </div>
            </Drawer>  
        </Hidden>
    );
}

export default Bottom;