import React from 'react';
import styled from 'styled-components';
import { lightGrey, darkGrey } from '@components/components';

export const Importer = styled.div<{dragged: boolean}>`
    text-align: center;
    border: 1px dashed ${props => props.dragged ? darkGrey : lightGrey};
    margin-top: 0.4rem;
    border-radius: 6px;
    padding: 5rem;
    color: ${props => props.dragged ? darkGrey : lightGrey};
`;

export const ErrMessage = styled.h4`
    ${({theme}) => `
        color: ${theme.palette.error.main};
    `}
    font-weight: bold;
`;