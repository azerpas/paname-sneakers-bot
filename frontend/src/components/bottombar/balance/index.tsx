// Components
import Box from "@material-ui/core/Box";
import { BalanceButton,BalanceTitle,BalanceAmount } from "./index.style";
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

import * as ROUTES from "@constants/routes";

export const Balance = ({value} : {value: any}) => {
    const balance = 0.0;
    return(
        <>  
            <Grid container direction="row" justify="center" alignItems="stretch">
                <Box paddingX={0.2}>
                    <BalanceTitle fullWidth variant="contained">Balance</BalanceTitle>
                </Box>

                <Box paddingX={0.2}>
                    <BalanceAmount fullWidth variant="contained">                    
                        { 
                            value === undefined ? 
                            <Skeleton animation="wave" width={40} variant="text"/> :
                            (value !== null ? value.toFixed(2)+ "€": "0.0")
                        }
                    </BalanceAmount>
                </Box>  
                <Box paddingX={0.2}>
                    <BalanceButton href={ROUTES.BALANCE} fullWidth variant="contained">+</BalanceButton>
                </Box>
            </Grid>
        </>

    );
}
export default Balance;