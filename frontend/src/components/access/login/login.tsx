// React
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router';

// Mui
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";

// Own Components
import { Title } from "../../typography/title";
import { Field } from "@components/form/field";
import Link from "../../../Link";
import { StateBtn } from "@components/button/button";

// Firebase
import "firebase/auth";
import initFirebase from "../../../utils/auth/init";

// API
import { useLogInMutation } from '@generated/client';

// Misc
import cookie from 'js-cookie'
import { EXPIRES_IN } from '@constants/cookie';
import * as ROUTES from "@constants/routes";
import { resolve } from 'url';

initFirebase();

interface creds {
    username: string,
    password: string
}

export const Login = () => {
    // Router
    const router = useRouter();
    // Form
    const { register, handleSubmit, errors, setError, clearError } = useForm();
    const [isLoading, setLoading] = useState(false);
    // Apollo
    const [logIn] = useLogInMutation();
    const [ApolloError, setApolloError] = useState(null);
    // Recaptcha
    const [recaptcha, setRecaptcha] = useState<string|undefined>(undefined);
    // Execute grecaptcha
    const handleLoaded = (_: any) => {
        window.grecaptcha.ready((_: any) => {
          window.grecaptcha
            .execute("6LeMWrcZAAAAAJ3ZZgz5iCbCKODVK-44iLO8uY3f", { action: "login" })
            .then((token: string) => {
                setRecaptcha(token)
            })
        })
    }
    // Add recaptcha script
    useEffect(()=>{
        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js?render=6LeMWrcZAAAAAJ3ZZgz5iCbCKODVK-44iLO8uY3f";
        script.setAttribute("async","");
        script.addEventListener("load", handleLoaded)
        document.body.appendChild(script)
    }, []);
    /**
     * TRIGGER ON FORM SUBMIT: LOGIN
     * @param values : creds
     * @return void
     */
    const onSubmit = async (values: creds) => {
        setLoading(true);
        try {
            if(!recaptcha) handleLoaded({});
            await new Promise((resolve, reject) => {resolve(setTimeout(() => {}, 1000))});
            const {data} = await logIn({variables: {
                email: values.username,
                password: values.password,
                recaptcha: recaptcha!
            }});
            cookie.set('session', data?.LogIn.token || '', {
                expires: EXPIRES_IN
            });
            cookie.set('token', data?.LogIn.accessToken || '', {
                expires: EXPIRES_IN
            });
            router.push(ROUTES.DASHBOARD);
            //@ts-ignore
            window.$crisp.push(["set", "user:email", values.username])
        } catch (e) {
            if(e.message === "No user found."){ setError("username", "notMatch", e.message);}
            if(e.message === "The password is invalid or the user does not have a password."){ setError("password", "notMatch", e.message); }
            if(e.message === "timeout-or-duplicate"){ setApolloError(e.message + ": Please refresh the page." as any); }
            else{
                setApolloError(e.message);
            }
            handleLoaded({});
        }
        setLoading(false);
        return;
    }
    return(
        <Container>
            <Box p={{xs:1, sm:1, md:4}} py={{xs: 3, sm: 3}}>
                <Title size={3} variant="h1" component="h2" mb={1}>Welcome back</Title>
                <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <Field 
                        name="username" 
                        error={errors.username} helperText={errors.username ? errors.username.message : ""} 
                        inputRef={ register( 
                            {
                                required: "Required", 
                                // Email pattern
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                    message: "Invalid email address"
                                }
                            } 
                        ) }
                        onChange={() => { clearError("username"); setApolloError(null); }}
                        // TODO onFocusOut, check username
                        id="outlined-basic" label="Email" variant="outlined" fullWidth />
                    <Field  
                        name="password" 
                        error={errors.password} helperText={errors.password ? errors.password.message : ""} 
                        inputRef={ register( {required: "Required"} ) } 
                        onChange={() => { clearError("password"); setApolloError(null); }}
                        id="outlined-basic" type="password" label="Password" variant="outlined" fullWidth />
                    { ApolloError ? 
                        <Box mb={1}>
                            <Typography color="error" variant="inherit">{ApolloError}</Typography>
                        </Box> : null }
                    <Box mb={1}>
                        <Typography>By logging in, you agree to comply with Paname's <Link target="_blank" rel="noopener" href="/privacy">Privacy Policy</Link> and <Link target="_blank" rel="noopener" href="/terms">Terms and Conditions</Link>.</Typography>
                    </Box>
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        variant="contained" color="primary" fullWidth size="large"
                    >   
                        <StateBtn content="Log In" isLoading={isLoading}/>
                    </Button>
                </form>
                <Box my={2}>
                    <Typography>Not yet a member? <Link href="/join">Join us!</Link></Typography>
                </Box>
            </Box>
        </Container>
    );
}

export default Login;