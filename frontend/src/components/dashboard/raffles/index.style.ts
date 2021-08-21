import styled from "styled-components";
import { white,lightGrey } from "@components/components";
import Paper from "@material-ui/core/Paper";

export const RafflePaper = styled(Paper)`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    margin:auto;
    margin-top:10px;
    box-shadow: unset;
    margin-bottom:10px;
`;

export const StatsPaper = styled(Paper)`
    ${({theme}) => `
        background-color: ${theme.palette.secondary.main};
    `}
    margin-top:10px;
`;

export const Info = styled.h2`
    color: ${white};
    font-size: 0.7rem;
    margin-top: auto;
    margin-bottom:5px;
    font-weight: normal;
    margin:auto;
`;

export const TitleRaffle = styled.h2`
    color: ${white};
    font-size: 0.7rem;
    margin-top: auto;
    margin-bottom:5px;
    font-weight: normal;
    margin:auto;
    display:flex;
    flex-direction: row;
    text-transform: uppercase;
`;

export const RaffleInfos = styled(Paper)`
    display: column;
    flex-direction: row;
    justify-content: flex-start;
    margin:auto;
    margin-top:5px;
    margin:auto;
    margin-left:10px;
    box-shadow: unset;
`;

export const Colored = styled.u<{color: string, website?: boolean}>`
    color: ${props => props.color};
    text-decoration: none;
    display: inline;
    ${props => props.website && `text-transform: uppercase`};
    ${props => props.website && `font-weight: 700`};
`;