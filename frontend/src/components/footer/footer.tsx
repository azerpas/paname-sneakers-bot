// MUI
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
// Styled
import styled from "styled-components";

const Title = styled(Typography)`
    font-size: 2rem;
    font-weight: 600;
    color: #F7F7F7;
`;

const Foot = styled(Container)`
    width: 100%;
    background-color: #242629;
`;

const Paragraph = styled.p<{size?: number}>`
    color: #94A1B2;
    font-size: ${props => props.size ? props.size+"rem" : "1rem"};
    font-weight: 600;
`; 

const Link = styled.a<{size?: number}>`
    color: #94A1B2;
    font-size: ${props => props.size ? props.size+"rem" : "1rem"};
    font-weight: 600;
    display: block;
    text-decoration: unset;
`;

export const Footer = () => (
    <Box mt={5}>
        <Foot maxWidth={false}>
            <Box p={4}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Title>paname</Title>
                        <Paragraph size={1}>A work by Symbiose SAS and @azerpas</Paragraph>
                        <Paragraph size={1}>Paname isn’t affiliated with any brand such as Nike, Adidas, Supreme.</Paragraph>
                        <Paragraph size={1}>©2020 Symbiose SAS. All Rights Reserved.</Paragraph>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Title>About</Title>
                        <Link>Terms of sales</Link>
                        <Link>Refunds</Link>
                        <Link>Disclaimer</Link>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Title>Contact us</Title>
                        <Link>Twitter</Link>
                        <Link href="mailto:hello@paname.io">Email</Link>
                    </Grid>
                </Grid>
            </Box>
        </Foot>
    </Box>
);