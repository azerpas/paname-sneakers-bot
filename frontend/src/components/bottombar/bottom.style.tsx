import styled from 'styled-components';
import { StyledIcon } from '@styled-icons/styled-icon';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
export const Icon = (props: {icon: StyledIcon}) => {
    const IconStyled = styled(props.icon)`
        width: 2rem;
    `;
    return(
        <IconStyled/>
    );
};

export const Bar = styled(BottomNavigation)`
    background-color: ${({theme}) => theme.palette.background.default};
    z-index: 2;
`;

export const BalanceNav = styled(BottomNavigationAction)`
        color:#32a860;
`;