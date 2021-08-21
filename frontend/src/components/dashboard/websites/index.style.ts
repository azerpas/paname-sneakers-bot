import { lightGrey } from "@components/components";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";

export const WebsitesPaper = styled(Paper)`
    background-color: ${lightGrey};
    margin-top:10px;
`;

export const Colored = styled.u<{color: string, website?: boolean}>`
    color: ${props => props.color};
    text-decoration: none;
    display: inline;
    ${props => props.website && `text-transform: uppercase`};
    ${props => props.website && `font-weight: 700`};
`;