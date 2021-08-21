import styled from "styled-components";

export const A = styled.a`
    ${({theme}) => `
        color: ${theme.palette.primary.main};
    `}
`;