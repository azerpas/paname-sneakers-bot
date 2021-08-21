// Components
import { H3title } from "@components/typography/title";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { BalanceTypo, BalancePaper } from "./index.style";
import Skeleton from '@material-ui/lab/Skeleton';
import Link from "next/link";
import * as ROUTES from '@constants/routes';
import { Boxx } from "@components/container";


export const BalanceWidget = ({value, children} : {value: any, children: React.ReactNode}) => {
    const balance = 0.0;
    return(
        <BalancePaper elevation={3}>
            <Boxx px={3} py={2}>
                <H3title>Balance</H3title>
                <BalanceTypo>
                    { 
                        value === undefined ? 
                        <Skeleton animation="wave" variant="text"/> 
                        : (value !== null ? value.toFixed(2) : "0.0")
                    }
                </BalanceTypo>
                {
                    value == 0.0 || value == null ?
                    <p style={{textAlign: "center"}}>
                        Current Balance
                    </p>
                    :
                    <p>
                        <h4>Current rates for </h4>
                        <ul>
                            <li>Captcha solving: 0.01€/captcha</li>
                        </ul>
                    </p>
                }
                {children}
            </Boxx>
        </BalancePaper>
    );
}