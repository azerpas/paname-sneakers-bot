import { DefaultBtn } from "@components/button/button";
import { GetMeQuery, useSetSettingsMutation } from "@generated/client";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
import Link from "next/link";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import React from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import { A } from "@components/anchor";
import { getURL } from "next/dist/next-server/lib/utils";

type Fields = {
    webhook: string;
    errorWebhook: string;
}

export const SettingsFields = (props: Fields) => {
    const [open, setOpen] = React.useState(false);
    const { register, handleSubmit, errors, setError, clearError } = useForm();
    const [setSettings, {loading: settingsLoading}] = useSetSettingsMutation();
    const submitForm = async (values: Fields) => {
        const res = await setSettings({variables: {
            webhook: values.webhook,
            errorWebhook: values.errorWebhook
        }});
        if(res) setOpen(true);
    }
    const H2 = styled(Typography)`
        margin-bottom: 0.7rem;
    `;
    const handleClose = (event: React.SyntheticEvent | React.MouseEvent) => {
        setOpen(false);
    };
    return (
        <form noValidate autoComplete="off" onSubmit={handleSubmit(submitForm)}>
            <H2 variant="h3">Advanced Settings</H2>
            <FormControl variant="outlined" fullWidth required>
                <InputLabel htmlFor="outlined-basic" variant="outlined">Discord Webhook</InputLabel>
                <OutlinedInput  
                    name="webhook" 
                    error={errors.webhook}
                    inputRef={ register( {required: "Required"} ) } 
                    onChange={() => { clearError("webhook"); }}
                    id="outlined-basic" type="text" label="Discord Webhook" fullWidth
                    defaultValue={props.webhook} 
                />
                {
                    errors.webhook 
                    ? 
                    <FormHelperText>
                        <Typography color="error" variant="inherit">{errors.webhook.message}</Typography> 
                    </FormHelperText> 
                    : 
                    <FormHelperText><a target="_blank" rel="noopener noreferrer" href="https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks">What's a discord webhook?</a> </FormHelperText> 
                }
            </FormControl>
            <FormControl variant="outlined" fullWidth required style={{marginTop: "0.3rem"}}>
                <InputLabel htmlFor="outlined-basic" variant="outlined">Discord Error Webhook</InputLabel>
                <OutlinedInput  
                    name="errorWebhook" 
                    error={errors.errorWebhook}
                    inputRef={ register( {required: "Required"} ) } 
                    onChange={() => { clearError("errorWebhook"); }}
                    id="outlined-basic" type="text" label="Discord Error Webhook" fullWidth
                    defaultValue={props.errorWebhook} 
                />
                {
                    errors.errorWebhook 
                    ? 
                    <FormHelperText>
                        <Typography color="error" variant="inherit">{errors.errorWebhook.message}</Typography> 
                    </FormHelperText> 
                    : 
                    null
                }
            </FormControl>
            <DefaultBtn type="submit" fullWidth color="primary" variant="contained" disabled={settingsLoading}>Save your settings</DefaultBtn>
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
                }}
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Settings updated"
                action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                        X
                    </IconButton>
                </React.Fragment>
                }
            />
        </form>
    );
}

export const Profile = ({roles, meData}: {roles: string[], meData: GetMeQuery}) => {
    function getURL(){
        if(navigator.platform.match(/Win(32|64)/m)){
            return "mailto:hello@paname.io?cc=tom@paname.io;teo@paname.io";
        }else{
            return "mailto:hello@paname.io?cc=tom@paname.io,teo@paname.io";
        }
    }
    return (
        <>
            <Typography align="right" variant="h2" component="h1">Hello {meData.me?.displayName}</Typography>
            <Typography align="right" variant="h6" component="h6">Subscription type:&nbsp;
                {
                    roles.includes("ROLE_ULTIMATE") ? "ULTIMATE" : (
                        roles.includes("ROLE_BASIC") ? "BASIC" : (
                            roles.includes("ROLE_ALPHA") ? "ALPHA 🦍" :
                                roles.includes("ROLE_BETA") ? "BETA 🐎" : "CONGRATS 🤖"
                        )
                    )
                }
            </Typography>
            <DefaultBtn disabled variant="contained">Check your subscription</DefaultBtn>
            <p>
                At the moment the subscription management module is disabled. To manage your subscription please contact us through the chat by clicking the purple button 💬 at
                the bottom left of your screen <b>or</b> via mail at&nbsp;
                <A href={getURL()}>hello@paname.io</A>.
            </p>
        </>
    );
}