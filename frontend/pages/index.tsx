// NEXT
import { GetServerSideProps } from 'next';
import Link from 'next/link';

// Custom components
import { Title, GradientWrapper } from "@components/typography/title";
import { Paragraph } from  "@components/typography/paragraph/paragraph";
import { CloudCard } from '@components/svg/CloudCard';
import { Navbar } from '@components/navbar/navbar';
import Bottom from '@components/bottombar/bottom';
import { Feature } from '@components/card/feature/feature';
import { Footer } from '@components/footer/footer';
import { Plan, PlanType } from '@components/card/plan/plan';

// Graphic & MUI
import styled, { css } from 'styled-components';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import NoSsr from '@material-ui/core/NoSsr';

// Misc
import { white, darkGrey } from '@components/components';
import * as ROUTES from "@constants/routes"

// Styled Components
const JoinUs = styled.a`
    ${({theme}) => `
        background-color: ${theme.palette.primary.main};
    `}
    padding: 0.5rem 3rem;
    font-size: 20px;
    font-weight: 600;
    color: ${white};
    text-transform: unset;
    border-radius: 40px;
`;
const VerticalAlign = styled.section<{full?: boolean, secondary?: boolean}>`
    display: flex;
    justify-content: center;
    align-items: ${props => props.full ? "center" : "baseline"};
    min-height: ${props => props.full ? "100vh" : "auto"};
    ${props => !props.full && css`flex-direction: column;`};
    ${props => !props.full && css`height: "100%";`};
    ${props => props.secondary && css`background-color: ${darkGrey};`};
    padding: 2rem 0;
`;

// Returning component
const landing = ({session}: {session: any}) => {
    // Landing page
    return(
        <NoSsr>
            <Navbar/>
            <Bottom/>
            <VerticalAlign full>
                <Container maxWidth="xl">
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6} style={{display:"flex"}}>
                            <VerticalAlign>
                                <Title size={4} variant="h1" component="h1">
                                    <GradientWrapper content="Cloud " number={0} colorFrom="#7e5bf0" colorTo="#602fff">Cloud </GradientWrapper>
                                    <GradientWrapper content="your " number={1} colorFrom="#18e0cb" colorTo="#259599">your </GradientWrapper> 
                                    <GradientWrapper 
                                        content="raffles.\00a0\00a0\00a0\00a0\00a0" /* Unicode escape to set place for revealing emoji */
                                        number={2} colorFrom="#ffe200" colorTo="#ffbb21">raffles. ⚡️</GradientWrapper>
                                </Title>
                                <Paragraph>Tired of entering your multiples entries to each raffle? Paname helps you register to every raffles almost instantly with its super fast cloud technology.</Paragraph>
                                <Link href={ROUTES.LOGIN}>
                                    <JoinUs>Cloud now</JoinUs>
                                </Link>
                            </VerticalAlign>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <CloudCard></CloudCard>
                        </Grid>
                    </Grid>
                </Container>
            </VerticalAlign>
            <VerticalAlign full secondary>
                <Container maxWidth="xl">
                    <Box my={5}>
                        <Box textAlign="center" width={{xs: "80%", sm: "70%", md: "50%"}} mx="auto">
                            <Title size={3.4} variant="h2" component="h2">Features</Title>
                            <Paragraph>Paname uses the very last technologies available to offer you super-speed and security. We take advantage of our years of knowledge to give you the best user experience.</Paragraph>
                        </Box>
                        <Grid container spacing={8}>
                            <Feature title="Cloud" icon="cloud" iconSize={3} paragraph="We believe that by taking advantage of the cloud computing we can build the most efficients robots with a scalable architecture, dedicated power and zero downtime."/>
                            <Feature title="Multi-Platform" icon="screens" iconSize={3} paragraph="Access to your dashboard from your favorite devices, our platform is optimized for all screens resolutions."/>
                            <Feature title="Light-speed" icon="bolt" paragraph="Hosted on FAANG servers, our bots uses the very best data-center high-speed connectivity to resolve our tasks."/>
                            <Feature title="Human-like" icon="human-bot" iconSize={3} paragraph="Our bots are developed to behave like humans. Each websites specificities are analyzed and taken into account in development. We use the latests bypass and strategies to get around bot recognition."/>
                            <Feature title="Security" icon="finger" iconSize={3} paragraph="Your data is one of our main concern. Protected over the wire using HTTPS and encrypted at-rest on FAANG servers, we make sure no third party will get access to your data."/>
                            <Feature title="Captcha solver" icon="recaptcha" iconSize={3} paragraph="Thanks to our advanced algorithm, we are able of generating recaptcha and h-captcha responses to get around the main bot protections in seconds and at low cost."/>
                        </Grid>
                    </Box>
                </Container>
            </VerticalAlign>
            <VerticalAlign full>
                <Container>
                    <Box textAlign="center" mb={10}>
                        <Title size={3.4} variant="h2" component="h2">Join us!</Title>
                    </Box>
                    
                    <Grid container spacing={10}>
                        <Plan type={PlanType.PAID} title="GET UNLIMITED 😍"></Plan>
                        <Plan type={PlanType.FREE}></Plan>
                    </Grid>
                </Container>
            </VerticalAlign>
            <Footer/>
        </NoSsr>
    );
};

export default landing;