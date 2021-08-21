import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import Btn from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";

export const GridItem = styled(Grid)`

`;

export const NumberOfTasks = styled.h2`
    font-size: 3rem;
    font-weight: bolder;
    display: inline;
`;

export const Button = styled(Btn)`
    font-weight: bold;
`;

export const NewChip = styled(Chip)`
    margin-left: 0.4rem;
`;