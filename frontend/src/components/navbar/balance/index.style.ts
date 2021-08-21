import Button from "@material-ui/core/Button";
import { white, greenPaname } from "@components/components";
import styled from 'styled-components';

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
    border-radius: 0% 4px 4px 0%;
    background-color: ${greenPaname};
    font-size: 1.2em;
    font-weight: 600;
    text-transform: capitalize;
`;

export const BalanceAmount = styled(Button)`
    color: ${white};
    background-color: #6144ba;
    font-size: 1.2em;
    font-weight: 600;
    text-transform: capitalize;
    pointer-events: none;
    border-radius: 4px 0% 0% 4px;
    ::after{
        content: "€";
        font-size: 0.9rem;
    }
`;


export const BalanceTitle = styled(Button)`
    ${({theme}) => `
        color: ${white};  
        background-color: ${theme.palette.primary.main};
        font-size: 1.2em;
        font-weight: 600;
        text-transform: capitalize;
        pointer-events: none;
    `}
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
`;

