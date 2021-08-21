import { H3title } from "@components/typography/title";
import { StatsPaper, StatsTypo } from "./index.style";
import Box from "@material-ui/core/Box";
import styled from "styled-components";

export const Stats = () => {
    const Warning = styled.p`
        ${({theme}) => `
            color: ${theme.palette.error.main};
        `}
        margin: 0;
    `;
    return(
        <StatsPaper elevation={3}>
            <Box px={3} py={2}>
                <H3title>Stats</H3title>
                <Warning>Work in progress 🏗</Warning>
                <StatsTypo>0</StatsTypo>
                <div>tasks this month</div>
            </Box>
        </StatsPaper>
    );
}