import styled from "styled-components";

import btn from '@material-ui/core/Button'
import CircularProgress from "@material-ui/core/CircularProgress";

// Colors
import {white} from '../components'

export const DefaultBtn = styled(btn)<{color?: string,backgroundColor?: string, primary?: string}>`
    font-weight: 700;
    text-transform: capitalize;
    width: 100%;
    margin: 0.7rem 0;
    ${props => props.color ? `color: ${props.color};` : `color: ${white};`}
    ${props => props.backgroundColor && `background-color: ${props.backgroundColor};`}
`;

export const StateBtn = ({content, isLoading}: {content: string, isLoading: boolean}) => {
    if(isLoading){
        return(
            <CircularProgress color="primary"/>
        );
    }
    return(
        <>{content}</>
    );
};