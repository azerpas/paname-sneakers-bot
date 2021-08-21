import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { white, greenPaname, darkGrey } from "@components/components";
import Paper from "@material-ui/core/Paper";


export const SeeMoreButton = styled(Button)`
    color: ${white};
    ${({theme}) => `
        background-color: ${theme.palette.background.default};
    `}
    font-weight: 600;
    text-transform: uppercase;
`;


export const BalanceTypo = styled.h2`
    text-align: center;
    font-weight: bold;
    font-size: 3.5rem;
    ::after{
        content: "€";
        font-size: 1.5rem;
    }
`;

export const BalanceButton = styled(Button)`
    color: ${white};
    background-color: ${greenPaname};
    font-weight: 600;
    text-transform: capitalize;
`;

export const BalancePaper = styled(Paper)`
    align-content:center;
    width:100%;
    ${({theme}) => `
        background-color: ${theme.palette.secondary.main};
    `}
`;

