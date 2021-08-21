import React , { FormEvent, useEffect, useState }from "react";
import NoSsr from "@material-ui/core/NoSsr";
import { BackgroundHome } from "@components/svg/Background";
import { Title, GradientWrapper,PurpleSubTitle,GreySubTitle,ShadowTitle,PurpleTitle } from "@components/typography/title";
import styled from 'styled-components';
import { Paragraph } from  "@components/typography/paragraph/paragraph";
import { darkGrey } from '@components/components';
import { Plan, PlanType } from '@components/card/plan/basicplan';
import { Navbar } from '@components/navbar/navbar';
import Bottom from '@components/bottombar/bottom';

import { MockupLike } from "@components/svg/MockupLike";
import { MockupSofa } from "@components/svg/MockupSofa"
import { LogoRaffle } from "@components/svg/LogoRaffle";
import { MockupExplain } from "@components/svg/MockupExplain";

//Mui
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import { useRouter } from 'next/router'
import queryString from "query-string";
import { CenteredBox } from "@components/container";
import { useSignUpMailMutation } from "@generated/client";
import { useForm } from "react-hook-form";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const TitleMain = styled.h1`
width: 100%;
text-align: center;
& span {
    display: block;
}
@media (max-width: 760px){
    font-size: 5rem;
}
@media (max-width: 1000px){
    font-size: 8rem;
}
`;
const Separate = styled.div`
width: 80%;
background-color:${darkGrey};
padding: 1rem;
border-radius: 8px;
`;

const Followingline = styled.div`
width: 15px;
height: 30vh;
border-radius: 8px;
${({theme}) => `
background-color: ${theme.palette.primary.main};
`}
`;

const Dottingline = styled.div`
width:7px;
height:150px;
margin-top:10px;
${({theme}) => `
background-image:linear-gradient(to top, ${theme.palette.primary.main} 0%, ${theme.palette.primary.main} 50%, transparent 50%);
`}
background-size:60px 20px;
background-repeat:repeat-y;
`;

const Etape = styled.div`
height: 75px;
width: 75px;
margin-top:-15px;
${({theme}) => `
background-color: ${theme.palette.primary.main};
`}
border-radius: 50%;

`;

const EtapeNumber = styled.h1`
width: 100%;
text-align: center;
margin:auto;
& span {
display: block;
}
@media (max-width: 760px){
font-size: 10rem;
}
@media (max-width: 1000px){
font-size: 15rem;
}
`;


const StatBanner = styled.div`
width:100%;
height:12rem;
display: flex;
flex-direction: row;
margin-top:-110px;
align-items: center;
background-color:${darkGrey};
border-width: thin;
border-top:1px solid  white;
border-bottom:1px solid  white;
`;

const Separator = styled.div`
width:2px;
height:8rem;
background-color:white;
`;

const RaffleBanner = styled.div`
width:30%;
height:12rem;
display: flex;
flex-direction: row;
margin-bottom:8rem;
align-items: center;
background-color:#46484E;
border-radius:25px;
justify-content:center;
@media (max-width: 1000px){
width:60%;
}
`;
const Raffle = styled.div`
width:45%;
height:14rem;
display: relative;
flex-direction: row;
align-items: center;
background-color:#72757E;
border-radius:25px;
@media (max-width: 1000px){
width:75%;
}
`;

const RaffleImg = styled.div`
background-image: url("https://media.discordapp.net/attachments/707421140179746946/800721357121126429/Wethenew-Air-Jordan-4-Off-White-Sail-1_1200x.webp");
background-repeat: no-repeat;
height:160px;
padding-left:280px;
padding-top:50px;
width:470px;
`;

const PanameExplain = styled.div`

width:80%;
display: flex;
flex-direction: row;
margin-bottom:2rem;
align-items: center;
background-color:#232329;
border-radius:25px;
justify-content:center;

@media (max-width: 1000px){
flex-direction: column;
align-items: center;
}
`;

const ButtonEmail = styled(Button)`
    color: white;
    ${({theme}) => `
    background-color: ${theme.palette.primary.main};
    `}
    font-weight: 600;
    text-transform: capitalize;
    font-size:20px;
    margin-top:10px;
`;

const Field = styled(TextField)`
    margin-bottom: 8px;
`;

const Basic = () => {

    const router = useRouter()
    const routerQuery = queryString.parse(router.asPath.split(/\?/)[1]);

    const [open, setOpen] = useState(routerQuery.modal === "1" ? true : false);
    const [isLoading, setLoading] = useState(false);
    const [ApolloError, setApolloError] = useState(null);
    const [registered, setRegistered] = useState(false);

    const [signUp] = useSignUpMailMutation();

    // Form
    const { register, handleSubmit, errors, setError, clearError } = useForm();

    // Recaptcha
    const [recaptcha, setRecaptcha] = useState("");
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

    const onSignUpSubmit = async (values: {email: string, fname: string, lname?: string}) => {
        setLoading(true);
        try{
            const id = await signUp({variables: {
                email: values.email,
                firstName: values.fname,
                lastName: values.lname ? values.lname : "",
                recaptcha
            }});
            if(id){
                setRegistered(true);
            }
        }catch(e){
            setApolloError(e.message);
            handleLoaded({});
        }
        setLoading(false);
    }

    return(
        <NoSsr>
            <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            style={{overflow: "auto"}}
            >
                <CenteredBox bgcolor="secondary.main">
                    <Container maxWidth="lg">
                        <Box textAlign="center">
                            <Box textAlign="center"  style={{display: "flex",alignItems: "center",flexDirection:"column", justifyContent: "center"}} pb={3}>
                                {
                                    !registered ?
                                    <>
                                        <TitleMain style={{ width:"100%", textAlign: "center", fontSize: "3rem"}}>    
                                            <Title size={2} variant="h1" component="h1">Looking to <u style={{textDecoration: "underline",textDecorationThickness: "8px",textDecorationColor: "#7F5AF0"}}>test out</u> paname.io?</Title>
                                        </TitleMain>
                                        <div
                                            style={{width: "90%"}}
                                        ><MockupLike/></div>
                                        
                                        <Paragraph style={{width:"90%",textAlign:"left",fontSize: "1.2em",marginTop:"30px",color:"grey"}}>We are soon going to let a few early testers join us. Become one of them by filling your email here.</Paragraph>
                                        <Paragraph style={{width:"90%",textAlign:"left",fontSize: "1.2em",color:"grey"}}>Fill your email so we can contact you as soon as a spot becomes available.</Paragraph>
                                        <form onSubmit={handleSubmit(onSignUpSubmit)} autoComplete="off" style={{width:"100%",padding: "auto"}}>
                                            <Field 
                                                type="text"
                                                name="fname"
                                                required
                                                error={errors.fname} helperText={errors.fname ? errors.fname.message : ""} 
                                                onChange={() => { clearError("fname"); }}
                                                inputRef={ register( {required: "Required"} ) } 
                                                id="outlined-basic" label="First name" variant="outlined" fullWidth />
                                            <Field 
                                                type="text"
                                                name="lname"
                                                error={errors.lname} helperText={errors.lname ? errors.lname.message : ""} 
                                                onChange={() => { clearError("lname"); }}
                                                id="outlined-basic" label="Last name" variant="outlined" fullWidth />
                                            <Field 
                                                name="email" 
                                                error={errors.email} helperText={errors.email ? errors.email.message : ""} 
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
                                                onChange={() => { clearError("email"); }}
                                                required
                                                id="outlined-basic" label="Email" variant="outlined" fullWidth />                                    
                                            { ApolloError ? 
                                                <Box mb={1}>
                                                    <Typography color="error" variant="inherit">{ApolloError}</Typography>
                                                </Box> : null   
                                            }
                                            <ButtonEmail
                                                type="submit" 
                                                disabled={isLoading}
                                                variant="contained" color="primary" fullWidth size="large"
                                            >Join Us</ButtonEmail>
                                        </form>
                                    </>
                                : 
                                    <>
                                        <TitleMain style={{ width:"100%", textAlign: "center", fontSize: "3rem"}}>    
                                            <Title size={2} variant="h1" component="h1">Thank you 🥰</Title>
                                            <Typography align="center">We will soon contact you 💖</Typography>
                                        </TitleMain>
                                        <Button type="button" onClick={() => {setOpen(false)}} variant="contained" color="default">Close</Button>
                                    </>
                                }
                            </Box>
                        </Box>
                    </Container>
                </CenteredBox>
            </Modal>

            <Navbar/>
            <Bottom/>
            <BackgroundHome />
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Container maxWidth="xl" style={{minHeight: "100vh"}}>
                        <div style={{display: "flex"}}>
                            <Title size={4} main mt={5} variant="h1" component="h1" style={{width: "100%", textAlign: "center"}}>
                                <Grid container direction="column" justify="center" alignItems="center" spacing={1}>
                                    <GradientWrapper content="Automate. " number={0} colorFrom="#7e5bf0" colorTo="#602fff" top="0px">Automate. </GradientWrapper>
                                    <GradientWrapper content="Your. " number={1} colorFrom="#18e0cb" colorTo="#259599" top="0px">Your.</GradientWrapper> 
                                    <GradientWrapper content="Raffles." number={2} colorFrom="#ffe200" colorTo="#ffbb21" top="0px">Raffles.⚡️</GradientWrapper> 
                                </Grid>
                            </Title>
                        </div>
                        <div style={{textAlign:"center", marginTop:"5vh"}}>
                            <Button onClick={() => setOpen(true)} variant="contained" color="primary">Start now!</Button>
                        </div>
                    </Container>
                </Grid>
                <Grid item xs={12}>
                    <Container maxWidth="xl">
                    <Grid container direction="column" justify="center" alignItems="center" >
                    <Separate> </Separate>
                    <Grid item xs={12}>
                        <TitleMain style={{ width:"100%", textAlign: "center", fontSize: "1rem",padding:"2rem"}}>
                            <ShadowTitle size={6.4} variant="h1" component="h1">60%</ShadowTitle>
                            <Title size={2} variant="h1" component="h1">More chances of winning a raffle.</Title>
                            <PurpleSubTitle size={3.4} variant="h1" component="h1" >by</PurpleSubTitle>
                        </TitleMain>
                        </Grid>
                        <Followingline></Followingline>
                        <Etape> <EtapeNumber  style={{ textAlign: "center",fontSize: "3.5rem"}}>1</EtapeNumber></Etape>
                        <PurpleTitle size={1.4} variant="h1" component="h1" style={{ textAlign: "center"}}>Entering automatically to every raffles</PurpleTitle>
                        <TitleMain style={{width: "100%", textAlign: "center", fontSize: "2rem",padding:"1rem", color:"#03B2FF"}}> INSTANTLY </TitleMain>

                        <PanameExplain>
                            <MockupExplain/>
                            <Paragraph style={{width:"100%", fontSize: "2rem",textAlign:"center",color:"white",padding: "0rem 1rem 0rem"}}>
                                Thanks to our cloud solution, you’ll get registered as soon as a raffle is launched for you favorite product.
                            </Paragraph>
                        </PanameExplain>

                        <Followingline></Followingline>
                        <Etape> <EtapeNumber  style={{ textAlign: "center",fontSize: "3.5rem"}}>2</EtapeNumber></Etape>
                        <PurpleTitle size={1.4} variant="h1" component="h1">Monitoring thousand of websites…</PurpleTitle>
                        <TitleMain style={{width: "100%", textAlign: "center", fontSize: "2rem",padding:"1rem", color:"#03B2FF"}}> INSTANTLY </TitleMain>
                        <RaffleBanner>
                            <Raffle>
                            <Grid container direction="row" justify="flex-start" alignItems="center" style={{float:"left",padding: "1rem 1rem 0rem"}}>
                                <LogoRaffle  />
                                    <Grid container direction="column" justify="flex-end" alignItems="flex-start" >
                                        
                                            <Title size={1.4} variant="h1" component="h1">Air Jordan 4</Title>
                                            <Paragraph style={{ width:"100%",fontSize: "13px",margin:"auto",color:"white"}}>
                                                NIKE
                                            </Paragraph>
                                            <Paragraph style={{ width:"100%", fontSize: "13px",margin:"auto",color:"#432F80"}}>
                                                Sneakers-Shop
                                            </Paragraph>
                                            <Paragraph style={{ width:"100%", fontSize: "13px",margin:"auto",color:"#03B2FF"}}>
                                                CV9388-100
                                            </Paragraph>
                                
                                    </Grid>
                                </Grid>
                            </Raffle>
                        </RaffleBanner>
                        <Paragraph style={{width:"50%", textAlign: "center", fontSize: "2rem",margin:"auto", padding: "0rem 0rem 3rem",color:"white"}}>
                        Our systems are constantly monitoring the web in search for new raffles.
                        </Paragraph>
                        <Dottingline ></Dottingline>
                        <PurpleTitle size={1.4} variant="h1" component="h1">… and getting alerted</PurpleTitle>
                        <TitleMain style={{width: "100%", textAlign: "center", fontSize: "2rem",padding:"0rem 0rem 3rem", color:"#03B2FF"}}> ON YOUR DEVICES </TitleMain>
                        <MockupLike />
                        <Paragraph style={{ width:"50%", textAlign: "center", fontSize: "2rem",margin:"auto", padding: "3rem 0rem 0rem",color:"white"}}>
                            Our mobile app is still in early development.
                        </Paragraph>
                        <Paragraph style={{ width:"50%", textAlign: "center", fontSize: "2rem",margin:"auto", padding: "0rem 0rem 3rem",color:"white"}}>
                            Make sure to <a href="https://twitter.com/paname_io" target="_blank" rel="noreferrer noopener">follow us on Twitter</a> to get alerted whenever it is available.
                        </Paragraph>
                            
                        <Followingline></Followingline>
                        <Etape> <EtapeNumber  style={{ textAlign: "center",fontSize: "3.5rem"}}>3</EtapeNumber></Etape>
                        <PurpleTitle size={1.4} variant="h1" component="h1">Chilling and waiting for your win</PurpleTitle>
                        <TitleMain style={{width: "100%", textAlign: "center", fontSize: "2rem",padding:"0rem 0rem 1rem", color:"#03B2FF"}}> GARANTED SUCCESS </TitleMain>
                        <MockupSofa/>
                        <Grid container item xs={12} spacing={3}>   
                        <StatBanner>
                                <Grid container direction="column"  alignItems="center">
                                    <Title size={2.4} variant="h1" component="h1">+100</Title>
                                    <GreySubTitle>HAPPY CLIENTS</GreySubTitle>
                                </Grid>
                                    <Separator/>
                                <Grid container direction="column"  alignItems="center">
                                    <Title size={2.4} variant="h1" component="h1">+1276</Title>
                                    <GreySubTitle>WEBSITES MONITORED</GreySubTitle>
                                </Grid>
                                    <Separator/>
                                <Grid container direction="column"  alignItems="center">
                                    <Title size={2.4} variant="h1" component="h1">100K</Title>
                                    <GreySubTitle>TASKS LAUNCHED</GreySubTitle>
                                </Grid>
                        </StatBanner>
                        </Grid>

                        <Container>
                            <Box textAlign="center" mb={10} style={{padding:"2rem 0rem 0rem"}}>
                                <Title size={3.4} variant="h2" component="h2">begin your journey with paname.io</Title>
                            </Box>
                            
                            <Grid container spacing={10} style={{marginBottom:"rem"}}>
                                <Plan type={PlanType.FREE} title="Discover"></Plan>
                                <Plan type={PlanType.PAID} title="Start Now" ></Plan>
                            </Grid>
                        </Container>
                    </Grid>
                    </Container>
                </Grid>
            </Grid>
        </NoSsr>
    );
}

export default Basic;