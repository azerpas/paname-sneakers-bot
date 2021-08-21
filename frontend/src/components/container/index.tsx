import styled from "styled-components";
import Box from "@material-ui/core/Box";

export const CenteredBox = styled(Box)`
    position: absolute;
    top: 75%;
    left: 50%;
    transform: translate(-50%,-50%);
    margin: 0 auto;
    border-radius: 8px;
    @media (max-width: 320px){
        width: 80%;
    }
    &:focus{
        outline: none;
    }
`;

export const Boxx = styled(Box)`
    outline: none;
    &:focus{
        outline: none;
    }
`;