import styled from "styled-components";
import { darkBlue } from "@components/components";
import Paper from "@material-ui/core/Paper";

export const StatsPaper = styled(Paper)`
    background-color: ${darkBlue};
    margin-top:10px;
`;

export const StatsTypo = styled.h2`
    text-align: left;
    font-weight: bold;
    font-size: 3.5rem;
    opacity: 30%;
`;