import styled from 'styled-components';
import { greenPaname, corail, lightGrey, darkBlue } from "@components/components";

export const Card = styled.div<{selected?: boolean}>`
    min-height: 2rem;
    min-width: 250px;
    ${({theme}) => `
        background-color: ${theme.palette.secondary.main};
        --box-shadow-color: ${theme.palette.primary.main};
    `};
    box-shadow: inset 0px 0px 0px 4px ${props => props.selected ? "var(--box-shadow-color)" : "transparent"};
    padding: 1rem;
    border-radius: 8px;
    margin-right: 0.4rem;
`;

export const H4 = styled.h4`
    margin: 0;
    text-transform: uppercase;
    font-weight: 600;
    font-size: 0.8rem;
`;

export const H3 = styled.h3`
    margin-top: 0;
`;

export const Header = styled.div`
    display: inline-flex;
    width: 100%;
    justify-content: space-around;
`;

export const Body = styled.section`
`;

export const Paragraph = styled.p`
    margin: 0;
`;

export const Sku = styled(Paragraph)`
    color: ${greenPaname};
`;

export const Colorway = styled(Paragraph)`
`;

export const Date = styled(Paragraph)`
    color: ${corail};
`;