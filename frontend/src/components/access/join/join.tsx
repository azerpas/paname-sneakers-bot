// React & Next
import { useState, useEffect, createElement } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

// Mui
import Container from "@material-ui/core/Container";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import FormHelperText from "@material-ui/core/FormHelperText";
import InputLabel from "@material-ui/core/InputLabel";
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
import { useSignUpMutation } from '../../../generated/client'

// Misc
import cookie from 'js-cookie'
import { EXPIRES_IN } from '@constants/cookie';
import * as ROUTES from "@constants/routes";

initFirebase();

interface creds {
    key: string,
    email: string,
    password: string,
    repeatPassword: string,
    discordtag: string
}

declare global {
    interface Window { grecaptcha: any }
}



export const Join = () => {
    // Router
    const router = useRouter();
    // Form
    const { register, handleSubmit, errors, setError, getValues, clearError } = useForm();
    const [isLoading, setLoading] = useState(false);
    // Apollo
    const [signUp] = useSignUpMutation();
    const [error, setApolloError] = useState(null);
    // Recaptcha
    const [recaptcha, setRecaptcha] = useState<string|undefined>(undefined);
    // Execute grecaptcha
    const handleLoaded = (_: any) => {
        window.grecaptcha.ready((_: any) => {
          window.grecaptcha
            .execute("6LeMWrcZAAAAAJ3ZZgz5iCbCKODVK-44iLO8uY3f", { action: "join" })
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
     * TRIGGER ON FORM SUBMIT : SIGN UP
     * @param values : creds
     * @return void
     */
    const onSubmit = async (values: creds) => {
        setLoading(true);
        try{
            if(!recaptcha) handleLoaded({});
            await new Promise((resolve, reject) => {resolve(setTimeout(() => {}, 1000))});
            const {data} = await signUp({variables: {
                recaptcha: recaptcha!,
                email: values.email,
                password: values.password,
                key: values.key,
                alias: values.discordtag
            }});
            cookie.set('session', data?.SignUp.token || '', {
                expires: EXPIRES_IN
            });
            cookie.set('token', data?.SignUp.accessToken || '', {
                expires: EXPIRES_IN
            });
            router.push(ROUTES.DASHBOARD);
            //@ts-ignore
            window.$crisp.push(["set", "user:email", values.email])
        }catch(e){
            if(e.message == "Double check your key"){
                setError("key", "notMatch", e.message)
            }else if(e.message == "The email address is already in use by another account."){
                setError("email","notMatch", e.message)
            }else if(e.message == "timeout-or-duplicate"){
                alert(e.message);
            }
            else{
                setApolloError(e.message);
                alert(e.message);
            }
            handleLoaded({});
        }
        setLoading(false);
        return
    }
    return(
        <Container>
            <Box p={{xs:1, sm:1, md:4}} py={{xs: 3, sm: 3}}>
                <Title size={3} variant="h1" component="h2" mb={1}>Join us now!</Title>
                <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <Box mb={1}>
                        <FormControl variant="outlined" fullWidth required>
                            <InputLabel htmlFor="component-outlined" variant="outlined">Paname's key</InputLabel>
                            <OutlinedInput 
                                name="key"
                                label="Paname's key *"
                                inputRef={ register (
                                    {
                                        required: "Required",
                                        // TODO uncomment pattern for UUIDV4 check
                                        //pattern: {
                                        //    value: /[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}/i,
                                        //    message: "Incorrect format for Paname key"
                                        //}
                                    }
                                )}
                                error={errors.key}
                                id="component-outlined"
                                onChange={() => { clearError("key"); setApolloError(null); }}
                            />
                            {
                                // If not error, display regular help message
                                errors.key 
                                ? 
                                <FormHelperText>
                                   <Typography color="error" variant="inherit">{errors.key.message}</Typography> 
                                </FormHelperText> 
                                : 
                                <FormHelperText>Click <Link href="/">here</Link> to get yours!</FormHelperText> 
                            }
                        </FormControl>
                    </Box>
                    <Field 
                        name="email"
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
                        onChange={() => { clearError("email"); setApolloError(null); }}
                        error={errors.email} helperText={errors.email ? errors.email.message : ""}
                        id="outlined-basic" fullWidth  variant="outlined" label="Email" required  
                    />
                    <Field 
                        name="discordtag"
                        type="text"
                        inputRef={ register( 
                            {
                                required: "Required",
                                pattern: {
                                    value: /^.*#([0-9]{4})/,
                                    message: (
                                        <div>
                                            A Discord Tag should: 
                                            <ul>
                                                <li>be more than 5 characters</li>
                                                <li>contains four numbers (01234...) with #</li>
                                                <li>example John#0101</li>
                                            </ul>
                                        </div>
                                    )
                                },
                                minLength: 6,
                                maxLength: 20 
                            } 
                        ) }
                        onChange={() => { clearError("discordtag"); setApolloError(null); }}
                        error={errors.discordtag} helperText={errors.discordtag ? errors.discordtag.message : ""}
                        id="outlined-basic" fullWidth  variant="outlined" label="Discord tag" required  
                    />
                    <Field 
                        name="password"
                        error={errors.password} helperText={errors.password ? errors.password.message : ""} 
                        inputRef={ register( 
                            {
                                required: "Required", 
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&/])[A-Za-z\d@$!%*?&/]{8,}$/i,
                                    message: (
                                        <div>
                                            Password should: 
                                            <ul>
                                                <li>be more than 8 characters</li>
                                                <li>contain a number (01234...)</li>
                                                <li>contain a lowercase character (abcde...)</li>
                                                <li>contain an uppercase character (ABCDE...)</li>
                                                <li>contain a special character (@$!%*?&/)</li>
                                            </ul>
                                        </div>
                                    )
                                        
                                }
                            } 
                        ) }
                        onChange={() => { clearError("password"); setApolloError(null); }}
                        fullWidth required id="outlined-basic" type="password" label="Password" variant="outlined" />
                    <Field 
                        name="repeatPassword" 
                        error={errors.repeatPassword} helperText={errors.repeatPassword ? errors.repeatPassword.message : ""}
                        inputRef={ register( 
                            {
                                required: "Required", 
                                // Check if passwords match
                                validate: (value) => {
                                    if (getValues("password") !== value){
                                        setError("repeatPassword","notMatch","Error")
                                        return "Password are not matching"
                                    }else{
                                        return true;
                                    }
                                }
                            } 
                        ) }
                        onChange={() => { clearError("repeatPassword"); setApolloError(null); }}
                        fullWidth required id="outlined-basic" type="password" label="Repeat password" variant="outlined" 
                    />
                    { error ? 
                        <Box mb={1}>
                            <Typography color="error" variant="inherit">{error}</Typography>
                        </Box> : null }
                    <Box mb={1}>
                        <Typography>By signing up, you agree to comply with Paname's <Link target="_blank" rel="noopener" href="/privacy" >Privacy Policy</Link> and <Link target="_blank" rel="noopener" href="/terms">Terms and Conditions</Link>.</Typography>
                    </Box>
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        variant="contained" color="primary" fullWidth size="large"
                    >   
                        <StateBtn content="confirm" isLoading={isLoading}/>
                    </Button>
                </form>
                <Box my={2}>
                    <Typography>Already a member? <Link href={ROUTES.LOGIN}>Sign in!</Link></Typography>
                </Box>
            </Box>
            <div
                className="g-recaptcha"
                data-sitekey="6LeMWrcZAAAAAJ3ZZgz5iCbCKODVK-44iLO8uY3f"
                data-size="invisible"
            ></div>
        </Container>
    );
}