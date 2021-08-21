import Container from "@material-ui/core/Container";
import styled from "styled-components";

export const Content = styled(Container)`
    border-radius: 0.4rem;
    ${({theme}) => `
        background-color: ${theme.palette.secondary.main};
    `}
    &:focus{
        outline: none;
    }
`;