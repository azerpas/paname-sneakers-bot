// React & Next
import React, {useState} from 'react';
import { NextPage } from 'next';
import useSWR from 'swr';

// Navbar
import { Navbar } from "../src/components/navbar/navbar";
import Bottom from "../src/components/bottombar/bottom";

// Mui
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Grid from '@material-ui/core/Grid';
import Button from "@material-ui/core/Button";

// Own Components
import { AccessStyle } from "../src/components/access/access.style";

// Apollo
import withApollo from '../src/apollo/withApollo';

// API
import { fetcher } from '@utils/api/rest/index';
import CircularProgress from "@material-ui/core/CircularProgress";
import Cookie from 'js-cookie';


import { useGetMeQuery } from "@generated/client";

import { Zoom,Minimizebutton,Minimize,CloseButton,TitleDOC,SubTitleDOC,DocBanner,Window,Span,Titlebar,Close,Buttons,Zoombutton} from "../src/components/documentation/index.style";


const Documentation = ({}) => {

    const [lang, setlang] = useState("fr"); 

    const {data: meData, loading: meLoading, error: meError} = useGetMeQuery();
    const {data: userAPI, error: userAPIError, isValidating} = useSWR(() => [`${process.env.NEXT_PUBLIC_API}/user`, Cookie.get('token')], fetcher, {dedupingInterval: 4000, focusThrottleInterval: 4000});

    if(!userAPI || !meData){
        return(
            <div style={{display: "flex", height: "100vh"}}>
                <span style={{margin: "auto"}}>
                    <CircularProgress color="primary"></CircularProgress>
                </span>
            </div>
        );
    }
    return (
        <Box>    
            <Navbar session={meData.me ? true : false} balance={userAPI?.balance}/>
            <Bottom session={meData.me ? true : false} balance={userAPI?.balance} />
            <Container maxWidth="lg">
                <Grid container direction="row" justify="center" alignItems="flex-start" spacing={0} style={{"marginTop":"20px"}}>
                    <DocBanner>
                        <Window>
                        <Titlebar>
                            <Buttons>
                            <Close>
                                <CloseButton><Span><strong>x</strong></Span></CloseButton>
                            </Close>
                            <Minimize>
                                <Minimizebutton><Span><strong>&ndash;</strong></Span></Minimizebutton>
                            </Minimize>
                            <Zoom>
                                <Zoombutton><Span><strong>+</strong></Span></Zoombutton>
                            </Zoom>
                            </Buttons>
                            Paname.io? 
                            </Titlebar>
                                <div style={{"position": "relative", "paddingBottom":" 62.5%", "height": "0"}}>
                                    <iframe src={lang === "fr" ? "https://www.loom.com/embed/baf9e58315cf4e238e8a1fb1de1e4dd0" : "https://www.loom.com/embed/ec87b9ef3a864a809ec52717e38eb36e"} style={{"border":"none","position": "absolute", "top": "0","left": "0", "width": "100%", "height": "100%"}}></iframe>
                                </div>
                        </Window>
                        <TitleDOC>{lang === "fr" ? "Paname.io 🇫🇷" : "Paname.io 🇬🇧"}</TitleDOC>
                        <SubTitleDOC>{lang === "fr" ? "Découvrez Paname.io" : "Discover Paname.io"} </SubTitleDOC>
                    </DocBanner>
                    <DocBanner>
                        <Window>
                        <Titlebar>
                            <Buttons>
                            <Close>
                                <CloseButton><Span><strong>x</strong></Span></CloseButton>
                            </Close>
                            <Minimize>
                                <Minimizebutton><Span><strong>&ndash;</strong></Span></Minimizebutton>
                            </Minimize>
                            <Zoom>
                                <Zoombutton><Span><strong>+</strong></Span></Zoombutton>
                            </Zoom>
                            </Buttons>
                            Generate an Excel file model 🇬🇧
                            </Titlebar>
                                <div style={{"position": "relative", "paddingBottom":" 62.5%", "height": "0"}}>
                                    <iframe src={lang === "fr" ? "https://www.loom.com/embed/199b00b42d264c8698340675d4eed763" : "https://www.loom.com/embed/8eaf130557e6440f8b834537a15fbab5"} style={{"border":"none","position": "absolute", "top": "0","left": "0", "width": "100%", "height": "100%"}}></iframe>
                                </div>
                        </Window>
                        <TitleDOC>{lang === "fr" ? "Generez votre model Excel 🇫🇷" : "Generate an Excel file model 🇬🇧"}</TitleDOC>
                        <SubTitleDOC>{lang === "fr" ? "Afin d'importer ou de generez vos tasks, vous aurez besoin de manier des fichiers Excel." : "To import or generate your tasks, you will need to work with Excel files."} </SubTitleDOC>
                    </DocBanner>
                </Grid>
            </Container>
            <Button style={{"fontSize":"75px",'width':'auto',"marginRight":"0px","float":"right","marginLeft":"auto","bottom": "0",'position':'sticky'}} onClick={() => lang === "fr" ? setlang("en") : setlang("fr")  }>{lang === "fr" ? "🇫🇷" : "🇬🇧"}</Button>
            <AccessStyle />
        </Box>
    );
}


export default withApollo(Documentation,  /* { getDataFromTree } */);