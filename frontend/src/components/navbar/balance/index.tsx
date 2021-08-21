import Link from "next/link";
// Components
import Box from "@material-ui/core/Box";
import { BalanceButton, BalanceAmount } from "./index.style";
import { Plus } from '@styled-icons/entypo/Plus';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

import * as ROUTES from "@constants/routes";

export const Balance = ({value} : {value: number | undefined}) => {
    const balance = 0.0;
    return(
        <> 
            <Grid container direction="row" justify="center" alignItems="stretch">
                <Box paddingX={0.2}>
                    <BalanceAmount fullWidth variant="contained">                    
                        { 
                            value === undefined ? 
                            <Skeleton animation="wave" width={40} variant="text"/> :
                            (value !== null ? value.toFixed(2) : 0.0)
                        }
                    </BalanceAmount>
                </Box>  

                <Box paddingX={0.2}>
                    <Link href={ROUTES.BALANCE}>
                        <BalanceButton  fullWidth variant="contained"><Plus size="29"/></BalanceButton>
                    </Link>
                </Box>
            </Grid>
        </>
    );
}
export default Balance;