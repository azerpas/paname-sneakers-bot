import styled from "styled-components";

import { white, greenPaname } from "@components/components";
import Paper from "@material-ui/core/Paper";

export const BalanceTypo = styled.h2`
    text-align: center;
    font-weight: bold;
    font-size: 3.5rem;
    ::after{
        content: "€";
        font-size: 1.5rem;
    }
`;

export const BalancePaper = styled(Paper)`
    ${({theme}) => `
        background-color: ${theme.palette.primary.main};
    `}
`;