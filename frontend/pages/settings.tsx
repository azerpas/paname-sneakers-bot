import useSWR from "swr";
import Cookie from 'js-cookie';
import { fetcher } from "@utils/api/rest";
// Styles
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
// Components
import { Navbar } from "@components/navbar/navbar";
import Bottom from "@components/bottombar/bottom";
import { SettingsFields, Profile } from "@components/settings";
// Apollo
import { useGetMeQuery } from "@generated/client";
import Typography from "@material-ui/core/Typography";


const Settings = () => {
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
    return(
        <>
            <Navbar session={meData.me} balance={userAPI.balance}/>
            <Bottom session={meData.me} balance={userAPI.balance}/>
            <Container maxWidth="lg">
                <Grid container>
                    <Grid item xs={5}>
                        <Profile roles={userAPI.roles} meData={meData}/>
                    </Grid>
                    <Grid item xs={2}>
                        <Divider orientation="vertical" style={{margin: "auto"}}/>
                    </Grid>
                    <Grid item xs={5}>
                        <SettingsFields webhook={userAPI.webhook} errorWebhook={userAPI.webhook}/>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default Settings