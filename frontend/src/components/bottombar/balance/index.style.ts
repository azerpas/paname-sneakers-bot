import styled from "styled-components";
import Button from "@material-ui/core/Button";

import { white, greenPaname } from "@components/components";
import { StyledIcon } from '@styled-icons/styled-icon';

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
    font-size: 1.2em;
    font-weight: 600;
    text-transform: capitalize;
`;

export const BalanceAmount = styled(Button)`
    color: ${white};
    background-color: #6144ba;
    font-size: 1.2em;
    font-weight: bold;
    text-transform: capitalize;
    pointer-events: none;
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
`;
