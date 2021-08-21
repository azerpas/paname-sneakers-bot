import styled, { keyframes, css } from "styled-components";
import Typography from "@material-ui/core/Typography";
import {white, lightGrey} from "../../components";


export const Title = styled(Typography)<{component?: string,size?: number,mt?: number , mb?: number, main?: boolean}>`
    font-weight: bold;
    font-size: ${props => props.size ? props.size : "3"}rem;
    color: ${white};
    ${props => props.mb && `margin-bottom: ${props.mb}rem;`}
    ${props => props.mt && `margin-top: ${props.mt}rem;`}
    ${props => props.main && `
        font-size: 5rem;
        @media (max-width: 600px){
            font-size: 4rem;
        }
        @media (max-width: 380px){
            font-size: 3rem;
        }
    `}
`;

export const PurpleSubTitle = styled(Typography)<{component?: string,size?: number, mb?: number}>`
    font-weight: bold;
    font-size: ${props => props.size ? props.size : "3"}rem;
    ${({theme}) => `
        color: ${theme.palette.primary.main};
    `}
    ${props => props.mb && `margin-bottom: ${props.mb}rem;`}
`;

export const GreySubTitle = styled(Typography)<{component?: string,size?: number, mb?: number}>`
    font-weight: bold;
    font-size: ${props => props.size ? props.size : "1"}rem;
    color: #7e8085;
    text-align:center;
    margin:auto;
    ${props => props.mb && `margin-bottom: ${props.mb}rem;`}
`;

export const ShadowTitle = styled(Typography)<{component?: string,size?: number, mb?: number}>`
    font-weight: bold;
    text-Align:center;
    font-size: ${props => props.size ? props.size : "3"}rem;
    ${({theme}) => `
    text-shadow: 6px 0px 0px ${theme.palette.primary.main};
    color: ${white};
    `}
    ${props => props.mb && `margin-bottom: ${props.mb}rem;`}
`;

export const PurpleTitle = styled(Typography)<{component?: string,size?: number, mb?: number}>`
    font-weight: bold;
    font-size: ${props => props.size ? props.size : "3"}rem;
    ${({theme}) => `
    color: ${theme.palette.primary.main};
    `}
    margin-top:20px;
    ${props => props.mb && `margin-bottom: ${props.mb}rem;`}
`;

export const H1title = styled.h1<{size?: number, m?: {mt?: number, mb?: number, ml?: number, mr?: number}}>`
    font-weight: bold;
    font-size: ${props => props.size ? props.size : "3"}rem;
    color: ${white};
    ${props => props.m?.mb && `margin-bottom: ${props.m.mb}rem;`}
    ${props => props.m?.mt && `margin-top: ${props.m.mt}rem;`}
    ${props => props.m?.ml && `margin-left: ${props.m.ml}rem;`}
    ${props => props.m?.mr && `margin-right: ${props.m.mr}rem;`}
`;

export const H3title = styled.h3<{secondary?: boolean, mb?: number}>`
    margin-bottom: ${props => props.mb === undefined ? "1.5rem" : props.mb + "rem"};
    margin-top: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: ${props => props.secondary ? lightGrey : "inherit"};
`;

export const H4title = styled.h3<{secondary?: boolean, mb?: number}>`
    margin-bottom: 0px;
    margin-top: 0.5rem;
    font-size: 1rem;
    font-weight: 700;
    color: ${props => props.secondary ? lightGrey : "inherit"};
`;

type GradientProps = {number: number,colorFrom: string, colorTo: string, content: string, children: React.ReactNode, top?: string}

const fade_1 = keyframes`
    0%,16.667%,to {
        opacity: 1;
    }
    33.333%,83.333% {
        opacity:0;
    }
`;

const fade_2 = keyframes`
    0%,to {
        opacity: 0;
    }

    33.333%,50% {
        opacity: 1;
    }

    16.667%,66.667% {
        opacity: 0;
    }
`;

const fade_3 = keyframes`
    0%,50%,to {
        opacity: 0;
    }

    66.667%,83.333% {
        opacity: 1;
    }
`;

const faded = [fade_1,fade_2,fade_3];

const Gradient = styled.span<GradientProps>`
    position: absolute;
    left: 0;
    top: ${props => props.top ? `${props.top}` : `2px`};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-image: ${props => `linear-gradient(90deg,${props.colorFrom},${props.colorTo});`};
    -webkit-animation: ${props => css`${faded[props.number]} 8s infinite`};
    animation: ${props => css`${faded[props.number]} 8s infinite`};
    &::before{
        content: ${props => props.content};
    }
`;

const GradientBefore = styled.span<{content: string}>`
    position: relative;
    &:before{
        content: "${props => props.content}";
        position: inherit;
    }
`;

export const GradientWrapper = (props: GradientProps) => {
    return(
        <GradientBefore content={props.content}>
            <Gradient {...props}/>
        </GradientBefore>
    );
}